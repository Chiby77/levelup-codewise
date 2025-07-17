import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { submissionId, examId, answers, questions } = await req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let totalScore = 0;
    const maxScore = questions.reduce((total: number, q: any) => total + q.marks, 0);
    const gradeDetails: any = {};

    // Simple AI grading logic
    for (const question of questions) {
      const studentAnswer = answers[question.id];
      let questionScore = 0;
      let feedback = "";

      if (!studentAnswer) {
        feedback = "No answer provided";
      } else {
        switch (question.question_type) {
          case 'multiple_choice':
            if (studentAnswer === question.correct_answer) {
              questionScore = question.marks;
              feedback = "Correct answer!";
            } else {
              feedback = `Incorrect. The correct answer is: ${question.correct_answer}`;
            }
            break;
            
          case 'coding':
            // Basic code evaluation
            const codeLines = studentAnswer.split('\n').filter((line: string) => line.trim());
            if (codeLines.length > 3) {
              questionScore = Math.floor(question.marks * 0.8); // 80% for attempt
              feedback = "Good coding attempt with proper structure";
            } else {
              questionScore = Math.floor(question.marks * 0.4); // 40% for basic attempt
              feedback = "Code needs more development and detail";
            }
            break;
            
          case 'flowchart':
            if (studentAnswer && typeof studentAnswer === 'object') {
              questionScore = Math.floor(question.marks * 0.9); // 90% for flowchart attempt
              feedback = "Flowchart created successfully";
            } else {
              questionScore = Math.floor(question.marks * 0.3);
              feedback = "Flowchart incomplete or missing";
            }
            break;
            
          case 'short_answer':
            const wordCount = studentAnswer.split(' ').length;
            if (wordCount >= 10) {
              questionScore = Math.floor(question.marks * 0.85); // 85% for detailed answer
              feedback = "Good detailed answer provided";
            } else {
              questionScore = Math.floor(question.marks * 0.5); // 50% for brief answer
              feedback = "Answer could be more detailed";
            }
            break;
        }
      }

      totalScore += questionScore;
      gradeDetails[question.id] = {
        score: questionScore,
        maxScore: question.marks,
        feedback: feedback
      };
    }

    // Update submission with grades
    const { error } = await supabase
      .from('student_submissions')
      .update({
        total_score: totalScore,
        graded: true,
        grade_details: gradeDetails
      })
      .eq('id', submissionId);

    if (error) throw error;

    return new Response(
      JSON.stringify({ 
        success: true, 
        totalScore, 
        maxScore, 
        percentage: Math.round((totalScore / maxScore) * 100) 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Grading error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});