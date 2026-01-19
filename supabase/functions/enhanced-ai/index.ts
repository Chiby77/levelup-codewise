import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const groqApiKey = Deno.env.get('GROQ_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Simple NLP functions for learning
function extractKeywords(text: string): string[] {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  const stopWords = ['with', 'what', 'when', 'where', 'which', 'this', 'that', 'they', 'them', 'their', 'there', 'then', 'than', 'from', 'have', 'been', 'were', 'was', 'will', 'would', 'could', 'should'];
  return words.filter(word => !stopWords.includes(word));
}

function calculateSentiment(text: string): number {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'best', 'perfect', 'love', 'like', 'happy', 'pleased', 'thanks', 'thank'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'angry', 'sad', 'confused', 'problem', 'issue', 'wrong', 'error'];
  
  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 1;
    if (negativeWords.includes(word)) score -= 1;
  });
  
  return Math.max(-1, Math.min(1, score / words.length));
}

function identifyTopics(text: string): string[] {
  const topicKeywords = {
    // Programming Languages
    'programming': ['code', 'programming', 'python', 'javascript', 'algorithm', 'function', 'variable', 'loop', 'array', 'developer', 'software'],
    'python': ['python', 'django', 'flask', 'pandas', 'numpy', 'pip', 'pytorch'],
    'javascript': ['javascript', 'js', 'node', 'react', 'vue', 'angular', 'typescript', 'npm'],
    'java': ['java', 'spring', 'maven', 'jvm', 'hibernate'],
    'csharp': ['c#', 'csharp', '.net', 'asp.net', 'unity'],
    'cpp': ['c++', 'cpp', 'pointer'],
    'mobile': ['android', 'ios', 'swift', 'kotlin', 'flutter', 'react native', 'mobile app'],
    
    // Web Technologies
    'web': ['html', 'css', 'web', 'website', 'frontend', 'backend', 'fullstack', 'api', 'rest', 'graphql'],
    'database': ['sql', 'mysql', 'postgresql', 'mongodb', 'database', 'nosql', 'redis', 'query', 'table'],
    
    // DevOps & Cloud
    'cloud': ['aws', 'azure', 'gcp', 'cloud', 'serverless', 'lambda', 's3', 'kubernetes', 'docker'],
    'devops': ['devops', 'ci/cd', 'jenkins', 'github actions', 'terraform', 'deployment'],
    'git': ['git', 'github', 'gitlab', 'version control', 'branch', 'merge', 'commit'],
    
    // AI & Machine Learning
    'ai': ['ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 'neural network', 'chatgpt', 'gpt', 'llm'],
    'data_science': ['data science', 'data analysis', 'statistics', 'visualization', 'big data', 'analytics'],
    
    // Computer Science Fundamentals
    'computer_science': ['computer', 'science', 'data', 'structure', 'binary', 'network', 'system'],
    'algorithms': ['algorithm', 'sort', 'search', 'binary', 'linear', 'bubble', 'quick', 'merge', 'hash', 'tree', 'graph'],
    'data_structures': ['array', 'linked list', 'stack', 'queue', 'tree', 'graph', 'hash table', 'heap'],
    'networking': ['network', 'tcp', 'ip', 'http', 'router', 'switch', 'protocol', 'internet', 'dns', 'vpn'],
    'security': ['security', 'encryption', 'hacking', 'cybersecurity', 'password', 'authentication', 'ssl'],
    'os': ['operating system', 'linux', 'windows', 'ubuntu', 'kernel', 'process', 'thread'],
    
    // Hardware & Electronics
    'hardware': ['hardware', 'cpu', 'gpu', 'ram', 'motherboard', 'processor', 'computer', 'laptop'],
    'electronics': ['electronics', 'circuit', 'arduino', 'raspberry pi', 'iot', 'sensor'],
    
    // Emerging Tech
    'blockchain': ['blockchain', 'crypto', 'bitcoin', 'ethereum', 'nft', 'web3'],
    
    // Education
    'education': ['learn', 'study', 'exam', 'test', 'question', 'answer', 'homework', 'assignment', 'course'],
    'flowchart': ['flowchart', 'diagram', 'flow', 'chart', 'process', 'steps', 'decision'],
    
    // Career
    'career': ['job', 'career', 'interview', 'resume', 'portfolio', 'freelance', 'salary'],
  };
  
  const text_lower = text.toLowerCase();
  const topics: string[] = [];
  
  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => text_lower.includes(keyword))) {
      topics.push(topic);
    }
  });
  
  return topics.length > 0 ? topics : ['general_tech'];
}

