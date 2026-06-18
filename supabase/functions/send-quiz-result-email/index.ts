import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface QuizEmailRequest {
  studentName: string;
  studentEmail: string;
  category: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpentSeconds?: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      studentName,
      studentEmail,
      category,
      score,
      totalQuestions,
      percentage,
      timeSpentSeconds,
    }: QuizEmailRequest = await req.json();

    if (!studentEmail) {
      return new Response(
        JSON.stringify({ error: "studentEmail is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let badgeColor = "#dc2626";
    let badgeText = "Keep practising!";
    if (percentage >= 90) { badgeColor = "#16a34a"; badgeText = "Outstanding!"; }
    else if (percentage >= 70) { badgeColor = "#0ea5e9"; badgeText = "Great work!"; }
    else if (percentage >= 50) { badgeColor = "#f59e0b"; badgeText = "Good effort!"; }

    const timeLine = timeSpentSeconds
      ? `<p style="color:#64748b; font-size:13px; margin:6px 0 0;">Time taken: ${Math.round(timeSpentSeconds / 60)} min ${timeSpentSeconds % 60} sec</p>`
      : "";

    const emailResponse = await resend.emails.send({
      from: "Bluewave Academy <onboarding@resend.dev>",
      to: [studentEmail],
      subject: `[Bluewave Academy] Quiz result: ${category} · ${percentage}%`,
      html: `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; margin:0; padding:0; background:#f1f5f9;">
            <div style="max-width:600px; margin:0 auto; background:#ffffff;">
              <div style="background: linear-gradient(135deg, #1d4ed8 0%, #0ea5e9 100%); padding:28px 24px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:22px; letter-spacing:0.5px;">BLUEWAVE ACADEMY</h1>
                <p style="color:rgba(255,255,255,0.9); margin:6px 0 0; font-size:13px;">Mbuya Zivai · Quiz Results</p>
              </div>

              <div style="padding:28px 30px 8px;">
                <h2 style="color:#0f172a; margin:0 0 6px; font-size:20px;">Well done, ${studentName || "Student"}! 🎉</h2>
                <p style="color:#475569; margin:0;">You completed the <strong>${category}</strong> quiz. Here's how you did:</p>
              </div>

              <div style="margin:20px 30px; background:linear-gradient(135deg, ${badgeColor} 0%, ${badgeColor}cc 100%); border-radius:14px; padding:24px; text-align:center; color:#ffffff;">
                <p style="margin:0 0 6px; font-size:12px; text-transform:uppercase; letter-spacing:1.5px;">Your score</p>
                <div style="font-size:54px; font-weight:bold; line-height:1;">${percentage}%</div>
                <div style="font-size:16px; margin-top:6px;">${score} / ${totalQuestions} correct</div>
                <div style="display:inline-block; margin-top:12px; background:#ffffff; color:${badgeColor}; padding:6px 18px; border-radius:20px; font-weight:bold; font-size:14px;">${badgeText}</div>
                ${timeLine}
              </div>

              <div style="padding:0 30px 24px;">
                <div style="background:#f1f5f9; border-left:4px solid #1d4ed8; padding:16px 18px; border-radius:8px;">
                  <p style="color:#334155; margin:0; font-size:14px; line-height:1.6;">
                    💡 <strong>Mbuya Zivai's tip:</strong> Take another quiz to lock in what you've learned, then visit the
                    <a href="https://bluewave.academy/downloads" style="color:#1d4ed8; text-decoration:none; font-weight:600;">downloads page</a>
                    for past papers and notes on ${category}.
                  </p>
                </div>
              </div>

              <div style="background:#f8fafc; padding:18px; text-align:center; border-top:1px solid #e2e8f0;">
                <p style="color:#64748b; font-size:12px; margin:0;">Bluewave Academy · Powered by Bluewave Technologies</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return new Response(
      JSON.stringify({ success: true, emailId: emailResponse.data?.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    console.error("send-quiz-result-email error:", error);
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
