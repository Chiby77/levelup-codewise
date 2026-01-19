import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
const groqApiKey = Deno.env.get('GROQ_API_KEY')!;
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Enhanced topic identification for ALL tech-related queries
function identifyTechTopics(text: string): string[] {
  const techKeywords = {
    // Programming Languages
    'programming': ['code', 'programming', 'developer', 'software', 'script', 'coding', 'compile', 'runtime'],
    'python': ['python', 'django', 'flask', 'pandas', 'numpy', 'pip', 'pytorch', 'tensorflow'],
    'javascript': ['javascript', 'js', 'node', 'react', 'vue', 'angular', 'typescript', 'npm', 'webpack'],
    'java': ['java', 'spring', 'maven', 'gradle', 'jvm', 'hibernate', 'tomcat'],
    'csharp': ['c#', 'csharp', '.net', 'asp.net', 'unity', 'xamarin'],
    'cpp': ['c++', 'cpp', 'pointer', 'memory management'],
    'mobile': ['android', 'ios', 'swift', 'kotlin', 'flutter', 'react native', 'mobile app'],
    
    // Web Technologies
    'web': ['html', 'css', 'web', 'website', 'frontend', 'backend', 'fullstack', 'api', 'rest', 'graphql'],
    'database': ['sql', 'mysql', 'postgresql', 'mongodb', 'database', 'nosql', 'redis', 'query', 'table', 'schema'],
    
    // DevOps & Cloud
    'cloud': ['aws', 'azure', 'gcp', 'cloud', 'serverless', 'lambda', 's3', 'ec2', 'kubernetes', 'docker'],
    'devops': ['devops', 'ci/cd', 'jenkins', 'github actions', 'terraform', 'ansible', 'deployment'],
    'git': ['git', 'github', 'gitlab', 'version control', 'branch', 'merge', 'commit', 'repository'],
    
    // AI & Machine Learning
    'ai': ['ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 'neural network', 'chatgpt', 'gpt', 'llm'],
    'data_science': ['data science', 'data analysis', 'statistics', 'visualization', 'big data', 'analytics'],
    
    // Computer Science Fundamentals
    'algorithms': ['algorithm', 'sort', 'search', 'binary', 'linear', 'bubble', 'quick', 'merge', 'hash', 'tree', 'graph'],
    'data_structures': ['array', 'linked list', 'stack', 'queue', 'tree', 'graph', 'hash table', 'heap', 'data structure'],
    'networking': ['network', 'tcp', 'ip', 'http', 'https', 'router', 'switch', 'protocol', 'dns', 'vpn', 'firewall'],
    'security': ['security', 'encryption', 'hacking', 'cybersecurity', 'password', 'authentication', 'ssl', 'tls', 'vulnerability'],
    'os': ['operating system', 'linux', 'windows', 'macos', 'ubuntu', 'kernel', 'process', 'thread', 'memory'],
    
    // Hardware & Electronics
    'hardware': ['hardware', 'cpu', 'gpu', 'ram', 'motherboard', 'processor', 'computer', 'laptop', 'server'],
    'electronics': ['electronics', 'circuit', 'arduino', 'raspberry pi', 'iot', 'sensor', 'microcontroller'],
    
    // Emerging Tech
    'blockchain': ['blockchain', 'crypto', 'bitcoin', 'ethereum', 'nft', 'smart contract', 'web3'],
    'vr_ar': ['virtual reality', 'vr', 'augmented reality', 'ar', 'metaverse', '3d'],
    
    // Career & Education
    'career': ['job', 'career', 'interview', 'resume', 'portfolio', 'freelance', 'salary', 'hiring'],
    'education': ['learn', 'study', 'course', 'tutorial', 'certification', 'bootcamp', 'university', 'degree'],
  };
  
  const textLower = text.toLowerCase();
  const topics: string[] = [];
  
  Object.entries(techKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => textLower.includes(keyword))) {
      topics.push(topic);
    }
  });
  
  return topics.length > 0 ? topics : ['general_tech'];
}