async function generateResponseWithGroq(userInput: string, sessionId: string): Promise<string> {
  const keywords = extractKeywords(userInput);
  const topics = identifyTopics(userInput);
  
  // Get recent interactions for context
  const { data: recentInteractions } = await supabase
    .from('user_interactions')
    .select('*')
    .eq('session_id', sessionId)
    .order('timestamp', { ascending: false })
    .limit(5);
  
  // Build context from recent interactions
  let conversationContext = '';
  if (recentInteractions && recentInteractions.length > 0) {
    conversationContext = recentInteractions
      .reverse()
      .map(interaction => `User: ${interaction.user_input}\nAssistant: ${interaction.ai_response}`)
      .join('\n');
  }
  
  // Build system prompt
  const systemPrompt = `You are Mbuya Zivai, a wise and knowledgeable AI assistant specializing in ALL technology-related topics. 
You help students and professionals understand:
- Programming in ANY language (Python, JavaScript, Java, C++, C#, Go, Rust, PHP, Ruby, Swift, Kotlin, etc.)
- Web development (frontend, backend, full-stack, APIs)
- Mobile app development (Android, iOS, cross-platform)
- Database design, SQL, and NoSQL systems
- Cloud computing (AWS, Azure, GCP, serverless)
- DevOps, CI/CD, and infrastructure
- Artificial Intelligence and Machine Learning
- Cybersecurity and networking
- Computer hardware and electronics
- IT career advice and interview preparation
- Blockchain and emerging technologies
- General tech troubleshooting

You are patient, encouraging, and provide clear explanations with examples when helpful.
Current topics being discussed: ${topics.join(', ')}
Key concepts: ${keywords.slice(0, 5).join(', ')}`;

  try {
    // Call Groq API with llama model
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...(conversationContext ? [{ role: 'system', content: `Previous conversation:\n${conversationContext}` }] : []),
          { role: 'user', content: userInput }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Learn from this interaction by storing patterns
    if (keywords.length > 2) {
      const triggerPhrase = keywords.slice(0, 3).join(' ');
      
      const { data: existing } = await supabase
        .from('learned_responses')
        .select('id, usage_count')
        .eq('trigger_phrase', triggerPhrase)
        .single();
      
      if (existing) {
        await supabase
          .from('learned_responses')
          .update({ 
            usage_count: existing.usage_count + 1,
            confidence_score: Math.min(0.9, 0.4 + (existing.usage_count * 0.05))
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('learned_responses')
          .insert({
            trigger_phrase: triggerPhrase,
            response_text: aiResponse.substring(0, 500),
            confidence_score: 0.4,
            usage_count: 1
          });
      }
    }
    
    return aiResponse;
  } catch (error) {
    console.error('Error calling Groq API:', error);
    // Fallback to basic response
    return `I understand you're asking about ${keywords.slice(0, 3).join(', ')}. This is an important topic in computer science! Could you please rephrase your question? I'm having a bit of trouble processing it right now.`;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId } = await req.json();
    
    console.log('Enhanced AI processing:', { message, sessionId });
    
    const sentiment = calculateSentiment(message);
    const keywords = extractKeywords(message);
    const topics = identifyTopics(message);
    
    // Generate intelligent response using Groq AI
    const aiResponse = await generateResponseWithGroq(message, sessionId || 'anonymous');
    
    // Store the interaction
    await supabase
      .from('user_interactions')
      .insert({
        user_input: message,
        ai_response: aiResponse,
        context_keywords: keywords,
        session_id: sessionId || 'anonymous',
        sentiment: sentiment,
        topics: topics,
        interaction_type: 'chat'
      });
    
    console.log('Interaction stored successfully');
    
    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        keywords,
        topics,
        sentiment
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
    
  } catch (error) {
    console.error('Error in enhanced-ai function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process request',
        response: "I apologize, but I'm having trouble processing your request right now. Could you please try again?"
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});