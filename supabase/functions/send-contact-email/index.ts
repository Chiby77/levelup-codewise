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
      from: "A Level CS Experts <onboarding@resend.dev>",
      to: [email],
      subject: "We received your message!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Thank you for contacting us!</h1>
          <p>Dear ${name},</p>
          <p>We have received your message and will get back to you as soon as possible.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Your Message:</h3>
            <p style="color: #666; font-style: italic;">"${message}"</p>
          </div>
          
          <p>Our team typically responds within 24 hours. If you have any urgent questions, feel free to call us at +263 78 108 1816.</p>
          
          <p style="color: #888; font-size: 14px;">
            Best regards,<br>
            The A Level Computer Science Experts Team
          </p>
        </div>
      `,
    });

    // Send notification email to admin
    const adminEmailResponse = await resend.emails.send({
      from: "A Level CS Experts <onboarding@resend.dev>",
      to: ["tinodaishemchibi@gmail.com"],
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">New Contact Form Submission</h1>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Contact Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Message:</h3>
            <p style="color: #666;">${message}</p>
          </div>
          
          <p style="color: #888; font-size: 14px;">
            Please respond to this inquiry at your earliest convenience.
          </p>
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