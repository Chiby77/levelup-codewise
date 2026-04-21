import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

const supabase = createClient(supabaseUrl, supabaseKey);

const SYSTEM_PROMPT = `You are Mbuya Zivai, a warm, encouraging AI tutor for Bluewave Academy — a Zimbabwean A Level Computer Science platform.

You help students and curious visitors with:
- Programming in any language (Python, Java, VB.NET, C, C++, JavaScript, etc.)
- Algorithms, data structures, computer architecture, networking, databases
- A Level CS exam preparation, past papers, marking schemes
- Career guidance for tech in Zimbabwe and beyond
- General study motivation

Style:
- Be concise but thorough. Prefer clear examples over long prose.
- Use markdown: code blocks with language hints, bullet lists, **bold** for emphasis.
- If a student asks about an exam question, walk them through the reasoning — never just dump the answer.
- If you're shown an image, describe what you see and answer based on it (handwritten notes, diagrams, code screenshots all welcome).
- Be encouraging. Students are learning.`;

interface IncomingMessage {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string; // optional data URL or https URL
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const body = await req.json();
    const userMessage: string = body.message ?? '';
    const sessionId: string = body.sessionId ?? 'anonymous';
    const history: IncomingMessage[] = Array.isArray(body.history) ? body.history : [];
    const imageUrl: string | undefined = body.imageUrl; // base64 data URL or public https URL
    const model: string = body.model || 'google/gemini-3-flash-preview';

    if (!userMessage && !imageUrl) {
      return new Response(JSON.stringify({ error: 'message or imageUrl is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build the multimodal user content
    const userContent: any[] = [];
    if (userMessage) userContent.push({ type: 'text', text: userMessage });
    if (imageUrl) userContent.push({ type: 'image_url', image_url: { url: imageUrl } });

    const messages: any[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-10).map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userContent.length === 1 && userContent[0].type === 'text' ? userMessage : userContent },
    ];

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: imageUrl ? 'google/gemini-2.5-pro' : model,
        messages,
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Mbuya Zivai is busy right now. Please try again in a minute.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
      if (aiRes.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please contact the admin.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
      const t = await aiRes.text();
      console.error('Lovable AI error:', aiRes.status, t);
      throw new Error(`AI gateway error ${aiRes.status}`);
    }

    const data = await aiRes.json();
    const aiResponse: string = data.choices?.[0]?.message?.content ?? '';

    // Best-effort logging — never block the user response
    try {
      await supabase.from('user_interactions').insert({
        user_input: userMessage || '[image]',
        ai_response: aiResponse,
        session_id: sessionId,
        interaction_type: imageUrl ? 'chat_image' : 'chat',
      });
    } catch (logErr) {
      console.warn('Interaction log skipped:', logErr);
    }

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('enhanced-ai error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process request',
        response: "I'm having trouble responding right now. Please try again in a moment.",
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
