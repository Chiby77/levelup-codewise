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
            feedback = '✓ Correct answer!';
          } else if (question.options && question.options.some((opt: string) => 
            opt.toLowerCase().includes(studentAnswerLower) || studentAnswerLower.includes(opt.toLowerCase())
          )) {
            score = question.marks * 0.7; // Very generous partial credit
            feedback = 'Good attempt - close to the right answer';
          } else {
            // Still give some marks for attempting
            score = question.marks * 0.4;
            feedback = `Good try! You attempted the question. Expected: ${question.correct_answer}`;
          }
          break;

        case 'coding':
          // ULTRA LENIENT CODING GRADING - Give marks for ANY code attempt
          try {
            if (groqApiKey) {
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
                      content: `You are an EXTREMELY lenient coding instructor. Your grading philosophy:
- Give AT LEAST 70% marks if student wrote ANY code
- Give FULL marks if code shows ANY logical approach
- Award marks for effort, syntax attempts, comments, variable names
- Be VERY generous - focus on what's RIGHT, ignore what's wrong
- Even incomplete code deserves most marks
- Give benefit of doubt ALWAYS`
                    },
                    {
                      role: 'user',
                      content: `Question: ${question.question_text}

Student Code:
${studentAnswer}

Expected Approach:
${question.sample_code || 'Any reasonable solution'}

Maximum Marks: ${question.marks}

CRITICAL: Be ULTRA lenient. Give at least 70% for ANY code attempt. Give FULL marks if the logic is remotely correct.

Return ONLY valid JSON:
{
  "score": <number between ${Math.floor(question.marks * 0.7)} and ${question.marks}>,
  "feedback": "<encouraging feedback>"
}`
                    }
                  ],
                  temperature: 0.2,
                  max_tokens: 500
                })
              });

              if (groqResponse.ok) {
                const groqData = await groqResponse.json();
                try {
                  const content = groqData.choices[0].message.content.trim();
                  const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                  const aiResult = JSON.parse(cleanContent);
                  score = Math.max(Math.floor(question.marks * 0.7), Math.min(question.marks, aiResult.score || 0));
                  feedback = aiResult.feedback || 'Good coding effort!';
                  break;
                } catch (parseError) {
                  console.error('Failed to parse AI response:', parseError);
                }
              }
            }
          } catch (aiError) {
            console.error('AI grading failed, using ultra-lenient fallback:', aiError);
          }

          // ULTRA LENIENT FALLBACK - Give generous marks for ANY code
          const baseCodeScore = 0.7; // Start with 70% for ANY code
          const codeQuality = {
            base: baseCodeScore,
            hasStructure: (studentAnswer.includes('def ') || studentAnswer.includes('function') || 
                          studentAnswer.includes('class') || studentAnswer.includes('Sub ') ||
                          studentAnswer.includes('Function ') || studentAnswer.includes('public ')) ? 0.15 : 0,
            hasVariables: /(?:var|let|const|dim|int|string|double|float|Dim|Integer|String)\s+\w+/i.test(studentAnswer) ? 0.1 : 0,
            hasControlFlow: /(?:if|for|while|switch|case|select case|do|loop|then|else)/i.test(studentAnswer) ? 0.1 : 0,
          };
          
          const totalQuality = Math.min(1.0, Object.values(codeQuality).reduce((a, b) => a + b, 0));
          score = Math.round(totalQuality * question.marks);
          // Ensure minimum 70% for any code attempt
          score = Math.max(Math.floor(question.marks * 0.7), score);
          feedback = `Excellent coding effort! ${score >= question.marks * 0.9 ? 'Perfect solution!' : 
                      score >= question.marks * 0.7 ? 'Very good approach!' : 
                      'Good attempt!'}`;
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
                      content: `You are an extremely lenient and compassionate teacher grading a student's short answer. Your grading philosophy:
- ALWAYS give partial credit for ANY relevant attempt
- Be VERY generous - give at least 70% marks if the student shows ANY understanding
- Award marks for effort, relevant keywords, and attempts to answer
- Focus on what they got RIGHT, not what's missing
- Give benefit of doubt in all cases
- Even partially correct answers deserve most of the marks
- Look for ANY connection to the topic and award marks for it
- A student mentioning any related concept deserves marks

Be extremely lenient - err on the side of giving MORE marks rather than less.`
                    },
                    {
                      role: 'user',
                      content: `Question: ${question.question_text}

Expected Answer: ${correctAnswerText}

Student Answer: ${studentAnswer}

Maximum Marks: ${question.marks}

IMPORTANT: Be VERY lenient. Give generous marks for any attempt. If the student shows ANY understanding or effort, give at least 70% of marks.

Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "score": <number between 0 and ${question.marks}>,
  "feedback": "<positive, encouraging feedback>",
  "strengths": ["what they got right"],
  "improvements": ["gentle suggestions if needed"]
}`
                    }
                  ],
                  temperature: 0.2,
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

          // Fallback: VERY lenient keyword-based grading
          const answerLower = studentAnswer.toLowerCase();
          const correctLower = correctAnswerText.toLowerCase();
          const correctWords = correctLower.split(/\s+/).filter(w => w.length > 3);
          
          const wordCount = studentAnswer.split(/\s+/).length;
          const hasKeywords = correctWords.filter(word => answerLower.includes(word)).length;
          const keywordScore = correctWords.length > 0 ? hasKeywords / correctWords.length : 0.6;
          
          // VERY generous scoring - give high marks for any effort
          const baseScore = 0.6; // Start with 60% just for attempting
          const qualityFactors = {
            base: baseScore,
            length: wordCount >= 5 ? 0.15 : wordCount >= 3 ? 0.1 : 0.05,
            keywords: keywordScore * 0.25, // Keywords add bonus
          };
          
          const totalQualityScore = Math.min(1.0, Object.values(qualityFactors).reduce((a, b) => a + b, 0));
          score = Math.round(totalQualityScore * question.marks);
          // Ensure minimum marks for any attempt
          if (wordCount >= 3) {
            score = Math.max(score, Math.round(question.marks * 0.6));
          }
          feedback = `Good effort! ${score >= question.marks * 0.7 ? 'Excellent understanding' : 
                     score >= question.marks * 0.5 ? 'Good answer with relevant points' : 
                     'Valid attempt, shows understanding'}. Keywords matched: ${Math.round(keywordScore * 100)}%`;
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
