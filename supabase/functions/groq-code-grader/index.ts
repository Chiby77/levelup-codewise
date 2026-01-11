import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// VB.NET Console Application specific validation
function validateVBNetConsoleApp(code: string): {
  isValid: boolean;
  issues: string[];
  score: number;
  details: {
    hasModule: boolean;
    hasSubMain: boolean;
    hasConsoleIO: boolean;
    hasProperDeclarations: boolean;
    hasControlStructures: boolean;
    structureScore: number;
  };
} {
  const issues: string[] = [];
  let structureScore = 80; // Start generous
  
  const codeUpper = code.toUpperCase();
  
  // Check for Module declaration
  const hasModule = /\bModule\s+\w+/i.test(code);
  const hasClass = /\bClass\s+\w+/i.test(code);
  
  if (!hasModule && !hasClass) {
    issues.push('Consider adding Module declaration for console apps');
    structureScore -= 5;
  } else {
    structureScore += 5;
  }
  
  // Check for Sub Main (entry point for console apps)
  const hasSubMain = /Sub\s+Main\s*\(/i.test(code);
  if (!hasSubMain && hasModule) {
    issues.push('Console apps typically need Sub Main()');
    structureScore -= 3;
  } else if (hasSubMain) {
    structureScore += 5;
  }
  
  // Check for Console I/O (common in console apps)
  const hasConsoleWrite = /Console\.(Write|WriteLine)/i.test(code);
  const hasConsoleRead = /Console\.(Read|ReadLine|ReadKey)/i.test(code);
  const hasConsoleIO = hasConsoleWrite || hasConsoleRead;
  
  if (hasConsoleWrite) structureScore += 3;
  if (hasConsoleRead) structureScore += 3;
  
  // Check for proper variable declarations
  const hasDim = /\bDim\s+\w+/i.test(code);
  const hasProperTypes = /As\s+(Integer|String|Boolean|Double|Single|Long|Decimal|Byte|Short|Object|Char|Date)/i.test(code);
  const hasProperDeclarations = hasDim || hasProperTypes;
  
  if (hasProperDeclarations) structureScore += 5;
  
  // Check for control structures
  const hasIf = /\bIF\b.*\bTHEN\b/i.test(code);
  const hasFor = /\bFOR\s+\w+\s*=/i.test(code);
  const hasWhile = /\bWHILE\b/i.test(code) || /\bDO\b/i.test(code);
  const hasSelect = /\bSELECT\s+CASE\b/i.test(code);
  const hasControlStructures = hasIf || hasFor || hasWhile || hasSelect;
  
  if (hasControlStructures) structureScore += 5;
  
  // Check for matching blocks
  const moduleCount = (codeUpper.match(/\bMODULE\b/g) || []).length;
  const endModuleCount = (codeUpper.match(/\bEND\s+MODULE\b/g) || []).length;
  const subCount = (codeUpper.match(/\bSUB\s+\w/g) || []).length;
  const endSubCount = (codeUpper.match(/\bEND\s+SUB\b/g) || []).length;
  const ifCount = (codeUpper.match(/\bIF\b.*\bTHEN\b/g) || []).length;
  const endIfCount = (codeUpper.match(/\bEND\s+IF\b/g) || []).length;
  const forCount = (codeUpper.match(/\bFOR\s+\w+\s*=/g) || []).length;
  const nextCount = (codeUpper.match(/\bNEXT\b/g) || []).length;
  
  if (moduleCount !== endModuleCount) {
    issues.push('Check Module/End Module matching');
    structureScore -= 2;
  }
  if (subCount !== endSubCount) {
    issues.push('Check Sub/End Sub matching');
    structureScore -= 2;
  }
  if (ifCount !== endIfCount && ifCount > 0) {
    issues.push('Check If/End If matching');
    structureScore -= 2;
  }
  if (forCount !== nextCount && forCount > 0) {
    issues.push('Check For/Next matching');
    structureScore -= 2;
  }
  
  // Bonus for good practices
  if (/Try.*Catch/is.test(code)) structureScore += 5;
  if (/\'.*comment/i.test(code) || /\'/.test(code)) structureScore += 2; // Comments
  if (/\bConst\s+/i.test(code)) structureScore += 2; // Constants
  if (/\bPrivate\b|\bPublic\b/i.test(code)) structureScore += 2; // Access modifiers
  
  // Ensure score stays in valid range
  structureScore = Math.max(70, Math.min(100, structureScore));
  
  return {
    isValid: issues.length === 0,
    issues,
    score: structureScore,
    details: {
      hasModule: hasModule || hasClass,
      hasSubMain,
      hasConsoleIO,
      hasProperDeclarations,
      hasControlStructures,
      structureScore
    }
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { studentCode, questionText, sampleCode, marks, programmingLanguage = 'python' } = await req.json();
    
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const isVBNet = programmingLanguage === 'vb' || programmingLanguage === 'vbnet';
    
    // For VB.NET, perform local validation first
    let localValidation = null;
    if (isVBNet) {
      localValidation = validateVBNetConsoleApp(studentCode);
      console.log('VB.NET local validation:', localValidation);
    }

    // Language-specific grading instructions
    const languageInstructions: Record<string, string> = {
      python: 'Check proper indentation, pythonic patterns, use of built-in functions, and PEP 8 conventions.',
      vb: `VB.NET CONSOLE APPLICATION GRADING:
- Module structure with proper Module...End Module (or Class for OOP)
- Sub Main() as the entry point for console applications
- Console.WriteLine() for output and Console.ReadLine() for input
- Proper Dim declarations with As <Type> (Integer, String, Boolean, Double, etc.)
- Control structures: If/Then/Else/End If, For/Next, While/End While, Do/Loop, Select Case
- Proper error handling with Try/Catch/End Try where applicable
- VB.NET naming conventions (PascalCase for methods, camelCase for variables)

IMPORTANT: Focus on LOGIC and PROBLEM-SOLVING, not just syntax. Students are learning!`,
      vbnet: `VB.NET CONSOLE APPLICATION GRADING:
- Module structure with proper Module...End Module (or Class for OOP)
- Sub Main() as the entry point for console applications
- Console.WriteLine() for output and Console.ReadLine() for input
- Proper Dim declarations with As <Type> (Integer, String, Boolean, Double, etc.)
- Control structures: If/Then/Else/End If, For/Next, While/End While, Do/Loop, Select Case
- Proper error handling with Try/Catch/End Try where applicable
- VB.NET naming conventions (PascalCase for methods, camelCase for variables)

IMPORTANT: Focus on LOGIC and PROBLEM-SOLVING, not just syntax. Students are learning!`,
      java: 'Check class structure, type declarations, proper Java conventions, camelCase naming, and object-oriented design.',
      c: 'Check pointer usage, memory management, proper C syntax, and efficiency.',
      cpp: 'Check class design, STL usage, memory management, and C++ best practices.',
      javascript: 'Check ES6+ features, async/await patterns, proper scoping, and modern JavaScript practices.'
    };

    const languageInstruction = languageInstructions[programmingLanguage] || languageInstructions.python;

    // Use Lovable AI Gateway for VB.NET (better reasoning)
    if (isVBNet && LOVABLE_API_KEY) {
      try {
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-3-flash-preview',
            messages: [
              {
                role: 'system',
                content: `You are an EXPERT VB.NET Console Application grading assistant with ADVANCED REASONING capabilities.

You grade VB.NET console applications with COMPASSION and FAIRNESS. You understand that students are learning and deserve encouragement.

${languageInstruction}

GRADING PHILOSOPHY (MINIMUM 75% FOR ANY REAL ATTEMPT):
- 95-100%: Excellent code - compiles, runs correctly, good structure, solves the problem
- 85-94%: Good code - mostly works, may have minor syntax issues but logic is sound
- 75-84%: Acceptable - shows understanding of VB.NET concepts, makes an effort
- NEVER give less than 75% for any legitimate code attempt

STEP-BY-STEP EVALUATION:
1. First, identify what the student was trying to achieve
2. Check if the algorithm/logic addresses the problem
3. Evaluate VB.NET console app structure (Module, Sub Main, Console I/O)
4. Check variable declarations and data types
5. Assess control structures and flow
6. Highlight what the student did WELL
7. Provide constructive feedback for improvement

Remember: Focus on LOGIC and PROBLEM-SOLVING, not just syntax perfection!`
              },
              {
                role: 'user',
                content: `Grade this VB.NET Console Application:

**Question:** ${questionText}

**Expected Solution (marking scheme):**
\`\`\`vb
${sampleCode || 'Any reasonable VB.NET console application solution'}
\`\`\`

**Student's Code:**
\`\`\`vb
${studentCode}
\`\`\`

**Local Syntax Validation Results:**
${localValidation ? `
- Has Module/Class: ${localValidation.details.hasModule ? '✓' : '✗'}
- Has Sub Main: ${localValidation.details.hasSubMain ? '✓' : '✗'}
- Has Console I/O: ${localValidation.details.hasConsoleIO ? '✓' : '✗'}
- Has Proper Declarations: ${localValidation.details.hasProperDeclarations ? '✓' : '✗'}
- Has Control Structures: ${localValidation.details.hasControlStructures ? '✓' : '✗'}
- Structure Score: ${localValidation.details.structureScore}%
- Issues: ${localValidation.issues.length > 0 ? localValidation.issues.join(', ') : 'None'}
` : 'Not available'}

**Maximum Marks:** ${marks}

THINK THROUGH THIS STEP BY STEP:
1. What is the student trying to achieve?
2. Is their algorithm/approach correct?
3. How well do they understand VB.NET console applications?
4. What did they do well?
5. What could they improve?

Provide your assessment as JSON:
{
  "score": <number between 0 and ${marks}, minimum 75% of ${marks} for any real attempt>,
  "feedback": "<detailed, encouraging feedback explaining the score and highlighting strengths>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement suggestion 1>", "<improvement suggestion 2>"],
  "reasoning": "<your step-by-step thinking process>"
}`
              }
            ],
            temperature: 0.2,
            max_tokens: 1500
          })
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const content = aiData.choices[0].message.content.trim();
          
          // Extract JSON from response
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const grading = JSON.parse(jsonMatch[0]);
            
            // Ensure minimum score for real attempts
            if (studentCode.trim().length > 20) {
              grading.score = Math.max(Math.round(marks * 0.75), grading.score);
            }
            
            // Combine with local validation
            if (localValidation) {
              const localScore = (localValidation.score / 100) * marks;
              const combinedScore = Math.round((grading.score * 0.7 + localScore * 0.3));
              grading.score = Math.max(Math.round(marks * 0.75), combinedScore);
            }
            
            return new Response(
              JSON.stringify(grading),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }
      } catch (lovableError) {
        console.error('Lovable AI error for VB.NET:', lovableError);
        // Fall through to Groq
      }
    }

    // Fallback to Groq API
    if (!GROQ_API_KEY) {
      // No AI available - use local validation for VB.NET
      if (localValidation) {
        const score = Math.round((localValidation.score / 100) * marks);
        return new Response(
          JSON.stringify({
            score: Math.max(Math.round(marks * 0.75), score),
            feedback: localValidation.issues.length > 0 
              ? `Good VB.NET attempt! Consider: ${localValidation.issues.join(', ')}`
              : 'Excellent VB.NET console application structure!',
            strengths: [
              localValidation.details.hasModule ? 'Good module structure' : 'Code submitted',
              localValidation.details.hasConsoleIO ? 'Proper console I/O usage' : 'Attempt made'
            ],
            improvements: localValidation.issues.slice(0, 2)
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error('No AI API key configured');
    }

    const prompt = `You are an expert ${programmingLanguage.toUpperCase()} programming instructor grading student code with COMPASSION.

Question: ${questionText}

Expected Solution/Sample Code:
${sampleCode || 'No sample code provided - any reasonable solution is acceptable'}

Student's Code:
${studentCode}

Language-Specific Requirements for ${programmingLanguage.toUpperCase()}:
${languageInstruction}

GRADING PHILOSOPHY - BE GENEROUS:
1. Minimum 75% for any real code attempt
2. Focus on LOGIC and PROBLEM-SOLVING over syntax perfection
3. Award points for understanding, effort, and partial solutions
4. Syntax errors that don't break logic = minor deduction only
5. Celebrate what the student did RIGHT

Analyze the student's code based on:
1. Correctness - Does it solve the problem correctly (or attempt to)?
2. Code Quality - Is it readable and follows ${programmingLanguage} conventions?
3. Best Practices - Does it follow ${programmingLanguage} idioms?
4. Effort - Did the student make a genuine attempt?

Maximum Marks: ${marks}

Respond in JSON format:
{
  "score": <number between ${Math.round(marks * 0.75)} and ${marks}>,
  "feedback": "<detailed, encouraging feedback explaining the score>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"]
}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a compassionate expert programming instructor. Always be encouraging and award generous marks for effort. Never give less than 75% for any real attempt. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      
      // Return fallback with local validation for VB.NET
      if (localValidation) {
        const score = Math.round((localValidation.score / 100) * marks);
        return new Response(
          JSON.stringify({
            score: Math.max(Math.round(marks * 0.75), score),
            feedback: 'Your code has been evaluated. Good effort on this VB.NET console application!',
            strengths: ['Code submitted', 'Attempt made'],
            improvements: localValidation.issues.slice(0, 2)
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const grading = JSON.parse(content);
    
    // Ensure minimum score for real attempts
    if (studentCode.trim().length > 20) {
      grading.score = Math.max(Math.round(marks * 0.75), grading.score);
    }

    return new Response(
      JSON.stringify(grading),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Groq grading error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        score: Math.round(15 * 0.75), // Default 75% of 15 marks
        feedback: 'Your VB.NET code has been recorded. Keep practicing console applications!',
        strengths: ['Attempt made'],
        improvements: ['Continue practicing VB.NET syntax']
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});