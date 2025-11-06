import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GradeEmailRequest {
  studentName: string;
  studentEmail: string;
  examTitle: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  gradeDetails: any[];
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

    // Determine grade letter
    let gradeLetter = "F";
    if (percentage >= 90) gradeLetter = "A";
    else if (percentage >= 80) gradeLetter = "B";
    else if (percentage >= 70) gradeLetter = "C";
    else if (percentage >= 60) gradeLetter = "D";

    // Build grade breakdown HTML
    const gradeBreakdownHtml = gradeDetails.map((detail, index) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${index + 1}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${detail.question_type}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${detail.score}/${detail.max_score}</td>
      </tr>
    `).join('');

    // Build weak areas HTML
    const weakAreasHtml = weakAreas && weakAreas.length > 0 ? `
      <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <h3 style="color: #856404; margin-top: 0;">📚 Areas to Focus On</h3>
        <ul style="color: #856404; margin: 0;">
          ${weakAreas.map(area => `<li>${area}</li>`).join('')}
        </ul>
      </div>
    ` : '';

    // Build study recommendations HTML
    const recommendationsHtml = studyRecommendations && studyRecommendations.length > 0 ? `
      <div style="background-color: #d1ecf1; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8;">
        <h3 style="color: #0c5460; margin-top: 0;">💡 Study Recommendations</h3>
        <ul style="color: #0c5460; margin: 0;">
          ${studyRecommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      </div>
    ` : '';

    const emailResponse = await resend.emails.send({
      from: "A Level CS Experts <onboarding@resend.dev>",
      to: [studentEmail],
      subject: `Your Exam Results: ${examTitle} - Grade ${gradeLetter}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #333; text-align: center; margin-bottom: 10px;">🎓 Exam Results Available</h1>
            <p style="text-align: center; color: #666; font-size: 18px; margin-top: 0;">Hello ${studentName}!</p>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h2 style="margin: 0; font-size: 24px;">${examTitle}</h2>
              <div style="margin: 20px 0;">
                <div style="font-size: 48px; font-weight: bold; margin: 10px 0;">${gradeLetter}</div>
                <div style="font-size: 24px;">${totalScore} / ${maxScore}</div>
                <div style="font-size: 18px; opacity: 0.9;">${percentage.toFixed(1)}%</div>
              </div>
            </div>

            <h3 style="color: #333; margin-top: 30px;">📊 Detailed Breakdown</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="padding: 10px; text-align: left;">Q#</th>
                  <th style="padding: 10px; text-align: left;">Type</th>
                  <th style="padding: 10px; text-align: center;">Score</th>
                </tr>
              </thead>
              <tbody>
                ${gradeBreakdownHtml}
              </tbody>
            </table>

            ${weakAreasHtml}
            ${recommendationsHtml}

            <div style="background-color: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #333; margin: 0; text-align: center;">
                <strong>💪 Keep up the great work!</strong><br>
                Review your results and study recommendations to improve your performance.
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #888; font-size: 14px; margin: 0;">
                For questions or concerns, contact us at:<br>
                <strong>tinodaishemchibi@gmail.com</strong> or <strong>+263 78 108 1816</strong>
              </p>
            </div>
          </div>
        </div>
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
