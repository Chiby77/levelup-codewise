import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Contact email function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message }: ContactEmailRequest = await req.json();
    
    console.log("Contact email request:", { name, email });

    // Send confirmation email to the user
    const userEmailResponse = await resend.emails.send({
      from: "Bluewave Academy <onboarding@resend.dev>",
      to: [email],
      subject: "[Bluewave Academy] We received your message",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; max-width: 600px; margin: 0 auto; background:#ffffff;">
          <div style="background: linear-gradient(135deg, #1d4ed8 0%, #0ea5e9 100%); padding:28px 24px; text-align:center;">
            <h1 style="color:#ffffff; margin:0; font-size:22px; letter-spacing:0.4px;">BLUEWAVE ACADEMY</h1>
            <p style="color:rgba(255,255,255,0.9); margin:6px 0 0; font-size:13px;">A Level Computer Science · Zimbabwe</p>
          </div>
          <div style="padding:28px 24px;">
            <h2 style="color:#0f172a; margin:0 0 8px; font-size:20px;">Thanks for reaching out, ${name}!</h2>
            <p style="color:#475569; margin:0 0 16px;">We've received your message and a member of the Bluewave team will be in touch within 24 hours.</p>

            <div style="background:#f1f5f9; padding:18px; border-radius:10px; border-left:4px solid #1d4ed8;">
              <h3 style="color:#334155; margin:0 0 8px; font-size:14px; text-transform:uppercase; letter-spacing:0.6px;">Your message</h3>
              <p style="color:#475569; margin:0; font-style:italic;">"${message}"</p>
            </div>

            <p style="color:#64748b; font-size:14px; margin:20px 0 0;">For anything urgent, call <strong>+263 78 108 1816</strong> or reply to this email.</p>
          </div>
          <div style="background:#f8fafc; padding:18px 24px; text-align:center; border-top:1px solid #e2e8f0;">
            <p style="color:#64748b; font-size:12px; margin:0;">Bluewave Academy · Powered by Bluewave Technologies</p>
          </div>
        </div>
      `,
    });

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "Bluewave Academy <onboarding@resend.dev>",
      to: ["tinodaishemchibi@gmail.com"],
      subject: `[Bluewave Academy] New contact message from ${name}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color:#0f172a;">New contact form submission</h1>

          <div style="background-color:#f1f5f9; padding:18px; border-radius:8px; margin:16px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>

          <div style="background-color:#f8fafc; padding:18px; border-radius:8px; border-left:4px solid #1d4ed8;">
            <h3 style="color:#334155; margin-top:0;">Message</h3>
            <p style="color:#475569;">${message}</p>
          </div>
        </div>
      `,
    });

    console.log("Emails sent successfully:", { userEmailResponse, adminEmailResponse });

    return new Response(JSON.stringify({ 
      success: true,
      userEmailId: userEmailResponse.data?.id,
      adminEmailId: adminEmailResponse.data?.id
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
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