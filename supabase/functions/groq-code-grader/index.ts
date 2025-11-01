import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { studentCode, questionText, sampleCode, marks, programmingLanguage = 'python' } = await req.json();
    
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY not configured');
    }

    // Language-specific grading instructions
    const languageInstructions: Record<string, string> = {
      python: 'Check proper indentation, pythonic patterns, use of built-in functions, and PEP 8 conventions.',
      vb: 'Check Dim statements, Sub/Function declarations, proper Visual Basic syntax, and VB naming conventions.',
      java: 'Check class structure, type declarations, proper Java conventions, camelCase naming, and object-oriented design.',
      c: 'Check pointer usage, memory management, proper C syntax, and efficiency.',
      cpp: 'Check class design, STL usage, memory management, and C++ best practices.',
      javascript: 'Check ES6+ features, async/await patterns, proper scoping, and modern JavaScript practices.'
    };

    const languageInstruction = languageInstructions[programmingLanguage] || languageInstructions.python;

    const prompt = `You are an expert ${programmingLanguage.toUpperCase()} programming instructor grading student code.

Question: ${questionText}

Expected Solution/Sample Code:
${sampleCode || 'No sample code provided'}

Student's Code:
${studentCode}

Language-Specific Requirements for ${programmingLanguage.toUpperCase()}:
${languageInstruction}

Analyze the student's code based on:
1. Correctness - Does it solve the problem correctly?
2. Code Quality - Is it well-structured, readable, and follows ${programmingLanguage} conventions?
3. Best Practices - Does it follow ${programmingLanguage} best practices and idioms?
4. Efficiency - Is the algorithm appropriate and efficient?

Provide a detailed analysis and assign a score out of ${marks} marks.

Respond in JSON format:
{
  "score": <number between 0 and ${marks}>,
  "feedback": "<detailed feedback explaining the score and language-specific issues>",
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
            content: 'You are an expert programming instructor. Always respond with valid JSON only.'
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
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const grading = JSON.parse(content);

    return new Response(
      JSON.stringify(grading),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Groq grading error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        score: 0,
        feedback: 'Error grading code. Using fallback scoring.'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
