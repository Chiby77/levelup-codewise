import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuestionDetail {
  questionText: string;
  correctAnswer: string;
  studentAnswer: string;
  score: number;
  maxScore: number;
  isCorrect: boolean;
  questionType: string;
}

interface GradeEmailRequest {
  studentName: string;
  studentEmail: string;
  examTitle: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  gradeDetails: QuestionDetail[];
  weakAreas?: string[];
  studyRecommendations?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Send exam grade email function called");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      studentName,
      studentEmail,
      examTitle,
      totalScore,
      maxScore,
      percentage,
      gradeDetails,
      weakAreas,
      studyRecommendations
    }: GradeEmailRequest = await req.json();
    
    console.log("Sending grade email to:", studentEmail);

    // Determine grade letter and color
    let gradeLetter = "F";
    let gradeColor = "#dc3545";
    let gradeMessage = "Keep working hard!";
    
    if (percentage >= 90) {
      gradeLetter = "A";
      gradeColor = "#28a745";
      gradeMessage = "Outstanding performance!";
    } else if (percentage >= 80) {
      gradeLetter = "B";
      gradeColor = "#28a745";
      gradeMessage = "Excellent work!";
    } else if (percentage >= 70) {
      gradeLetter = "C";
      gradeColor = "#17a2b8";
      gradeMessage = "Good job!";
    } else if (percentage >= 60) {
      gradeLetter = "D";
      gradeColor = "#ffc107";
      gradeMessage = "Satisfactory performance.";
    } else if (percentage >= 50) {
      gradeLetter = "E";
      gradeColor = "#fd7e14";
      gradeMessage = "You passed!";
    }

    // Build detailed question breakdown HTML
    const questionsHtml = gradeDetails.map((detail, index) => {
      const isCorrect = detail.score === detail.maxScore;
      const statusColor = isCorrect ? '#28a745' : (detail.score > 0 ? '#ffc107' : '#dc3545');
      const statusText = isCorrect ? '✓ CORRECT' : (detail.score > 0 ? '◐ PARTIAL' : '✗ INCORRECT');
      const bgColor = isCorrect ? '#e8f5e9' : (detail.score > 0 ? '#fff8e1' : '#ffebee');
      
      return `
        <div style="margin-bottom: 20px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <!-- Question Header -->
          <div style="background: ${statusColor}; color: white; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
            <strong>Question ${index + 1}</strong>
            <span>${detail.score}/${detail.maxScore} marks</span>
          </div>
          
          <!-- Question Content -->
          <div style="padding: 16px; background: #fafafa;">
            <p style="margin: 0 0 12px 0; color: #333; font-weight: 500;">
              ${detail.questionText || 'Question text not available'}
            </p>
            
            <!-- Correct Answer -->
            <div style="background: #e8f5e9; border-left: 4px solid #28a745; padding: 12px; margin-bottom: 10px; border-radius: 4px;">
              <p style="margin: 0; font-size: 12px; color: #28a745; font-weight: bold; text-transform: uppercase;">Correct Answer:</p>
              <p style="margin: 4px 0 0 0; color: #333;">${detail.correctAnswer || 'Not provided'}</p>
            </div>
            
            <!-- Student Answer -->
            <div style="background: ${bgColor}; border-left: 4px solid ${statusColor}; padding: 12px; border-radius: 4px;">
              <p style="margin: 0; font-size: 12px; color: ${statusColor}; font-weight: bold; text-transform: uppercase;">Your Answer:</p>
              <p style="margin: 4px 0 0 0; color: #333;">${detail.studentAnswer || '(No answer provided)'}</p>
            </div>
            
            <!-- Status Badge -->
            <div style="margin-top: 10px;">
              <span style="background: ${statusColor}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                ${statusText}
              </span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Build weak areas HTML
    const weakAreasHtml = weakAreas && weakAreas.length > 0 ? `
      <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <h3 style="color: #856404; margin-top: 0; font-size: 16px;">📚 Areas That Need Improvement</h3>
        <ul style="color: #856404; margin: 0; padding-left: 20px;">
          ${weakAreas.map(area => `<li style="margin-bottom: 6px;">${area}</li>`).join('')}
        </ul>
      </div>
    ` : '';

    // Build study recommendations HTML
    const recommendationsHtml = studyRecommendations && studyRecommendations.length > 0 ? `
      <div style="background-color: #d1ecf1; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8;">
        <h3 style="color: #0c5460; margin-top: 0; font-size: 16px;">💡 Personalized Study Recommendations</h3>
        <ul style="color: #0c5460; margin: 0; padding-left: 20px;">
          ${studyRecommendations.map(rec => `<li style="margin-bottom: 6px;">${rec}</li>`).join('')}
        </ul>
      </div>
    ` : '';

    const emailResponse = await resend.emails.send({
      from: "Bluewave Academy <onboarding@resend.dev>",
      to: [studentEmail],
      subject: `[Bluewave Academy] Your results: ${examTitle} · Grade ${gradeLetter} (${percentage.toFixed(0)}%)`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f1f5f9;">
          <div style="max-width: 650px; margin: 0 auto; background-color: #ffffff;">

            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1d4ed8 0%, #0ea5e9 100%); padding: 32px 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 0.5px;">BLUEWAVE ACADEMY</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 13px;">A Level Computer Science · Zimbabwe</p>
            </div>

            <!-- Greeting -->
            <div style="padding: 28px 30px 8px 30px;">
              <h2 style="color: #0f172a; margin: 0 0 8px 0; font-size: 22px;">Hello ${studentName} 🎓</h2>
              <p style="color: #475569; margin: 0; font-size: 16px;">Your results for <strong>${examTitle}</strong> are ready.</p>
            </div>

            <!-- Score Card -->
            <div style="margin: 24px 30px 30px 30px; background: linear-gradient(135deg, ${gradeColor} 0%, ${gradeColor}dd 100%); border-radius: 16px; padding: 28px; text-align: center; color: #ffffff;">
              <p style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px;">Your final score</p>
              <div style="font-size: 60px; font-weight: bold; margin: 6px 0; line-height: 1;">${percentage.toFixed(0)}%</div>
              <div style="font-size: 18px; margin-bottom: 14px;">${totalScore} / ${maxScore} marks</div>
              <div style="display: inline-block; background: #ffffff; color: ${gradeColor}; padding: 8px 26px; border-radius: 25px; font-size: 20px; font-weight: bold;">
                Grade ${gradeLetter}
              </div>
              <p style="margin: 14px 0 0 0; font-size: 15px;">${gradeMessage}</p>
            </div>

            <!-- Detailed Breakdown -->
            <div style="padding: 0 30px 24px 30px;">
              <h3 style="color: #0f172a; margin: 0 0 18px 0; font-size: 17px; border-bottom: 2px solid #1d4ed8; padding-bottom: 10px;">
                📋 Question-by-question feedback
              </h3>
              ${questionsHtml}
            </div>

            ${weakAreasHtml ? `<div style="padding: 0 30px;">${weakAreasHtml}</div>` : ''}
            ${recommendationsHtml ? `<div style="padding: 0 30px;">${recommendationsHtml}</div>` : ''}

            <!-- Encouragement -->
            <div style="margin: 16px 30px 24px 30px; background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); padding: 22px; border-radius: 12px; text-align: center;">
              <p style="color: #075985; margin: 0; font-size: 15px; font-weight: 500;">
                💪 Mbuya Zivai says: keep going! Every question you review is a step closer to mastery.
              </p>
            </div>

            <!-- Footer -->
            <div style="background: #f8fafc; padding: 22px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #475569; font-size: 14px; margin: 0 0 8px 0;">
                <strong>Bluewave Academy</strong><br>
                Powered by Bluewave Technologies · CEO Tinodaishe M. Chibi
              </p>
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                Questions? tinodaishemchibi@gmail.com · +263 78 108 1816
              </p>
            </div>

          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true,
      emailId: emailResponse.data?.id
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-exam-grade-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
