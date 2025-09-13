import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to compare code similarity
const compareCode = (studentCode: string, expectedCode: string): number => {
  const normalize = (code: string) => code.toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[{}();,]/g, '')
    .trim();
  
  const student = normalize(studentCode);
  const expected = normalize(expectedCode);
  
  if (!student || !expected) return 0;
  
  // Simple similarity check based on common keywords and structure
  const studentWords = student.split(' ').filter(w => w.length > 2);
  const expectedWords = expected.split(' ').filter(w => w.length > 2);
  
  let matches = 0;
  studentWords.forEach(word => {
    if (expectedWords.includes(word)) matches++;
  });
  
  return matches / Math.max(expectedWords.length, 1);
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
            // Enhanced multiple choice grading with better normalization
            const studentAns = studentAnswer?.toString()?.trim()?.toLowerCase()?.replace(/\s+/g, ' ') || '';
            const correctAns = question.correct_answer?.toString()?.trim()?.toLowerCase()?.replace(/\s+/g, ' ') || '';
            
            // Also check if student answer contains the correct answer or vice versa for partial matching
            const isExactMatch = studentAns === correctAns;
            const isPartialMatch = studentAns.includes(correctAns) || correctAns.includes(studentAns);
            
            if (isExactMatch) {
              questionScore = question.marks;
              feedback = "✅ Correct! Perfect match. Excellent work.";
            } else if (isPartialMatch && studentAns.length > 2 && correctAns.length > 2) {
              questionScore = Math.ceil(question.marks * 0.5); // Partial credit for close matches
              feedback = `⚡ Partially correct. Your answer: "${studentAnswer}". Expected: "${question.correct_answer}". Review for complete understanding.`;
            } else {
              feedback = `❌ Incorrect. Your answer: "${studentAnswer}". Correct answer: "${question.correct_answer}". Study this topic thoroughly.`;
            }
            break;
            
          case 'coding':
            // Advanced code evaluation with better metrics
            const codeLines = studentAnswer.split('\n').filter((line: string) => line.trim());
            const hasComments = studentAnswer.includes('//') || studentAnswer.includes('#') || studentAnswer.includes('/*') || studentAnswer.includes('"""');
            const hasProperStructure = studentAnswer.includes('{') || studentAnswer.includes(':') || studentAnswer.includes('def ') || studentAnswer.includes('function') || studentAnswer.includes('class ');
            const hasVariables = /\b(let|var|const|int|string|float|double|Dim|Public|Private)\b/i.test(studentAnswer) || /\w+\s*[=:]\s*/.test(studentAnswer);
            const hasControlFlow = /\b(if|else|for|while|switch|case|do|repeat|until|foreach|Select Case)\b/i.test(studentAnswer);
            const hasLogic = codeLines.length > 3 && studentAnswer.length > 50;
            const hasProcedures = /\b(Sub|Function|def|function|method|procedure)\b/i.test(studentAnswer);
            const hasErrorHandling = /\b(try|catch|except|error|On Error)\b/i.test(studentAnswer);
            const hasDataTypes = /\b(Integer|String|Boolean|Array|List|Dictionary|Object)\b/i.test(studentAnswer);
            
            // Compare against expected answer if provided
            const expectedCode = question.correct_answer || question.sample_code || '';
            const codeComparison = expectedCode ? compareCode(studentAnswer, expectedCode) : 0;
            
            // Intelligent scoring based on code quality and correctness
            let codeScore = 0;
            let codeAnalysis = [];
            
            // Base attempt score
            if (codeLines.length > 0 && studentAnswer.length > 10) {
              codeScore += 0.15;
              codeAnalysis.push("code attempt made");
            }
            
            // Structure and syntax (20%)
            if (hasProperStructure) {
              codeScore += 0.2;
              codeAnalysis.push("proper syntax structure");
            }
            
            // Variable usage (15%)
            if (hasVariables) {
              codeScore += 0.15;
              codeAnalysis.push("variable declarations");
            }
            
            // Control flow (20%)
            if (hasControlFlow) {
              codeScore += 0.2;
              codeAnalysis.push("control structures");
            }
            
            // Procedures/Functions (15%)
            if (hasProcedures) {
              codeScore += 0.15;
              codeAnalysis.push("procedures/functions");
            }
            
            // Code comparison with expected answer (15%)
            if (codeComparison > 0.5) {
              codeScore += 0.15;
              codeAnalysis.push("correct algorithm approach");
            } else if (codeComparison > 0.3) {
              codeScore += 0.1;
              codeAnalysis.push("similar approach");
            }
            
            // Additional features (10% total)
            if (hasComments) {
              codeScore += 0.05;
              codeAnalysis.push("documentation");
            }
            
            if (hasDataTypes) {
              codeScore += 0.03;
              codeAnalysis.push("proper data types");
            }
            
            if (hasErrorHandling) {
              codeScore += 0.02;
              codeAnalysis.push("error handling");
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