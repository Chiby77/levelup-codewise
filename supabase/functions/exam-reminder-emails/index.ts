import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Exam {
  id: string;
  title: string;
  subject: string;
  description: string;
  start_time: string;
  duration_minutes: number;
  total_marks: number;
}

interface StudyTip {
  title: string;
  content: string;
  category: string;
}

interface Profile {
  id: string;
  full_name: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Starting exam reminder check...");

    // Get exams starting in the next 24 hours
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in1Hour = new Date(now.getTime() + 60 * 60 * 1000);

    // Fetch upcoming exams
    const { data: upcomingExams, error: examsError } = await supabase
      .from("exams")
      .select("*")
      .eq("status", "active")
      .gte("start_time", now.toISOString())
      .lte("start_time", in24Hours.toISOString());

    if (examsError) {
      console.error("Error fetching exams:", examsError);
      throw examsError;
    }

    console.log(`Found ${upcomingExams?.length || 0} upcoming exams`);

    if (!upcomingExams || upcomingExams.length === 0) {
      return new Response(
        JSON.stringify({ message: "No upcoming exams to notify about" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Fetch study tips for email content
    const { data: studyTips } = await supabase
      .from("study_tips")
      .select("title, content, category")
      .eq("is_active", true)
      .limit(3);

    // Get all student users with their emails
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error("Error fetching users:", authError);
      throw authError;
    }

    // Get profiles for names
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name");

    const profileMap = new Map((profiles || []).map(p => [p.id, p.full_name]));

    // Filter to only students (non-admins)
    const { data: adminRoles } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    const adminIds = new Set((adminRoles || []).map(r => r.user_id));
    const students = authUsers.users.filter(u => !adminIds.has(u.id) && u.email);

    console.log(`Sending reminders to ${students.length} students`);

    let emailsSent = 0;

    for (const exam of upcomingExams) {
      const examDate = new Date(exam.start_time);
      const hoursUntilExam = Math.round((examDate.getTime() - now.getTime()) / (1000 * 60 * 60));
      const isUrgent = hoursUntilExam <= 1;

      for (const student of students) {
        const studentName = profileMap.get(student.id) || student.email?.split("@")[0] || "Student";

        const studyTipsHtml = studyTips?.length 
          ? `
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1a1a2e; margin-bottom: 15px;">📚 Quick Study Tips</h3>
              ${studyTips.map(tip => `
                <div style="margin-bottom: 15px; padding: 10px; background: white; border-radius: 6px;">
                  <strong style="color: #6366f1;">${tip.title}</strong>
                  <p style="color: #4a4a4a; margin: 5px 0 0 0; font-size: 14px;">${tip.content.substring(0, 150)}...</p>
                </div>
              `).join("")}
            </div>
          `
          : "";

        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">
                  ${isUrgent ? "⚠️ Exam Starting Soon!" : "📅 Upcoming Exam Reminder"}
                </h1>
              </div>
              
              <!-- Content -->
              <div style="padding: 30px;">
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                  Hello <strong>${studentName}</strong>,
                </p>
                
                <p style="color: #333; font-size: 16px; line-height: 1.6;">
                  ${isUrgent 
                    ? `Your exam "<strong>${exam.title}</strong>" is starting in <strong style="color: #ef4444;">less than 1 hour</strong>!`
                    : `This is a friendly reminder that you have an upcoming exam in <strong>${hoursUntilExam} hours</strong>.`
                  }
                </p>
                
                <!-- Exam Details Card -->
                <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 25px; border-radius: 10px; margin: 20px 0;">
                  <h2 style="margin: 0 0 15px 0; font-size: 20px;">${exam.title}</h2>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #a5b4fc;">📚 Subject:</td>
                      <td style="padding: 8px 0; text-align: right;">${exam.subject}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #a5b4fc;">📅 Date:</td>
                      <td style="padding: 8px 0; text-align: right;">${examDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #a5b4fc;">⏰ Time:</td>
                      <td style="padding: 8px 0; text-align: right;">${examDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #a5b4fc;">⏱️ Duration:</td>
                      <td style="padding: 8px 0; text-align: right;">${exam.duration_minutes} minutes</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #a5b4fc;">📊 Total Marks:</td>
                      <td style="padding: 8px 0; text-align: right;">${exam.total_marks}</td>
                    </tr>
                  </table>
                </div>
                
                ${studyTipsHtml}
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://cs-experts-zimbabwe.lovable.app/student-exam" 
                     style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    Go to Exam Portal
                  </a>
                </div>
                
                <!-- Tips -->
                <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                  <strong style="color: #92400e;">💡 Preparation Tips:</strong>
                  <ul style="color: #92400e; margin: 10px 0 0 0; padding-left: 20px;">
                    <li>Ensure stable internet connection</li>
                    <li>Use a desktop/laptop for best experience</li>
                    <li>Have your notes ready for reference</li>
                    <li>Stay calm and read questions carefully</li>
                  </ul>
                </div>
              </div>
              
              <!-- Footer -->
              <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  CS Experts Zimbabwe - Empowering A Level Computer Science Students
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 10px 0 0 0;">
                  Join Bluewave Academy WhatsApp Group for more resources!
                </p>
              </div>
            </div>
          </body>
          </html>
        `;

        try {
          await resend.emails.send({
            from: "CS Experts <onboarding@resend.dev>",
            to: [student.email!],
            subject: isUrgent 
              ? `⚠️ URGENT: "${exam.title}" starts in ${hoursUntilExam} hour!`
              : `📅 Reminder: "${exam.title}" exam in ${hoursUntilExam} hours`,
            html: emailHtml,
          });
          emailsSent++;
          console.log(`Sent reminder to ${student.email} for exam ${exam.title}`);
        } catch (emailError) {
          console.error(`Failed to send email to ${student.email}:`, emailError);
        }
      }
    }

    console.log(`Successfully sent ${emailsSent} reminder emails`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Sent ${emailsSent} reminder emails for ${upcomingExams.length} upcoming exams` 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in exam reminder function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
