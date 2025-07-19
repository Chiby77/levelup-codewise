import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

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
    'programming': ['code', 'programming', 'python', 'javascript', 'algorithm', 'function', 'variable', 'loop', 'array'],
    'computer_science': ['computer', 'science', 'data', 'structure', 'binary', 'network', 'database', 'system'],
    'education': ['learn', 'study', 'exam', 'test', 'question', 'answer', 'homework', 'assignment', 'course'],
    'flowchart': ['flowchart', 'diagram', 'flow', 'chart', 'process', 'steps', 'decision', 'start', 'end'],
    'algorithms': ['algorithm', 'sort', 'search', 'binary', 'linear', 'bubble', 'quick', 'merge'],
    'networking': ['network', 'tcp', 'ip', 'http', 'router', 'switch', 'protocol', 'internet'],
  };
  
  const text_lower = text.toLowerCase();
  const topics: string[] = [];
  
  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => text_lower.includes(keyword))) {
      topics.push(topic);
    }
  });
  
  return topics;
}

async function generateResponse(userInput: string, sessionId: string): Promise<string> {
  const keywords = extractKeywords(userInput);
  const topics = identifyTopics(userInput);
  
  // Check for learned responses
  const { data: learnedResponses } = await supabase
    .from('learned_responses')
    .select('*')
    .gt('confidence_score', 0.3)
    .order('usage_count', { ascending: false })
    .limit(10);
  
  // Look for matching learned responses
  if (learnedResponses) {
    for (const learned of learnedResponses) {
      const triggerWords = learned.trigger_phrase.toLowerCase().split(/\s+/);
      const matchCount = triggerWords.filter(word => userInput.toLowerCase().includes(word)).length;
      
      if (matchCount >= triggerWords.length * 0.6) {
        // Update usage count
        await supabase
          .from('learned_responses')
          .update({ usage_count: learned.usage_count + 1 })
          .eq('id', learned.id);
        
        return learned.response_text;
      }
    }
  }
  
  // Get recent interactions for context
  const { data: recentInteractions } = await supabase
    .from('user_interactions')
    .select('*')
    .eq('session_id', sessionId)
    .order('timestamp', { ascending: false })
    .limit(5);
  
  // Generate contextual response based on topics and keywords
  let response = '';
  
  if (topics.includes('programming')) {
    response = `I see you're asking about programming! ${keywords.join(', ')} are important concepts. Let me help you understand these better. Programming is the art of creating instructions for computers to follow. `;
  } else if (topics.includes('flowchart')) {
    response = `Flowcharts are visual representations of processes and algorithms! They help us understand the logical flow of programs. You can create flowcharts using our integrated drawing tool. `;
  } else if (topics.includes('algorithms')) {
    response = `Algorithms are step-by-step procedures for solving problems! ${keywords.join(', ')} are fundamental concepts in computer science. `;
  } else if (topics.includes('networking')) {
    response = `Networking connects computers and enables communication! Topics like ${keywords.join(', ')} are essential for understanding how the internet works. `;
  } else if (userInput.toLowerCase().includes('hello') || userInput.toLowerCase().includes('hi')) {
    response = `Hello! I'm Mbuya Zivai, your AI-powered Computer Science assistant. I'm here to help you with programming, algorithms, flowcharts, and all things computer science! `;
  } else if (userInput.toLowerCase().includes('exam') || userInput.toLowerCase().includes('test')) {
    response = `I can help you prepare for your computer science exams! We have a digital examination system where you can practice and get AI-powered grading. `;
  } else {
    response = `That's an interesting question about ${keywords.slice(0, 3).join(', ')}! Let me help you explore this topic further. `;
  }
  
  // Add contextual information based on recent interactions
  if (recentInteractions && recentInteractions.length > 0) {
    const commonTopics = recentInteractions
      .flatMap(interaction => interaction.topics || [])
      .filter((topic, index, array) => array.indexOf(topic) === index);
    
    if (commonTopics.length > 0) {
      response += `\n\nI notice we've been discussing ${commonTopics.join(' and ')}. `;
    }
  }
  
  // Learn from this interaction
  if (keywords.length > 2) {
    const triggerPhrase = keywords.slice(0, 3).join(' ');
    
    // Check if we should create a new learned response
    const { data: existing } = await supabase
      .from('learned_responses')
      .select('id')
      .eq('trigger_phrase', triggerPhrase)
      .single();
    
    if (!existing) {
      await supabase
        .from('learned_responses')
        .insert({
          trigger_phrase: triggerPhrase,
          response_text: response,
          confidence_score: 0.4,
          usage_count: 1
        });
    }
  }
  
  return response;
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
    
    // Generate intelligent response
    const aiResponse = await generateResponse(message, sessionId || 'anonymous');
    
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