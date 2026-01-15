import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Enrollment {
  id: string;
  student_email: string;
  student_id: string;
  payment_status: string | null;
  payment_due_date: string | null;
  payment_amount: number | null;
  is_active: boolean;
  class_id: string;
  classes: {
    name: string;
    subject: string;
  };
  profiles: {
    full_name: string | null;
  } | null;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { action } = body;

    if (action === "send_bulk_reminders") {
      // Fetch all enrollments with pending/overdue payments
      const { data: enrollments, error } = await supabase
        .from("class_enrollments")
        .select(`
          id,
          student_email,
          student_id,
          payment_status,
          payment_due_date,
          payment_amount,
          is_active,
          class_id,
          classes(name, subject)
        `)
        .in("payment_status", ["pending", "overdue"])
        .eq("is_active", true);

      if (error) {
        console.error("Error fetching enrollments:", error);
        throw error;
      }

      if (!enrollments || enrollments.length === 0) {
        return new Response(
          JSON.stringify({ message: "No unpaid students found", count: 0 }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Fetch profiles for student names
      const studentIds = [...new Set(enrollments.map(e => e.student_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", studentIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p.full_name]) || []);

      let successCount = 0;
      let failedCount = 0;

      for (const enrollment of enrollments) {
        if (!enrollment.student_email) continue;

        const studentName = profileMap.get(enrollment.student_id) || "Student";
        const className = (enrollment.classes as any)?.name || "Class";
        const amount = enrollment.payment_amount || 0;
        const dueDate = enrollment.payment_due_date
          ? new Date(enrollment.payment_due_date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Not set";

        const isOverdue = enrollment.payment_status === "overdue";

        try {
          await resend.emails.send({
            from: "CS Experts Zimbabwe <onboarding@resend.dev>",
            to: [enrollment.student_email],
            subject: isOverdue 
              ? `⚠️ URGENT: Payment Overdue for ${className}` 
              : `📅 Payment Reminder for ${className}`,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, ${isOverdue ? '#dc2626' : '#3b82f6'}, ${isOverdue ? '#b91c1c' : '#2563eb'}); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">
                    ${isOverdue ? '⚠️ Payment Overdue' : '📅 Payment Reminder'}
                  </h1>
                </div>
                
                <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
                  <p style="font-size: 16px;">Hello <strong>${studentName}</strong>,</p>
                  
                  <p style="font-size: 15px;">
                    ${isOverdue 
                      ? 'Your payment for the following class is now <strong style="color: #dc2626;">overdue</strong>. Please make your payment immediately to avoid suspension.' 
                      : 'This is a friendly reminder about your upcoming payment for the following class:'}
                  </p>
                  
                  <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280;">Class:</td>
                        <td style="padding: 8px 0; font-weight: 600; text-align: right;">${className}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280;">Amount Due:</td>
                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: ${isOverdue ? '#dc2626' : '#059669'};">$${amount.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280;">Due Date:</td>
                        <td style="padding: 8px 0; font-weight: 600; text-align: right; ${isOverdue ? 'color: #dc2626;' : ''}">${dueDate}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280;">Status:</td>
                        <td style="padding: 8px 0; text-align: right;">
                          <span style="background: ${isOverdue ? '#fef2f2' : '#fef3c7'}; color: ${isOverdue ? '#dc2626' : '#d97706'}; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600;">
                            ${isOverdue ? 'OVERDUE' : 'PENDING'}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </div>
                  
                  ${isOverdue ? `
                  <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 15px; margin: 20px 0;">
                    <p style="margin: 0; color: #dc2626; font-size: 14px;">
                      <strong>⚠️ Important:</strong> Failure to pay may result in temporary suspension from the class and loss of access to exams and materials.
                    </p>
                  </div>
                  ` : ''}
                  
                  <p style="font-size: 14px; color: #6b7280;">
                    If you have already made the payment, please disregard this email. For any questions, please contact your administrator.
                  </p>
                  
                  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">
                  
                  <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
                    This is an automated message from CS Experts Zimbabwe.<br>
                    Please do not reply to this email.
                  </p>
                </div>
              </body>
              </html>
            `,
          });
          successCount++;
        } catch (emailError) {
          console.error(`Failed to send email to ${enrollment.student_email}:`, emailError);
          failedCount++;
        }
      }

      return new Response(
        JSON.stringify({
          message: `Payment reminders sent`,
          success: successCount,
          failed: failedCount,
          total: enrollments.length,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-payment-reminders function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
