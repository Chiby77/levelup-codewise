import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    
    console.log('Starting ULTRA-LENIENT grading for submission:', submissionId);
    console.log('Exam ID:', examId);
    
    // Fetch questions from database
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
    }
    
    if (questions.length === 0) {
      throw new Error('No questions found for this exam');
    }
    
    let totalScore = 0;
    let maxScore = 0;
    const gradeDetails: any = {};
    const weakAreas: string[] = [];
    const strongAreas: string[] = [];

    for (const question of questions) {
      maxScore += question.marks;
      const studentAnswer = answers[question.id];
      
      if (!studentAnswer || studentAnswer.trim() === '') {
        gradeDetails[question.id] = {
          score: 0,
          maxScore: question.marks,
          feedback: 'No answer provided - please attempt all questions!'
        };
        weakAreas.push(question.question_type);
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
            feedback = '✅ Perfect! Correct answer!';
            strongAreas.push('multiple_choice');
          } else {
            // ULTRA LENIENT - give partial marks for any attempt
            score = Math.round(question.marks * 0.5);
            feedback = `Good try! The correct answer was: ${question.correct_answer}. You still earned partial marks for attempting!`;
          }
          break;

        case 'coding':
          // ULTRA LENIENT GROQ LLAMA 8B GRADING
          if (groqApiKey) {
            try {
              const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${groqApiKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: 'llama-3.1-8b-instant', // Using Llama 8B as requested
                  messages: [
                    {
                      role: 'system',
                      content: `You are an EXTREMELY lenient and encouraging programming instructor. Your philosophy:
- Award AT LEAST 75% marks for ANY code attempt
- Give FULL marks (100%) if the code shows ANY logical approach to the problem
- Award marks generously for: variable declarations, function definitions, loops, conditions, comments
- Focus ONLY on what the student did RIGHT
- Be maximally encouraging and supportive
- NEVER be harsh or critical
- Every attempt deserves recognition
- Syntax errors should not significantly reduce marks
- Partial solutions deserve most marks`
                    },
                    {
                      role: 'user',
                      content: `Question: ${question.question_text}

Student's Code:
${studentAnswer}

Expected Approach (for reference only):
${question.sample_code || 'Any reasonable solution'}

Maximum Marks: ${question.marks}
Minimum marks to award: ${Math.round(question.marks * 0.75)} (for any attempt)

CRITICAL INSTRUCTION: Be ULTRA LENIENT. Award at minimum 75% for ANY code. Award 100% if code shows understanding.

Return ONLY valid JSON (no markdown):
{
  "score": <number between ${Math.round(question.marks * 0.75)} and ${question.marks}>,
  "feedback": "<encouraging, positive feedback highlighting what they did well>"
}`
                    }
                  ],
                  temperature: 0.1,
                  max_tokens: 500
                })
              });

              if (groqResponse.ok) {
                const groqData = await groqResponse.json();
                try {
                  const content = groqData.choices[0].message.content.trim();
                  const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                  const aiResult = JSON.parse(cleanContent);
                  score = Math.max(Math.round(question.marks * 0.75), Math.min(question.marks, aiResult.score || question.marks * 0.8));
                  feedback = aiResult.feedback || '🎉 Great coding effort! Keep it up!';
                  strongAreas.push('coding');
                } catch (parseError) {
                  console.error('Failed to parse AI response:', parseError);
                  score = Math.round(question.marks * 0.8);
                  feedback = '🎉 Great coding effort! Your code shows good understanding.';
                }
              } else {
                throw new Error('Groq API failed');
              }
            } catch (aiError) {
              console.error('AI grading failed, using ultra-lenient fallback:', aiError);
              score = Math.round(question.marks * 0.8);
              feedback = '🎉 Excellent attempt! Your code demonstrates good programming skills.';
            }
          } else {
            // Fallback without AI - still ultra lenient
            score = Math.round(question.marks * 0.8);
            feedback = '🎉 Great coding attempt! Keep practicing!';
          }
          strongAreas.push('coding');
          break;

        case 'flowchart':
          try {
            const flowchartData = JSON.parse(studentAnswer);
            const elements = flowchartData.elements || [];
            
            // Give high marks for any flowchart attempt
            score = elements.length > 0 ? Math.round(question.marks * 0.85) : Math.round(question.marks * 0.6);
            feedback = elements.length > 0 
              ? '🎨 Excellent flowchart! Great visual representation of the algorithm.'
              : '👍 Good attempt at creating a flowchart. Try adding more elements.';
            strongAreas.push('flowchart');
          } catch (e) {
            score = Math.round(question.marks * 0.6);
            feedback = '👍 Flowchart submitted. Keep practicing visual algorithm design!';
          }
          break;

        case 'short_answer':
          // ULTRA LENIENT SHORT ANSWER GRADING
          if (groqApiKey) {
            try {
              const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${groqApiKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: 'llama-3.1-8b-instant',
                  messages: [
                    {
                      role: 'system',
                      content: `You are an EXTREMELY lenient teacher. Award marks generously:
- Give AT LEAST 70% for ANY relevant attempt
- Award full marks if answer shows ANY understanding
- Focus on what's RIGHT, ignore what's missing
- Be maximally encouraging
- Any mention of related concepts deserves high marks`
                    },
                    {
                      role: 'user',
                      content: `Question: ${question.question_text}
Expected: ${question.correct_answer || 'Any reasonable answer'}
Student Answer: ${studentAnswer}
Max Marks: ${question.marks}

Be ULTRA LENIENT. Return ONLY JSON:
{"score": <min 70% of ${question.marks}>, "feedback": "<encouraging>"}`
                    }
                  ],
                  temperature: 0.1,
                  max_tokens: 300
                })
              });

              if (groqResponse.ok) {
                const groqData = await groqResponse.json();
                try {
                  const content = groqData.choices[0].message.content.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
                  const aiResult = JSON.parse(content);
                  score = Math.max(Math.round(question.marks * 0.7), Math.min(question.marks, aiResult.score || question.marks * 0.75));
                  feedback = aiResult.feedback || '📝 Good answer! Well explained.';
                } catch {
                  score = Math.round(question.marks * 0.75);
                  feedback = '📝 Good response! Shows understanding of the topic.';
                }
              } else {
                score = Math.round(question.marks * 0.75);
                feedback = '📝 Nice answer! Keep up the good work.';
              }
            } catch {
              score = Math.round(question.marks * 0.75);
              feedback = '📝 Good attempt! Your answer shows effort.';
            }
          } else {
            score = Math.round(question.marks * 0.7);
            feedback = '📝 Good answer! Shows understanding.';
          }
          strongAreas.push('short_answer');
          break;

        default:
          score = Math.round(question.marks * 0.5);
          feedback = 'Answer recorded.';
      }

      totalScore += score;
      gradeDetails[question.id] = {
        score: Math.round(score * 10) / 10,
        maxScore: question.marks,
        feedback: feedback
      };
    }

    console.log('ULTRA-LENIENT grading complete. Total score:', totalScore, 'out of', maxScore);
    
    // Update submission
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

    // Generate study recommendations based on weak areas
    const uniqueWeakAreas = [...new Set(weakAreas)];
    const studyRecommendations = uniqueWeakAreas.map(area => {
      const recommendations: Record<string, string> = {
        'multiple_choice': 'Review theory concepts and practice more MCQs',
        'coding': 'Practice coding exercises on platforms like LeetCode or HackerRank',
        'flowchart': 'Study algorithm design and practice creating flowcharts',
        'short_answer': 'Read more about the topics and practice explaining concepts'
      };
      return recommendations[area] || 'Continue practicing!';
    });

    return new Response(
      JSON.stringify({
        success: true,
        totalScore: Math.round(totalScore * 10) / 10,
        maxScore: maxScore,
        percentage: Math.round((totalScore / maxScore) * 100),
        weakAreas: uniqueWeakAreas,
        studyRecommendations
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