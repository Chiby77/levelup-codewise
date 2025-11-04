import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const compareCode = (studentCode: string, expectedCode: string): number => {
  const normalize = (code: string) => code.toLowerCase().replace(/\s+/g, ' ').trim();
  const student = normalize(studentCode);
  const expected = normalize(expectedCode);
  
  if (student === expected) return 100;
  
  const similarityScore = (student.length / expected.length) * 100;
  return Math.min(similarityScore, 100);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { submissionId, examId, answers, questions: providedQuestions } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    
    console.log('Starting grading for submission:', submissionId);
    console.log('Exam ID:', examId);
    console.log('Provided questions:', providedQuestions?.length || 0);
    
    // Fetch questions from database if not provided or empty
    let questions = providedQuestions || [];
    if (!questions || questions.length === 0) {
      console.log('Fetching questions from database for exam:', examId);
      const { data: fetchedQuestions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('exam_id', examId)
        .order('order_number');
      
      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
        throw new Error('Failed to fetch questions for grading');
      }
      
      questions = fetchedQuestions || [];
      console.log('Fetched questions:', questions.length);
    }
    
    if (questions.length === 0) {
      throw new Error('No questions found for this exam');
    }
    
    let totalScore = 0;
    let maxScore = 0;
    const gradeDetails: any = {};

    for (const question of questions) {
      maxScore += question.marks;
      const studentAnswer = answers[question.id];
      
      if (!studentAnswer || studentAnswer.trim() === '') {
        gradeDetails[question.id] = {
          score: 0,
          maxScore: question.marks,
          feedback: 'No answer provided'
        };
        continue;
      }

      let score = 0;
      let feedback = '';

      switch (question.question_type) {
        case 'multiple_choice':
          const correctAnswer = question.correct_answer?.toLowerCase().trim();
          const studentAnswerLower = studentAnswer.toLowerCase().trim();
          
          if (studentAnswerLower === correctAnswer) {
            score = question.marks;
            feedback = 'Correct answer!';
          } else if (question.options && question.options.some((opt: string) => 
            opt.toLowerCase().includes(studentAnswerLower) || studentAnswerLower.includes(opt.toLowerCase())
          )) {
            score = question.marks * 0.3;
            feedback = 'Partially correct - close to the right answer';
          } else {
            score = 0;
            feedback = `Incorrect. Expected: ${question.correct_answer}`;
          }
          break;

        case 'coding':
          try {
            if (groqApiKey) {
              const { data: aiGradeData, error: aiError } = await supabase.functions.invoke(
                'groq-code-grader',
                {
                  body: {
                    code: studentAnswer,
                    expectedCode: question.sample_code || '',
                    language: question.programming_language || 'python',
                    maxMarks: question.marks,
                    questionText: question.question_text
                  }
                }
              );

              if (aiGradeData && !aiError) {
                score = aiGradeData.score || 0;
                feedback = aiGradeData.feedback || 'Graded by AI';
                break;
              }
            }
          } catch (aiError) {
            console.error('AI grading failed, using fallback:', aiError);
          }

          // Fallback rule-based grading
          const codeQuality = {
            hasStructure: studentAnswer.includes('def ') || studentAnswer.includes('function') || 
                          studentAnswer.includes('class') || studentAnswer.includes('Sub ') ||
                          studentAnswer.includes('Function ') || studentAnswer.includes('public ') ? 0.25 : 0,
            hasVariables: /(?:var|let|const|dim|int|string|double|float)\s+\w+/.test(studentAnswer) ? 0.15 : 0,
            hasControlFlow: /(?:if|for|while|switch|case|select case|do|loop)/.test(studentAnswer.toLowerCase()) ? 0.2 : 0,
            codeSimilarity: question.sample_code ? compareCode(studentAnswer, question.sample_code) / 100 * 0.4 : 0.2
          };
          
          const totalQuality = Object.values(codeQuality).reduce((a, b) => a + b, 0);
          score = Math.round(totalQuality * question.marks);
          feedback = `Code analysis: ${score >= question.marks * 0.7 ? 'Good solution' : 
                      score >= question.marks * 0.5 ? 'Acceptable solution with room for improvement' : 
                      'Needs significant improvement'}`;
          break;

        case 'flowchart':
          try {
            const flowchartData = JSON.parse(studentAnswer);
            const elements = flowchartData.elements || [];
            const connections = flowchartData.connections || [];
            
            const hasStart = elements.some((e: any) => e.type === 'start');
            const hasEnd = elements.some((e: any) => e.type === 'end');
            const hasProcess = elements.some((e: any) => e.type === 'process');
            const hasDecision = elements.some((e: any) => e.type === 'decision');
            const hasConnections = connections.length > 0;
            
            const flowchartScore = [hasStart, hasEnd, hasProcess, hasDecision, hasConnections]
              .filter(Boolean).length / 5;
            
            score = Math.round(flowchartScore * question.marks);
            feedback = `Flowchart evaluation: ${score >= question.marks * 0.8 ? 'Excellent flowchart structure' : 
                       score >= question.marks * 0.5 ? 'Good attempt, consider adding more detail' : 
                       'Basic flowchart, needs more components'}`;
          } catch (e) {
            score = question.marks * 0.2;
            feedback = 'Flowchart submitted but could not be fully evaluated';
          }
          break;

        case 'short_answer':
          const correctAnswerText = question.correct_answer || '';
          
          if (correctAnswerText && groqApiKey) {
            try {
              const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${groqApiKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: 'llama-3.1-70b-versatile',
                  messages: [
                    {
                      role: 'system',
                      content: `You are a fair and understanding teacher grading a student's short answer. Be lenient and give credit for:
- Correct concepts even if worded differently
- Partial understanding  
- Similar explanations with different phrasing
- Relevant examples
- Core ideas being present

Grade generously - students should get most marks if they understand the core concept, even if their answer isn't perfect.`
                    },
                    {
                      role: 'user',
                      content: `Question: ${question.question_text}

Expected Answer: ${correctAnswerText}

Student Answer: ${studentAnswer}

Maximum Marks: ${question.marks}

Please grade this answer and return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "score": <number between 0 and ${question.marks}>,
  "feedback": "<constructive feedback explaining the grade>",
  "strengths": ["what they got right"],
  "improvements": ["gentle suggestions if needed"]
}`
                    }
                  ],
                  temperature: 0.3,
                  max_tokens: 500
                })
              });

              if (groqResponse.ok) {
                const groqData = await groqResponse.json();
                let aiResult;
                
                try {
                  const content = groqData.choices[0].message.content.trim();
                  const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                  aiResult = JSON.parse(cleanContent);
                  
                  score = Math.min(Math.max(0, aiResult.score || 0), question.marks);
                  feedback = aiResult.feedback || 'Graded by AI';
                  
                  if (aiResult.strengths && aiResult.strengths.length > 0) {
                    feedback += '\n\nStrengths: ' + aiResult.strengths.join(', ');
                  }
                  if (aiResult.improvements && aiResult.improvements.length > 0) {
                    feedback += '\n\nSuggestions: ' + aiResult.improvements.join(', ');
                  }
                  break;
                } catch (parseError) {
                  console.error('Failed to parse AI response:', parseError);
                }
              }
            } catch (aiError) {
              console.error('AI grading failed:', aiError);
            }
          }

          // Fallback: keyword-based grading with correct answer comparison
          const answerLower = studentAnswer.toLowerCase();
          const correctLower = correctAnswerText.toLowerCase();
          const correctWords = correctLower.split(/\s+/).filter(w => w.length > 3);
          
          const wordCount = studentAnswer.split(/\s+/).length;
          const hasKeywords = correctWords.filter(word => answerLower.includes(word)).length;
          const keywordScore = correctWords.length > 0 ? hasKeywords / correctWords.length : 0.5;
          
          const qualityFactors = {
            length: wordCount >= 20 ? 0.2 : wordCount >= 10 ? 0.15 : 0.1,
            keywords: keywordScore * 0.5,
            detail: answerLower.includes('because') || answerLower.includes('example') || 
                   answerLower.includes('such as') ? 0.2 : 0.1,
            completeness: wordCount >= 30 && keywordScore > 0.6 ? 0.2 : 0.1
          };
          
          const totalQualityScore = Object.values(qualityFactors).reduce((a, b) => a + b, 0);
          score = Math.round(totalQualityScore * question.marks);
          feedback = `Answer analysis: ${score >= question.marks * 0.7 ? 'Good understanding shown' : 
                     score >= question.marks * 0.5 ? 'Acceptable answer, could be more detailed' : 
                     'Answer needs more detail and key concepts'}. Keywords matched: ${Math.round(keywordScore * 100)}%`;
          break;

        default:
          score = 0;
          feedback = 'Unable to grade this question type';
      }

      totalScore += score;
      gradeDetails[question.id] = {
        score: Math.round(score * 10) / 10,
        maxScore: question.marks,
        feedback: feedback
      };
    }

    console.log('Grading complete. Total score:', totalScore, 'out of', maxScore);
    
    const { error: updateError } = await supabase
      .from('student_submissions')
      .update({
        total_score: Math.round(totalScore * 10) / 10,
        max_score: maxScore,
        graded: true,
        grading_status: 'completed',
        grade_details: gradeDetails
      })
      .eq('id', submissionId);

    if (updateError) {
      console.error('Error updating submission:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        totalScore: Math.round(totalScore * 10) / 10,
        maxScore: maxScore,
        percentage: Math.round((totalScore / maxScore) * 100)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in grade-exam function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
