import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// In-memory cache for repeated grading patterns (per cold start)
const responseCache = new Map<string, { score: number; feedback: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function cacheKey(question: string, answer: string, lang?: string) {
  return `${lang || 'def'}::${question.slice(0, 80)}::${answer.slice(0, 200)}`;
}
function cacheGet(k: string) {
  const c = responseCache.get(k);
  if (c && Date.now() - c.timestamp < CACHE_TTL) return { score: c.score, feedback: c.feedback };
  responseCache.delete(k);
  return null;
}
function cacheSet(k: string, score: number, feedback: string) {
  responseCache.set(k, { score, feedback, timestamp: Date.now() });
  if (responseCache.size > 500) responseCache.delete(responseCache.keys().next().value);
}

interface GradeRequest {
  questionText: string;
  studentAnswer: string;
  correctAnswer?: string;
  sampleCode?: string;
  marks: number;
  questionType: 'multiple_choice' | 'coding' | 'flowchart' | 'short_answer';
  programmingLanguage?: string;
  imageUrl?: string;
}

async function gradeWithLovableAI(req: GradeRequest, apiKey: string): Promise<{ score: number; feedback: string }> {
  const isCode = req.questionType === 'coding';
  const isVB = req.programmingLanguage === 'vb' || req.programmingLanguage === 'vbnet';
  const hasImage = !!req.imageUrl;

  const minPercent = req.questionType === 'multiple_choice' ? 0.4 : 0.7;

  const systemPrompt = `You are an EXPERT, COMPASSIONATE A Level Computer Science grader for Bluewave Academy.

GRADING PHILOSOPHY:
- Award generously for any genuine attempt. Students are learning.
- Minimum ${Math.round(minPercent * 100)}% of marks for any non-empty answer that addresses the question.
- Award full marks for correct or substantially correct answers.
- Focus on understanding and logic, not surface syntax.
- Be encouraging in feedback — point out strengths first.

QUESTION TYPE: ${req.questionType}
${isCode ? `PROGRAMMING LANGUAGE: ${req.programmingLanguage || 'python'}` : ''}
${isVB ? 'For VB.NET: prioritise Module/Sub Main structure, Console I/O, Dim declarations, control structures.' : ''}
${hasImage ? 'The student answer is provided as an IMAGE (handwritten work, diagram, or photo of code). Read it carefully and grade what you see. If illegible, give benefit of the doubt.' : ''}

Return ONLY a JSON object via the grade_answer tool. No prose.`;

  const userContent: any[] = [
    {
      type: 'text',
      text: `Question: ${req.questionText}

Reference / Marking scheme: ${req.correctAnswer || req.sampleCode || 'Any correct, well-reasoned answer'}

Maximum marks: ${req.marks}

Student's ${hasImage ? 'image' : 'answer'}:
${hasImage ? '(see attached image)' : req.studentAnswer || '(empty)'}`,
    },
  ];

  if (hasImage && req.imageUrl) {
    userContent.push({ type: 'image_url', image_url: { url: req.imageUrl } });
  }

  const tools = [
    {
      type: 'function',
      function: {
        name: 'grade_answer',
        description: 'Return the score and feedback for a student answer.',
        parameters: {
          type: 'object',
          properties: {
            score: {
              type: 'number',
              description: `Marks awarded, between ${Math.round(req.marks * minPercent)} and ${req.marks}. Must be a number, may include one decimal.`,
            },
            feedback: {
              type: 'string',
              description: 'Encouraging, specific feedback (1-3 sentences) explaining what was right and what to improve.',
            },
          },
          required: ['score', 'feedback'],
          additionalProperties: false,
        },
      },
    },
  ];

  const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: hasImage ? 'google/gemini-2.5-pro' : 'google/gemini-3-flash-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent.length === 1 ? userContent[0].text : userContent },
      ],
      tools,
      tool_choice: { type: 'function', function: { name: 'grade_answer' } },
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Lovable AI grading error:', res.status, text);
    if (res.status === 429) throw new Error('AI rate limited');
    if (res.status === 402) throw new Error('AI credits exhausted');
    throw new Error(`AI gateway ${res.status}`);
  }

  const data = await res.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall) {
    // Fallback: try to parse content as JSON
    const content = data.choices?.[0]?.message?.content || '';
    const m = content.match(/\{[\s\S]*\}/);
    if (m) {
      const parsed = JSON.parse(m[0]);
      return {
        score: Math.max(req.marks * minPercent, Math.min(req.marks, Number(parsed.score) || req.marks * minPercent)),
        feedback: parsed.feedback || 'Good attempt!',
      };
    }
    return { score: Math.round(req.marks * minPercent), feedback: 'Answer recorded.' };
  }

  const args = JSON.parse(toolCall.function.arguments);
  const rawScore = Number(args.score);
  const score = Math.max(
    Math.round(req.marks * minPercent * 10) / 10,
    Math.min(req.marks, isFinite(rawScore) ? rawScore : req.marks * minPercent),
  );
  return {
    score: Math.round(score * 10) / 10,
    feedback: args.feedback || 'Good attempt!',
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { submissionId, examId, answers, questions: providedQuestions, answerImages } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableKey) throw new Error('LOVABLE_API_KEY missing');

    console.log('Grading submission:', submissionId, 'for exam:', examId);

    let questions = providedQuestions;
    if (!questions || questions.length === 0) {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('exam_id', examId)
        .order('order_number');
      if (error) throw error;
      questions = data || [];
    }
    if (questions.length === 0) throw new Error('No questions found');

    const imageMap: Record<string, string> = answerImages || {}; // questionId -> signed URL or data URL

    let totalScore = 0;
    let maxScore = 0;
    const gradeDetails: Record<string, any> = {};
    const weakAreas: string[] = [];
    const strongAreas: string[] = [];

    for (const q of questions) {
      maxScore += q.marks;
      const studentAnswer = answers?.[q.id];
      const studentImage = imageMap[q.id];
      const hasAnswer = studentImage || (studentAnswer && studentAnswer.toString().trim() !== '');

      let score = 0;
      let feedback = '';

      if (!hasAnswer) {
        gradeDetails[q.id] = {
          score: 0,
          maxScore: q.marks,
          feedback: 'No answer provided. Please attempt every question next time.',
          questionText: q.question_text,
          correctAnswer: q.correct_answer || q.sample_code || 'See model answer',
          studentAnswer: '',
          questionType: q.question_type,
        };
        weakAreas.push(q.question_type);
        continue;
      }

      // Multiple choice — deterministic
      if (q.question_type === 'multiple_choice' && !studentImage) {
        const correct = (q.correct_answer || '').toLowerCase().trim();
        const student = studentAnswer.toString().toLowerCase().trim();
        if (correct && (student === correct || student.charAt(0) === correct.charAt(0))) {
          score = q.marks;
          feedback = 'Correct answer!';
          strongAreas.push('multiple_choice');
        } else {
          score = Math.round(q.marks * 0.4 * 10) / 10;
          feedback = `Not quite. The correct answer was: ${q.correct_answer}. Partial credit awarded for attempting.`;
          weakAreas.push('multiple_choice');
        }
      }
      // Strict numeric grading for data-representation questions
      else if (
        q.question_type === 'short_answer' &&
        !studentImage &&
        (q.category?.toLowerCase().includes('data representation') ||
          /\b(convert|binary|hexadecimal|denary|octal|two's complement|bcd)\b/i.test(q.question_text || '')) &&
        q.correct_answer &&
        /^[\d\sA-Fa-f.,+\-]+$/.test(q.correct_answer.trim())
      ) {
        const expected = q.correct_answer.replace(/\s+/g, '').toLowerCase();
        const got = studentAnswer.toString().replace(/\s+/g, '').toLowerCase();
        if (got === expected) {
          score = q.marks;
          feedback = 'Correct numeric answer!';
          strongAreas.push('data_representation');
        } else {
          score = 0;
          feedback = `Incorrect. The correct answer was: ${q.correct_answer}. Data representation requires exact answers.`;
          weakAreas.push('data_representation');
        }
      }
      // Flowchart — deterministic check on JSON structure
      else if (q.question_type === 'flowchart' && !studentImage) {
        try {
          const parsed = JSON.parse(studentAnswer);
          const elements = parsed.elements || parsed.nodes || [];
          const connections = parsed.connections || parsed.edges || [];
          if (elements.length >= 3 && connections.length >= 2) {
            score = q.marks;
            feedback = 'Excellent flowchart with clear structure and flow.';
          } else if (elements.length > 0) {
            score = Math.round(q.marks * 0.85 * 10) / 10;
            feedback = 'Good flowchart attempt — consider adding more decision points.';
          } else {
            score = Math.round(q.marks * 0.7 * 10) / 10;
            feedback = 'Flowchart submitted with minimal elements.';
          }
          strongAreas.push('flowchart');
        } catch {
          score = Math.round(q.marks * 0.75 * 10) / 10;
          feedback = 'Flowchart description submitted. Visual flowcharts are preferred.';
        }
      }
      // Coding & short answer (and any image-based answer) → Lovable AI
      else {
        const key = cacheKey(q.question_text || '', studentImage ? `image:${studentImage}` : (studentAnswer || ''), q.programming_language);
        const cached = !studentImage ? cacheGet(key) : null;
        if (cached) {
          score = Math.round((cached.score / 100) * q.marks * 10) / 10;
          feedback = `${cached.feedback} (cached)`;
        } else {
          try {
            const result = await gradeWithLovableAI(
              {
                questionText: q.question_text,
                studentAnswer: studentAnswer || '',
                correctAnswer: q.correct_answer,
                sampleCode: q.sample_code,
                marks: q.marks,
                questionType: q.question_type,
                programmingLanguage: q.programming_language,
                imageUrl: studentImage,
              },
              lovableKey,
            );
            score = result.score;
            feedback = result.feedback;
            if (!studentImage) {
              cacheSet(key, (score / q.marks) * 100, feedback);
            }
            strongAreas.push(q.question_type);
          } catch (err) {
            console.error('AI grading failed for question', q.id, err);
            const minPct = q.question_type === 'multiple_choice' ? 0.4 : 0.7;
            score = Math.round(q.marks * minPct * 10) / 10;
            feedback = 'Answer recorded. AI grading temporarily unavailable — credit awarded for attempting.';
          }
        }
      }

      totalScore += score;
      gradeDetails[q.id] = {
        score: Math.round(score * 10) / 10,
        maxScore: q.marks,
        feedback,
        questionText: q.question_text,
        correctAnswer: q.correct_answer || q.sample_code || 'See model answer',
        studentAnswer: studentImage ? '[image upload]' : (studentAnswer ?? ''),
        studentImageUrl: studentImage || undefined,
        questionType: q.question_type,
      };
    }

    console.log(`Grading complete: ${totalScore}/${maxScore}`);

    const { error: updateError } = await supabase
      .from('student_submissions')
      .update({
        total_score: Math.round(totalScore * 10) / 10,
        max_score: maxScore,
        graded: true,
        grading_status: 'completed',
        grade_details: gradeDetails,
      })
      .eq('id', submissionId);
    if (updateError) throw updateError;

    const uniqueWeak = [...new Set(weakAreas)];
    const recsMap: Record<string, string> = {
      multiple_choice: 'Review theory and practice more MCQs.',
      coding: 'Practice coding exercises in your weakest language.',
      flowchart: 'Study algorithm design and draw more flowcharts.',
      short_answer: 'Read more on the topic and practise written explanations.',
      data_representation: 'Practise number-base conversions and binary arithmetic.',
    };

    return new Response(
      JSON.stringify({
        success: true,
        totalScore: Math.round(totalScore * 10) / 10,
        maxScore,
        percentage: Math.round((totalScore / maxScore) * 100),
        weakAreas: uniqueWeak,
        studyRecommendations: uniqueWeak.map((a) => recsMap[a] || 'Keep practising!'),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('grade-exam error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
