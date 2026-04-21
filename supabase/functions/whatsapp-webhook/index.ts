import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID')!;
const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN')!;
const twilioWhatsappNumber = Deno.env.get('TWILIO_WHATSAPP_NUMBER')!;
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')!;
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseKey);

const SYSTEM_PROMPT = `You are Mbuya Zivai, the friendly AI tutor for Bluewave Academy on WhatsApp.

You help with:
- A Level Computer Science (Zimbabwe syllabus)
- Programming in any language (Python, Java, VB.NET, C, C++, JavaScript)
- Algorithms, data structures, networking, databases, OS
- Career guidance and study motivation

WhatsApp formatting rules:
- Keep responses under 1500 characters when possible.
- Use *single asterisks* for bold (WhatsApp markdown), not **double**.
- Use simple bullet points with hyphens.
- Use \`backticks\` for inline code, triple backticks for blocks.
- Be warm and encouraging.
- If an image is sent (handwritten work, diagram, code screenshot), read it and answer based on what you see.`;

async function callLovableAI(messages: any[], modelOverride?: string): Promise<string> {
  const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelOverride || 'google/gemini-3-flash-preview',
      messages,
      temperature: 0.7,
      max_tokens: 1500,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    console.error('Lovable AI error:', res.status, t);
    throw new Error(`AI gateway ${res.status}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

async function fetchTwilioImageAsDataUrl(mediaUrl: string): Promise<string | null> {
  try {
    const auth = 'Basic ' + base64Encode(`${twilioAccountSid}:${twilioAuthToken}`);
    const r = await fetch(mediaUrl, { headers: { Authorization: auth } });
    if (!r.ok) {
      console.error('Twilio media fetch failed:', r.status);
      return null;
    }
    const buf = await r.arrayBuffer();
    const b64 = base64Encode(new Uint8Array(buf));
    const ct = r.headers.get('content-type') || 'image/jpeg';
    return `data:${ct};base64,${b64}`;
  } catch (e) {
    console.error('Image fetch error:', e);
    return null;
  }
}

async function generateReply(userMessage: string, phoneNumber: string, imageDataUrl?: string | null): Promise<string> {
  // Recent conversation history
  const { data: history } = await supabase
    .from('user_interactions')
    .select('user_input, ai_response')
    .eq('session_id', `whatsapp_${phoneNumber}`)
    .order('timestamp', { ascending: false })
    .limit(5);

  const messages: any[] = [{ role: 'system', content: SYSTEM_PROMPT }];

  if (history && history.length) {
    for (const h of [...history].reverse()) {
      messages.push({ role: 'user', content: h.user_input });
      messages.push({ role: 'assistant', content: h.ai_response });
    }
  }

  if (imageDataUrl) {
    messages.push({
      role: 'user',
      content: [
        { type: 'text', text: userMessage || 'Please help me with what you see in this image.' },
        { type: 'image_url', image_url: { url: imageDataUrl } },
      ],
    });
    return await callLovableAI(messages, 'google/gemini-2.5-pro');
  } else {
    messages.push({ role: 'user', content: userMessage });
    return await callLovableAI(messages);
  }
}

async function sendWhatsAppMessage(to: string, body: string): Promise<boolean> {
  try {
    const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    const formattedFrom = twilioWhatsappNumber.startsWith('whatsapp:')
      ? twilioWhatsappNumber
      : `whatsapp:${twilioWhatsappNumber}`;

    const maxLength = 1500;
    const chunks: string[] = [];
    let remaining = body;
    while (remaining.length > 0) {
      if (remaining.length <= maxLength) {
        chunks.push(remaining);
        break;
      }
      let bp = remaining.lastIndexOf('\n', maxLength);
      if (bp === -1 || bp < maxLength / 2) bp = remaining.lastIndexOf(' ', maxLength);
      if (bp === -1) bp = maxLength;
      chunks.push(remaining.slice(0, bp));
      remaining = remaining.slice(bp).trim();
    }

    const auth = 'Basic ' + base64Encode(`${twilioAccountSid}:${twilioAuthToken}`);

    for (const msg of chunks) {
      const r = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
        {
          method: 'POST',
          headers: { Authorization: auth, 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ To: formattedTo, From: formattedFrom, Body: msg }),
        },
      );
      if (!r.ok) {
        console.error('Twilio send error:', r.status, await r.text());
        return false;
      }
      if (chunks.length > 1) await new Promise((r) => setTimeout(r, 500));
    }
    return true;
  } catch (e) {
    console.error('sendWhatsAppMessage error:', e);
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  if (req.method === 'GET') {
    return new Response('Webhook active', {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    let body = '';
    let from = '';
    let mediaUrl: string | null = null;

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await req.text();
      const params = new URLSearchParams(text);
      body = params.get('Body') || '';
      from = (params.get('From') || '').replace(/whatsapp:\s*\+?/, 'whatsapp:+');
      const numMedia = parseInt(params.get('NumMedia') || '0', 10);
      if (numMedia > 0) mediaUrl = params.get('MediaUrl0');
    } else if (contentType.includes('application/json')) {
      const j = await req.json();
      body = j.Body || j.message || '';
      from = j.From || j.from || '';
      mediaUrl = j.MediaUrl0 || j.mediaUrl || null;
    }

    if (!from) {
      return new Response('Missing sender', { status: 400, headers: corsHeaders });
    }

    let imageDataUrl: string | null = null;
    if (mediaUrl) {
      imageDataUrl = await fetchTwilioImageAsDataUrl(mediaUrl);
    }

    const phoneNumber = from.replace('whatsapp:', '');
    const aiResponse = await generateReply(body, phoneNumber, imageDataUrl);

    await supabase.from('user_interactions').insert({
      user_input: body + (imageDataUrl ? ' [image attached]' : ''),
      ai_response: aiResponse,
      session_id: `whatsapp_${phoneNumber}`,
      interaction_type: imageDataUrl ? 'whatsapp_image' : 'whatsapp',
    });

    await sendWhatsAppMessage(from, aiResponse);

    return new Response('', {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'text/xml' },
    });
  } catch (e) {
    console.error('Webhook error:', e);
    return new Response('Error processing message', {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    });
  }
});
