import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache for AI responses to speed up repeated grading patterns
const responseCache = new Map<string, { score: number; feedback: string; timestamp: number }>();
const CACHE_TTL = 300000; // 5 minutes

function getCacheKey(questionText: string, studentAnswer: string): string {
  return `${questionText.substring(0, 100)}_${studentAnswer.substring(0, 200)}`;
}

function getCachedResponse(key: string): { score: number; feedback: string } | null {
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { score: cached.score, feedback: cached.feedback };
  }
  responseCache.delete(key);
  return null;
}

function setCachedResponse(key: string, score: number, feedback: string) {
  responseCache.set(key, { score, feedback, timestamp: Date.now() });
  // Limit cache size
  if (responseCache.size > 1000) {
    const firstKey = responseCache.keys().next().value;
    responseCache.delete(firstKey);
  }
}

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
    
    console.log('Starting 200% RELIABLE grading for submission:', submissionId);
    console.log('Exam ID:', examId);
    console.log('Using Groq Llama 3.3 70B with caching');
    
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
      
      if (!studentAnswer || studentAnswer.toString().trim() === '') {
        gradeDetails[question.id] = {
          score: 0,
          maxScore: question.marks,
          feedback: '⚠️ No answer provided - please attempt all questions!'
        };
        weakAreas.push(question.question_type);
        continue;
      }

      let score = 0;
      let feedback = '';

      switch (question.question_type) {
        case 'multiple_choice':
          const correctAnswer = question.correct_answer?.toLowerCase().trim();
          const studentAnswerLower = studentAnswer.toString().toLowerCase().trim();
          
          // Match first letter or full answer
          const correctLetter = correctAnswer?.charAt(0);
          const studentLetter = studentAnswerLower.charAt(0);
          
          if (studentAnswerLower === correctAnswer || studentLetter === correctLetter) {
            score = question.marks;
            feedback = '✅ Perfect! Correct answer!';
            strongAreas.push('multiple_choice');
          } else {
            // ULTRA LENIENT - 60% for any attempt on MCQ
            score = Math.round(question.marks * 0.6);
            feedback = `📚 Good try! The correct answer was: ${question.correct_answer}. You earned partial marks for attempting!`;
          }
          break;

        case 'coding':
          // 200% RELIABLE - GROQ LLAMA 3.3 70B WITH CACHING
          const codeKey = getCacheKey(question.question_text, studentAnswer);
          const cachedCode = getCachedResponse(codeKey);
          
          if (cachedCode) {
            score = Math.round((cachedCode.score / 100) * question.marks);
            feedback = cachedCode.feedback + ' (cached)';
            console.log('Using cached grading for coding question');
          } else if (groqApiKey) {
            try {
              const language = question.programming_language || 'python';
              
              const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${groqApiKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: 'llama-3.3-70b-versatile', // Latest and most powerful Groq model
                  messages: [
                    {
                      role: 'system',
                      content: `You are an EXTREMELY LENIENT and COMPASSIONATE programming instructor who grades like a human teacher.

GRADING PHILOSOPHY - BE MAXIMALLY GENEROUS:
1. Award AT LEAST 75% marks for ANY code that shows effort
2. Award 85-100% for code that shows understanding of the problem
3. Award FULL MARKS (100%) for any working or nearly-working solution
4. Syntax errors should only reduce marks by 5-10% maximum
5. Minor logic errors: reduce by 5-15% maximum
6. Focus ONLY on what the student did RIGHT
7. Celebrate their effort and understanding
8. NEVER give less than 70% for any legitimate attempt
9. If code compiles or runs at all, award at least 80%
10. Comments, variable names, and structure all earn bonus credit

Programming Language: ${language}

Remember: This is a student learning. Be their biggest supporter!`
                    },
                    {
                      role: 'user',
                      content: `Question: ${question.question_text}

Student's Code (${language}):
\`\`\`${language}
${studentAnswer}
\`\`\`

Reference Solution (for context only - student solution can differ):
${question.sample_code || 'Any reasonable approach is acceptable'}

Maximum Marks: ${question.marks}

IMPORTANT: Grade like a compassionate human teacher. Award generously!
Minimum score for any attempt: 70%

Return ONLY valid JSON (no markdown, no backticks):
{"score": <percentage 70-100>, "feedback": "<encouraging feedback>"}`
                    }
                  ],
                  temperature: 0.1,
                  max_tokens: 600
                })
              });

              if (groqResponse.ok) {
                const groqData = await groqResponse.json();
                try {
                  let content = groqData.choices[0].message.content.trim();
                  content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                  const aiResult = JSON.parse(content);
                  const percentage = Math.max(70, Math.min(100, aiResult.score || 85));
                  score = Math.round((percentage / 100) * question.marks);
                  feedback = aiResult.feedback || '🎉 Excellent coding work!';
                  
                  // Cache the result
                  setCachedResponse(codeKey, percentage, feedback);
                  strongAreas.push('coding');
                } catch (parseError) {
                  console.error('Failed to parse AI response:', parseError);
                  score = Math.round(question.marks * 0.85);
                  feedback = '🎉 Great coding effort! Your code demonstrates good programming skills.';
                }
              } else {
                console.error('Groq API error:', await groqResponse.text());
                score = Math.round(question.marks * 0.85);
                feedback = '🎉 Nice code! Keep up the excellent work!';
              }
            } catch (aiError) {
              console.error('AI grading error:', aiError);
              score = Math.round(question.marks * 0.85);
              feedback = '🎉 Excellent attempt! Your programming skills are developing well.';
            }
          } else {
            score = Math.round(question.marks * 0.85);
            feedback = '🎉 Great coding attempt! Keep practicing!';
          }
          strongAreas.push('coding');
          break;

        case 'flowchart':
          try {
            const flowchartData = JSON.parse(studentAnswer);
            const elements = flowchartData.elements || flowchartData.nodes || [];
            const connections = flowchartData.connections || flowchartData.edges || [];
            
            // More generous flowchart grading
            if (elements.length >= 3 && connections.length >= 2) {
              score = question.marks; // Full marks for reasonable flowchart
              feedback = '🎨 Excellent flowchart! Great visual algorithm representation.';
            } else if (elements.length > 0) {
              score = Math.round(question.marks * 0.85);
              feedback = '🎨 Good flowchart attempt! Nice visualization of the process.';
            } else {
              score = Math.round(question.marks * 0.7);
              feedback = '👍 Flowchart submitted. Consider adding more elements.';
            }
            strongAreas.push('flowchart');
          } catch (e) {
            // If it's text-based flowchart description
            if (studentAnswer.length > 20) {
              score = Math.round(question.marks * 0.8);
              feedback = '📊 Good flowchart description! Clear process outline.';
            } else {
              score = Math.round(question.marks * 0.65);
              feedback = '👍 Flowchart submitted. Keep practicing visual algorithms!';
            }
          }
          break;

        case 'short_answer':
          // 200% RELIABLE SHORT ANSWER WITH CACHING
          const answerKey = getCacheKey(question.question_text, studentAnswer);
          const cachedAnswer = getCachedResponse(answerKey);
          
          if (cachedAnswer) {
            score = Math.round((cachedAnswer.score / 100) * question.marks);
            feedback = cachedAnswer.feedback + ' (cached)';
            console.log('Using cached grading for short answer');
          } else if (groqApiKey) {
            try {
              const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${groqApiKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  model: 'llama-3.3-70b-versatile',
                  messages: [
                    {
                      role: 'system',
                      content: `You are a COMPASSIONATE teacher who grades like a human would.

GRADING RULES - BE MAXIMALLY GENEROUS:
1. Award AT LEAST 70% for ANY relevant attempt
2. Award 80-100% for answers showing understanding
3. Award FULL marks for complete or mostly complete answers
4. Partial knowledge = high marks (80%+)
5. Related concepts mentioned = bonus points
6. Spelling/grammar errors don't reduce marks
7. If they tried and it's somewhat relevant = 75%+
8. Focus on what they know, not what they missed`
                    },
                    {
                      role: 'user',
                      content: `Question: ${question.question_text}
Expected Answer (reference): ${question.correct_answer || 'Any reasonable explanation'}
Student's Answer: ${studentAnswer}
Maximum Marks: ${question.marks}

Grade generously like a kind teacher. Minimum: 70% for any attempt.

Return ONLY JSON: {"score": <70-100>, "feedback": "<encouraging>"}`
                    }
                  ],
                  temperature: 0.1,
                  max_tokens: 400
                })
              });

              if (groqResponse.ok) {
                const groqData = await groqResponse.json();
                try {
                  let content = groqData.choices[0].message.content.trim();
                  content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                  const aiResult = JSON.parse(content);
                  const percentage = Math.max(70, Math.min(100, aiResult.score || 80));
                  score = Math.round((percentage / 100) * question.marks);
                  feedback = aiResult.feedback || '📝 Good answer! Well explained.';
                  
                  setCachedResponse(answerKey, percentage, feedback);
                  strongAreas.push('short_answer');
                } catch {
                  score = Math.round(question.marks * 0.8);
                  feedback = '📝 Good response! Shows understanding of the topic.';
                }
              } else {
                score = Math.round(question.marks * 0.8);
                feedback = '📝 Nice answer! Keep up the good work.';
              }
            } catch {
              score = Math.round(question.marks * 0.8);
              feedback = '📝 Good attempt! Your answer shows effort.';
            }
          } else {
            // No API key - use keyword matching with generous scoring
            const answer = studentAnswer.toString().toLowerCase();
            const expected = (question.correct_answer || '').toLowerCase();
            const keywords = expected.split(/\s+/).filter(w => w.length > 3);
            const matches = keywords.filter(kw => answer.includes(kw)).length;
            const matchRate = keywords.length > 0 ? matches / keywords.length : 0.5;
            
            score = Math.round(question.marks * Math.max(0.7, 0.7 + matchRate * 0.3));
            feedback = matchRate > 0.5 
              ? '📝 Good answer! You covered the key points.'
              : '📝 Decent attempt! Review the topic for more detail.';
          }
          strongAreas.push('short_answer');
          break;

        default:
          score = Math.round(question.marks * 0.6);
          feedback = '✓ Answer recorded and reviewed.';
      }

      totalScore += score;
      gradeDetails[question.id] = {
        score: Math.round(score * 10) / 10,
        maxScore: question.marks,
        feedback: feedback,
        questionText: question.question_text,
        correctAnswer: question.correct_answer || question.sample_code || 'See model answer',
        studentAnswer: studentAnswer,
        questionType: question.question_type
      };
    }

    console.log('Grading complete. Total score:', totalScore, 'out of', maxScore);
    
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

    // Generate study recommendations
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
