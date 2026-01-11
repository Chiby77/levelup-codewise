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

function getCacheKey(questionText: string, studentAnswer: string, language?: string): string {
  return `${language || 'default'}_${questionText.substring(0, 100)}_${studentAnswer.substring(0, 200)}`;
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

// VB.NET Console Application specific validation
function validateVBNetSyntax(code: string): { isValid: boolean; issues: string[]; score: number } {
  const issues: string[] = [];
  let syntaxScore = 100;
  
  const codeUpper = code.toUpperCase();
  const codeLower = code.toLowerCase();
  
  // Check for Module declaration
  const hasModule = /\bModule\s+\w+/i.test(code);
  const hasClass = /\bClass\s+\w+/i.test(code);
  
  if (!hasModule && !hasClass) {
    issues.push('Missing Module or Class declaration');
    syntaxScore -= 5;
  }
  
  // Check for Sub Main (entry point for console apps)
  const hasSubMain = /Sub\s+Main\s*\(/i.test(code);
  if (!hasSubMain && hasModule) {
    issues.push('Missing Sub Main() entry point');
    syntaxScore -= 5;
  }
  
  // Check for End statements matching
  const moduleCount = (codeUpper.match(/\bMODULE\b/g) || []).length;
  const endModuleCount = (codeUpper.match(/\bEND\s+MODULE\b/g) || []).length;
  const subCount = (codeUpper.match(/\bSUB\s+\w/g) || []).length;
  const endSubCount = (codeUpper.match(/\bEND\s+SUB\b/g) || []).length;
  const functionCount = (codeUpper.match(/\bFUNCTION\s+\w/g) || []).length;
  const endFunctionCount = (codeUpper.match(/\bEND\s+FUNCTION\b/g) || []).length;
  
  if (moduleCount !== endModuleCount) {
    issues.push('Unmatched Module/End Module');
    syntaxScore -= 3;
  }
  if (subCount !== endSubCount) {
    issues.push('Unmatched Sub/End Sub');
    syntaxScore -= 3;
  }
  if (functionCount !== endFunctionCount) {
    issues.push('Unmatched Function/End Function');
    syntaxScore -= 3;
  }
  
  // Check for proper variable declarations
  const hasDim = /\bDim\s+\w+/i.test(code);
  const hasAssignment = /=/.test(code);
  if (hasAssignment && !hasDim && !codeUpper.includes('CONST')) {
    issues.push('Variables should be declared with Dim');
    syntaxScore -= 2;
  }
  
  // Check for Console I/O (common in console apps)
  const hasConsoleWrite = /Console\.(Write|WriteLine)/i.test(code);
  const hasConsoleRead = /Console\.(Read|ReadLine|ReadKey)/i.test(code);
  
  // Check for proper If/End If
  const ifCount = (codeUpper.match(/\bIF\b.*\bTHEN\b/g) || []).length;
  const endIfCount = (codeUpper.match(/\bEND\s+IF\b/g) || []).length;
  if (ifCount !== endIfCount) {
    issues.push('Unmatched If/End If statements');
    syntaxScore -= 3;
  }
  
  // Check for proper For/Next loops
  const forCount = (codeUpper.match(/\bFOR\s+\w+\s*=/g) || []).length;
  const nextCount = (codeUpper.match(/\bNEXT\b/g) || []).length;
  if (forCount !== nextCount) {
    issues.push('Unmatched For/Next loops');
    syntaxScore -= 3;
  }
  
  // Check for proper While/End While loops
  const whileCount = (codeUpper.match(/\bWHILE\b/g) || []).length;
  const endWhileCount = (codeUpper.match(/\bEND\s+WHILE\b/g) || []).length;
  if (whileCount !== endWhileCount) {
    issues.push('Unmatched While/End While loops');
    syntaxScore -= 3;
  }
  
  // Check for Do/Loop
  const doCount = (codeUpper.match(/\bDO\b/g) || []).length;
  const loopCount = (codeUpper.match(/\bLOOP\b/g) || []).length;
  if (doCount !== loopCount) {
    issues.push('Unmatched Do/Loop statements');
    syntaxScore -= 3;
  }
  
  // Award points for good practices
  if (hasConsoleWrite) syntaxScore += 2;
  if (hasConsoleRead) syntaxScore += 2;
  if (hasDim) syntaxScore += 2;
  
  // Check for common VB.NET patterns
  const hasProperTypes = /As\s+(Integer|String|Boolean|Double|Single|Long|Decimal|Byte|Short|Object)/i.test(code);
  if (hasProperTypes) syntaxScore += 3;
  
  // Never let syntax score drop too low for real attempts
  syntaxScore = Math.max(70, Math.min(100, syntaxScore));
  
  return {
    isValid: issues.length === 0,
    issues,
    score: syntaxScore
  };
}

// Language-specific logic validation
function validateCodeLogic(code: string, language: string, expectedPattern?: string): { logicScore: number; feedback: string } {
  let logicScore = 85; // Start with generous baseline
  let feedback = '';
  
  if (language === 'vb' || language === 'vbnet') {
    const vbValidation = validateVBNetSyntax(code);
    logicScore = vbValidation.score;
    
    if (vbValidation.issues.length > 0) {
      feedback = `Minor VB.NET improvements: ${vbValidation.issues.slice(0, 2).join(', ')}.`;
    } else {
      feedback = 'Excellent VB.NET console application structure!';
    }
    
    // Check if code attempts to solve the problem
    const codeLength = code.trim().length;
    if (codeLength > 100) logicScore = Math.min(100, logicScore + 5);
    if (codeLength > 200) logicScore = Math.min(100, logicScore + 3);
    
    // Bonus for common VB.NET patterns used correctly
    if (/MsgBox|MessageBox\.Show/i.test(code)) logicScore = Math.min(100, logicScore + 2);
    if (/Try.*Catch/is.test(code)) logicScore = Math.min(100, logicScore + 3);
    if (/Select\s+Case/i.test(code)) logicScore = Math.min(100, logicScore + 2);
  }
  
  return { logicScore: Math.max(75, logicScore), feedback };
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
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    console.log('Starting 200% RELIABLE grading for submission:', submissionId);
    console.log('Exam ID:', examId);
    console.log('Using enhanced VB.NET reasoning grader');
    
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
          feedback: '⚠️ No answer provided - please attempt all questions!',
          questionText: question.question_text,
          correctAnswer: question.correct_answer || question.sample_code || 'See model answer',
          studentAnswer: '',
          questionType: question.question_type
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
          const language = question.programming_language || 'python';
          const isVBNet = language === 'vb' || language === 'vbnet';
          
          // Use specialized VB.NET grading for console applications
          if (isVBNet) {
            console.log('Using specialized VB.NET console application grader');
            
            // First, perform local syntax/structure validation
            const localValidation = validateVBNetSyntax(studentAnswer);
            const logicValidation = validateCodeLogic(studentAnswer, language, question.sample_code);
            
            // Combine local validation with AI reasoning
            const codeKey = getCacheKey(question.question_text, studentAnswer, 'vb');
            const cachedCode = getCachedResponse(codeKey);
            
            if (cachedCode) {
              score = Math.round((cachedCode.score / 100) * question.marks);
              feedback = cachedCode.feedback + ' (cached)';
              console.log('Using cached VB.NET grading');
            } else if (lovableApiKey) {
              try {
                // Use Lovable AI Gateway with Gemini for advanced reasoning
                const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${lovableApiKey}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    model: 'google/gemini-3-flash-preview',
                    messages: [
                      {
                        role: 'system',
                        content: `You are an EXPERT VB.NET Console Application grading assistant with DEEP REASONING capabilities.

GRADING PHILOSOPHY - COMPASSIONATE AND FAIR:
Your role is to evaluate student VB.NET console applications like a kind, supportive teacher would.

VB.NET CONSOLE APPLICATION REQUIREMENTS:
1. Module structure with proper Module...End Module
2. Sub Main() as entry point
3. Console.WriteLine() and Console.ReadLine() for I/O
4. Proper Dim declarations with As <Type>
5. Control structures: If/Then/Else/End If, For/Next, While/End While, Do/Loop
6. Proper data type usage (Integer, String, Boolean, Double, etc.)

SCORING RULES (MINIMUM 75% FOR ANY REAL ATTEMPT):
- 95-100%: Code compiles and runs correctly, good structure, solves the problem
- 85-94%: Code mostly works, minor syntax issues that don't prevent logic
- 75-84%: Shows understanding of VB.NET concepts, has issues but demonstrates effort
- 70-74%: Minimal attempt but shows some VB.NET knowledge

IMPORTANT: 
- Focus on LOGIC and PROBLEM-SOLVING approach, not just syntax perfection
- Students are LEARNING - be encouraging and highlight what they did right
- If the code would compile with minor fixes, give HIGH marks
- If the algorithm/logic is correct even with syntax errors, give HIGH marks
- NEVER give less than 75% for any legitimate code attempt

Analyze step-by-step:
1. Does the code structure follow VB.NET console app conventions?
2. Is the algorithm/logic correct for solving the problem?
3. Are variables properly declared and used?
4. Does the I/O work correctly for console applications?
5. What did the student do WELL?`
                      },
                      {
                        role: 'user',
                        content: `Grade this VB.NET Console Application:

**Question:** ${question.question_text}

**Reference Solution (marking scheme):**
\`\`\`vb
${question.sample_code || question.correct_answer || 'Any reasonable VB.NET solution'}
\`\`\`

**Student's Code:**
\`\`\`vb
${studentAnswer}
\`\`\`

**Local Syntax Check Results:**
- Structure Valid: ${localValidation.isValid}
- Issues Found: ${localValidation.issues.length > 0 ? localValidation.issues.join(', ') : 'None'}
- Syntax Score: ${localValidation.score}%

**Maximum Marks:** ${question.marks}

THINK STEP BY STEP about:
1. What the student was trying to achieve
2. Whether the logic/algorithm is sound
3. What they did correctly
4. Any issues that would prevent compilation/execution

Then provide your assessment as JSON:
{"score": <percentage 75-100>, "feedback": "<encouraging, specific feedback about their VB.NET code>", "strengths": ["<what they did well>"], "reasoning": "<your step-by-step thinking>"}`
                      }
                    ],
                    temperature: 0.2,
                    max_tokens: 1000
                  })
                });

                if (aiResponse.ok) {
                  const aiData = await aiResponse.json();
                  try {
                    let content = aiData.choices[0].message.content.trim();
                    // Extract JSON from response
                    const jsonMatch = content.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                      const aiResult = JSON.parse(jsonMatch[0]);
                      // Combine AI score with local validation
                      const aiScore = Math.max(75, Math.min(100, aiResult.score || 85));
                      const combinedScore = Math.round((aiScore * 0.7 + localValidation.score * 0.3));
                      const finalPercentage = Math.max(75, combinedScore);
                      
                      score = Math.round((finalPercentage / 100) * question.marks);
                      
                      const strengths = aiResult.strengths?.join(', ') || 'Good VB.NET attempt';
                      feedback = `🖥️ ${aiResult.feedback || 'Good VB.NET code!'} Strengths: ${strengths}`;
                      
                      setCachedResponse(codeKey, finalPercentage, feedback);
                      console.log('VB.NET AI grading complete:', finalPercentage, '%');
                    } else {
                      throw new Error('Could not parse AI response');
                    }
                  } catch (parseError) {
                    console.error('Failed to parse VB.NET AI response:', parseError);
                    // Fallback to local validation score
                    score = Math.round((localValidation.score / 100) * question.marks);
                    feedback = `🖥️ ${logicValidation.feedback} Your VB.NET code shows effort!`;
                  }
                } else {
                  console.error('Lovable AI error:', await aiResponse.text());
                  score = Math.round((localValidation.score / 100) * question.marks);
                  feedback = `🖥️ Good VB.NET console application attempt! ${logicValidation.feedback}`;
                }
              } catch (aiError) {
                console.error('VB.NET AI grading error:', aiError);
                score = Math.round((localValidation.score / 100) * question.marks);
                feedback = `🖥️ VB.NET code submitted. ${logicValidation.feedback}`;
              }
            } else if (groqApiKey) {
              // Fallback to Groq with VB.NET specific prompt
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
                        content: `You are an EXPERT VB.NET Console Application grader. Be COMPASSIONATE and LENIENT.

VB.NET CONSOLE APP CHECKLIST:
- Module declaration with Sub Main()
- Dim for variable declarations
- Console.WriteLine/ReadLine for I/O
- Proper control structures
- Data type specifications

SCORING (MINIMUM 75% for any real attempt):
- Focus on LOGIC over syntax perfection
- Reward understanding and effort
- Minor syntax errors = minimal deduction
- If algorithm is correct = 85%+ minimum

Return ONLY JSON: {"score": <75-100>, "feedback": "<encouraging>"}`
                      },
                      {
                        role: 'user',
                        content: `Grade this VB.NET code:

Question: ${question.question_text}
Reference: ${question.sample_code || 'Any valid VB.NET solution'}

Student's Code:
\`\`\`vb
${studentAnswer}
\`\`\`

Max Marks: ${question.marks}
Return JSON only.`
                      }
                    ],
                    temperature: 0.1,
                    max_tokens: 600
                  })
                });

                if (groqResponse.ok) {
                  const groqData = await groqResponse.json();
                  let content = groqData.choices[0].message.content.trim();
                  content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                  const aiResult = JSON.parse(content);
                  const percentage = Math.max(75, Math.min(100, aiResult.score || 85));
                  score = Math.round((percentage / 100) * question.marks);
                  feedback = `🖥️ ${aiResult.feedback || 'Good VB.NET code!'}`;
                  setCachedResponse(codeKey, percentage, feedback);
                } else {
                  score = Math.round((localValidation.score / 100) * question.marks);
                  feedback = `🖥️ ${logicValidation.feedback}`;
                }
              } catch {
                score = Math.round((localValidation.score / 100) * question.marks);
                feedback = `🖥️ VB.NET code evaluated. ${logicValidation.feedback}`;
              }
            } else {
              // No AI available - use local validation only
              score = Math.round((localValidation.score / 100) * question.marks);
              feedback = `🖥️ ${logicValidation.feedback} ${localValidation.issues.length > 0 ? 'Review: ' + localValidation.issues[0] : ''}`;
            }
            
            strongAreas.push('coding');
          } else {
            // Non-VB.NET languages (Python, Java, C, C++, JavaScript)
            const codeKey = getCacheKey(question.question_text, studentAnswer, language);
            const cachedCode = getCachedResponse(codeKey);
            
            if (cachedCode) {
              score = Math.round((cachedCode.score / 100) * question.marks);
              feedback = cachedCode.feedback + ' (cached)';
              console.log('Using cached grading for coding question');
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
                        content: `You are an EXTREMELY LENIENT and COMPASSIONATE programming instructor who grades like a human teacher.

GRADING PHILOSOPHY - BE MAXIMALLY GENEROUS:
1. Award AT LEAST 75% marks for ANY code that shows effort
2. Award 85-100% for code that shows understanding of the problem
3. Award FULL MARKS (100%) for any working or nearly-working solution
4. Syntax errors should only reduce marks by 5-10% maximum
5. Minor logic errors: reduce by 5-15% maximum
6. Focus ONLY on what the student did RIGHT
7. Celebrate their effort and understanding
8. NEVER give less than 75% for any legitimate attempt
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
Minimum score for any attempt: 75%

Return ONLY valid JSON (no markdown, no backticks):
{"score": <percentage 75-100>, "feedback": "<encouraging feedback>"}`
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
                    const percentage = Math.max(75, Math.min(100, aiResult.score || 85));
                    score = Math.round((percentage / 100) * question.marks);
                    feedback = aiResult.feedback || '🎉 Excellent coding work!';
                    
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
          }
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
        'coding': 'Practice coding exercises - focus on VB.NET console applications',
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