// Process image from WhatsApp (get image description)
async function processImage(mediaUrl: string): Promise<string> {
  try {
    console.log('Processing image from URL:', mediaUrl);
    
    // Fetch the image from Twilio with authentication
    const authHeader = 'Basic ' + base64Encode(`${twilioAccountSid}:${twilioAuthToken}`);
    const imageResponse = await fetch(mediaUrl, {
      headers: { 'Authorization': authHeader }
    });
    
    if (!imageResponse.ok) {
      console.error('Failed to fetch image:', imageResponse.status);
      return '';
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = base64Encode(new Uint8Array(imageBuffer));
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    
    // Use Groq's vision model to analyze the image
    const visionResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.2-90b-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this image. If it contains code, a diagram, flowchart, error message, or any technical content, describe it in detail. If it\'s a homework or exam question, extract the question text. Provide a helpful response that a computer science teacher would give.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${contentType};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1024,
      }),
    });
    
    if (!visionResponse.ok) {
      const errorText = await visionResponse.text();
      console.error('Vision API error:', errorText);
      return 'I can see you sent an image, but I had trouble analyzing it. Could you describe what you need help with?';
    }
    
    const visionData = await visionResponse.json();
    return visionData.choices[0].message.content;
  } catch (error) {
    console.error('Error processing image:', error);
    return 'I received your image but encountered an error analyzing it. Please describe your question in text.';
  }
}

// Generate AI response for tech queries
async function generateTechResponse(userMessage: string, phoneNumber: string, imageAnalysis?: string): Promise<string> {
  const topics = identifyTechTopics(userMessage + (imageAnalysis || ''));
  
  // Get conversation history for context
  const { data: history } = await supabase
    .from('user_interactions')
    .select('user_input, ai_response')
    .eq('session_id', `whatsapp_${phoneNumber}`)
    .order('timestamp', { ascending: false })
    .limit(5);
  
  let conversationContext = '';
  if (history && history.length > 0) {
    conversationContext = history
      .reverse()
      .map(h => `User: ${h.user_input}\nAssistant: ${h.ai_response}`)
      .join('\n');
  }
  
  const systemPrompt = `You are Mbuya Zivai, a highly knowledgeable and friendly AI assistant specializing in ALL technology topics. You help people with:

- Programming in ANY language (Python, JavaScript, Java, C++, C#, Go, Rust, etc.)
- Web development (frontend, backend, full-stack)
- Mobile app development (Android, iOS, cross-platform)
- Database design and SQL queries
- Cloud computing (AWS, Azure, GCP)
- DevOps and CI/CD
- Artificial Intelligence and Machine Learning
- Cybersecurity and networking
- Computer hardware and electronics
- IT career advice and interview preparation
- Blockchain and emerging technologies
- General tech troubleshooting

Current topics detected: ${topics.join(', ')}

Guidelines:
- Be concise but thorough (WhatsApp has message limits)
- Use code examples when helpful (use backticks for formatting)
- Break complex explanations into steps
- Be encouraging and supportive
- If the user sends an image, analyze it and provide relevant help
${imageAnalysis ? `\nThe user sent an image. Analysis: ${imageAnalysis}` : ''}`;

  try {
    const messages: any[] = [
      { role: 'system', content: systemPrompt }
    ];
    
    if (conversationContext) {
      messages.push({ role: 'system', content: `Previous conversation:\n${conversationContext}` });
    }
    
    messages.push({ role: 'user', content: userMessage });
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      throw new Error('AI service temporarily unavailable');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating response:', error);
    return "I'm having a moment! 🤔 Please try again in a few seconds. If you sent an image, try describing your question in text instead.";
  }
}

