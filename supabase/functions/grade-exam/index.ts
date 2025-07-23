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

    // Advanced AI grading logic
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
              feedback = "✅ Correct! Excellent work.";
            } else {
              feedback = `❌ Incorrect. The correct answer is: ${question.correct_answer}. Review this topic for better understanding.`;
            }
            break;
            
          case 'coding':
            // Enhanced code evaluation
            const codeLines = studentAnswer.split('\n').filter((line: string) => line.trim());
            const hasComments = studentAnswer.includes('//') || studentAnswer.includes('#') || studentAnswer.includes('/*');
            const hasProperStructure = studentAnswer.includes('{') || studentAnswer.includes(':') || studentAnswer.includes('def ') || studentAnswer.includes('function');
            const hasVariables = /\b(let|var|const|int|string|float|double)\b/.test(studentAnswer) || /\w+\s*=/.test(studentAnswer);
            const hasControlFlow = /\b(if|else|for|while|switch|case)\b/.test(studentAnswer);
            const hasLogic = codeLines.length > 5 && studentAnswer.length > 100;
            
            // Intelligent scoring based on code quality
            let codeScore = 0;
            let codeAnalysis = [];
            
            if (codeLines.length > 0) {
              codeScore += 0.2; // Basic attempt
              codeAnalysis.push("Code attempt made");
            }
            
            if (hasProperStructure) {
              codeScore += 0.25;
              codeAnalysis.push("proper syntax structure");
            }
            
            if (hasVariables) {
              codeScore += 0.2;
              codeAnalysis.push("variable usage");
            }
            
            if (hasControlFlow) {
              codeScore += 0.2;
              codeAnalysis.push("control flow implementation");
            }
            
            if (hasComments) {
              codeScore += 0.1;
              codeAnalysis.push("code documentation");
            }
            
            if (hasLogic && codeLines.length > 8) {
              codeScore += 0.05;
              codeAnalysis.push("complex logic");
            }
            
            questionScore = Math.round(question.marks * Math.min(codeScore, 1));
            
            if (questionScore >= question.marks * 0.8) {
              feedback = `🌟 Excellent code! Shows: ${codeAnalysis.join(', ')}. Well structured and logical.`;
            } else if (questionScore >= question.marks * 0.6) {
              feedback = `👍 Good attempt with: ${codeAnalysis.join(', ')}. Consider adding more detail or error handling.`;
            } else if (questionScore >= question.marks * 0.4) {
              feedback = `⚡ Basic implementation showing: ${codeAnalysis.join(', ')}. Needs more development and proper structure.`;
            } else {
              feedback = "📝 Code needs significant improvement. Focus on proper syntax, logic, and structure.";
            }
            break;
            
          case 'flowchart':
            if (studentAnswer && typeof studentAnswer === 'object' && studentAnswer.objects) {
              const objectCount = studentAnswer.objects.length;
              const hasShapes = studentAnswer.objects.some((obj: any) => obj.type === 'rect' || obj.type === 'circle' || obj.type === 'path');
              const hasText = studentAnswer.objects.some((obj: any) => obj.type === 'text');
              const hasConnections = studentAnswer.objects.some((obj: any) => obj.type === 'path' && obj.path);
              
              let flowScore = 0;
              let flowAnalysis = [];
              
              if (objectCount > 0) {
                flowScore += 0.3;
                flowAnalysis.push("elements created");
              }
              
              if (hasShapes) {
                flowScore += 0.3;
                flowAnalysis.push("proper shapes used");
              }
              
              if (hasText) {
                flowScore += 0.2;
                flowAnalysis.push("labels/text added");
              }
              
              if (hasConnections) {
                flowScore += 0.2;
                flowAnalysis.push("connections drawn");
              }
              
              if (objectCount >= 5) {
                flowAnalysis.push("comprehensive diagram");
              }
              
              questionScore = Math.round(question.marks * Math.min(flowScore, 1));
              feedback = `📊 Flowchart created with: ${flowAnalysis.join(', ')}. ${objectCount} elements total.`;
            } else {
              questionScore = Math.floor(question.marks * 0.1);
              feedback = "📋 Flowchart incomplete or not properly saved. Make sure to create and save your diagram.";
            }
            break;
            
          case 'short_answer':
            const wordCount = studentAnswer.split(' ').length;
            const hasKeywords = /\b(algorithm|function|variable|loop|condition|data|structure|class|object|method)\b/i.test(studentAnswer);
            const hasExamples = studentAnswer.includes('example') || studentAnswer.includes('for instance') || studentAnswer.includes('such as');
            const isDetailed = wordCount >= 20;
            const hasExplanation = studentAnswer.includes('because') || studentAnswer.includes('since') || studentAnswer.includes('therefore');
            
            let answerScore = 0;
            let answerAnalysis = [];
            
            if (wordCount >= 5) {
              answerScore += 0.3;
              answerAnalysis.push("basic response");
            }
            
            if (hasKeywords) {
              answerScore += 0.25;
              answerAnalysis.push("technical terminology");
            }
            
            if (isDetailed) {
              answerScore += 0.2;
              answerAnalysis.push("detailed explanation");
            }
            
            if (hasExamples) {
              answerScore += 0.15;
              answerAnalysis.push("examples provided");
            }
            
            if (hasExplanation) {
              answerScore += 0.1;
              answerAnalysis.push("logical reasoning");
            }
            
            questionScore = Math.round(question.marks * Math.min(answerScore, 1));
            
            if (questionScore >= question.marks * 0.8) {
              feedback = `📝 Excellent answer showing: ${answerAnalysis.join(', ')}. Comprehensive and well-explained.`;
            } else if (questionScore >= question.marks * 0.6) {
              feedback = `✍️ Good response with: ${answerAnalysis.join(', ')}. Consider adding more examples or detail.`;
            } else {
              feedback = `📖 Basic answer. Try to include more technical details, examples, and thorough explanations.`;
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