// Send WhatsApp message via Twilio
async function sendWhatsAppMessage(to: string, body: string): Promise<boolean> {
  try {
    const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    const formattedFrom = twilioWhatsappNumber.startsWith('whatsapp:') 
      ? twilioWhatsappNumber 
      : `whatsapp:${twilioWhatsappNumber}`;
    
    // Split long messages (WhatsApp limit is ~1600 chars)
    const maxLength = 1500;
    const messages = [];
    let remaining = body;
    
    while (remaining.length > 0) {
      if (remaining.length <= maxLength) {
        messages.push(remaining);
        break;
      }
      
      // Find a good break point
      let breakPoint = remaining.lastIndexOf('\n', maxLength);
      if (breakPoint === -1 || breakPoint < maxLength / 2) {
        breakPoint = remaining.lastIndexOf(' ', maxLength);
      }
      if (breakPoint === -1) {
        breakPoint = maxLength;
      }
      
      messages.push(remaining.substring(0, breakPoint));
      remaining = remaining.substring(breakPoint).trim();
    }
    
    const authHeader = 'Basic ' + base64Encode(`${twilioAccountSid}:${twilioAuthToken}`);
    
    for (const msg of messages) {
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: formattedTo,
            From: formattedFrom,
            Body: msg,
          }),
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Twilio error:', response.status, errorText);
        return false;
      }
      
      // Small delay between messages
      if (messages.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  const url = new URL(req.url);
  
  // Webhook verification for Twilio (GET request)
  if (req.method === 'GET') {
    console.log('Webhook verification request received');
    return new Response('Webhook active', { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' } 
    });
  }
  
  // Handle incoming WhatsApp messages (POST request)
  if (req.method === 'POST') {
    try {
      const contentType = req.headers.get('content-type') || '';
      let body: string = '';
      let from: string = '';
      let mediaUrl: string | null = null;
      let numMedia: number = 0;
      
      if (contentType.includes('application/x-www-form-urlencoded')) {
        // Twilio sends form-encoded data
        const formData = await req.text();
        const params = new URLSearchParams(formData);
        body = params.get('Body') || '';
        from = params.get('From') || '';
        numMedia = parseInt(params.get('NumMedia') || '0', 10);
        
        if (numMedia > 0) {
          mediaUrl = params.get('MediaUrl0');
        }
        
        console.log('Received WhatsApp message:', { from, body, numMedia, hasMedia: !!mediaUrl });
      } else if (contentType.includes('application/json')) {
        // JSON request (for testing)
        const jsonBody = await req.json();
        body = jsonBody.Body || jsonBody.message || '';
        from = jsonBody.From || jsonBody.from || '';
        mediaUrl = jsonBody.MediaUrl0 || jsonBody.mediaUrl || null;
        
        console.log('Received JSON request:', { from, body, hasMedia: !!mediaUrl });
      }
      
      if (!from) {
        return new Response('Missing sender', { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'text/plain' } 
        });
      }
      
      // Process image if present
      let imageAnalysis = '';
      if (mediaUrl) {
        console.log('Processing image from:', mediaUrl);
        imageAnalysis = await processImage(mediaUrl);
        
        if (!body.trim() && imageAnalysis) {
          body = 'Please help me understand this image.';
        }
      }
      
      // Generate AI response
      const phoneNumber = from.replace('whatsapp:', '');
      const aiResponse = await generateTechResponse(body, phoneNumber, imageAnalysis);
      
      // Store interaction in database
      await supabase.from('user_interactions').insert({
        user_input: body + (imageAnalysis ? ` [Image: ${imageAnalysis.substring(0, 200)}...]` : ''),
        ai_response: aiResponse,
        session_id: `whatsapp_${phoneNumber}`,
        interaction_type: 'whatsapp',
        context_keywords: identifyTechTopics(body),
        topics: identifyTechTopics(body),
      });
      
      // Send response back via WhatsApp
      const sent = await sendWhatsAppMessage(from, aiResponse);
      
      if (sent) {
        console.log('Response sent successfully to:', from);
      } else {
        console.error('Failed to send response to:', from);
      }
      
      // Twilio expects empty 200 response for webhooks
      return new Response('', { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'text/xml' } 
      });
      
    } catch (error) {
      console.error('Webhook error:', error);
      return new Response('Error processing message', { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' } 
      });
    }
  }
  
  return new Response('Method not allowed', { 
    status: 405, 
    headers: { ...corsHeaders, 'Content-Type': 'text/plain' } 
  });
});
