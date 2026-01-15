import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AdminActionRequest {
  action: string;
  userId?: string;
  data?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, userId, data }: AdminActionRequest = await req.json();
    console.log('Admin action:', action, 'userId:', userId);

    switch (action) {
      case 'list_users': {
        // Get all profiles
        const { data: profilesData, error: profilesError } = await supabaseClient
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profilesError) throw profilesError;

        // Get auth users for emails
        const { data: { users: authUsers }, error: authError } = 
          await supabaseClient.auth.admin.listUsers();

        if (authError) throw authError;

        // Get user roles
        const { data: rolesData } = await supabaseClient
          .from('user_roles')
          .select('user_id, role');

        const mergedUsers = (profilesData || []).map(profile => {
          const authUser = authUsers?.find(u => u.id === profile.id);
          const userRole = rolesData?.find(r => r.user_id === profile.id);
          return {
            ...profile,
            email: authUser?.email || 'N/A',
            last_login_at: profile.last_login_at || authUser?.last_sign_in_at || null,
            role: userRole?.role || 'user'
          };
        });

        return new Response(JSON.stringify({ users: mergedUsers }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'update_status':
        await supabaseClient
          .from('profiles')
          .update({ account_status: data.status })
          .eq('id', userId);
        
        await supabaseClient.from('user_activity_logs').insert({
          user_id: userId,
          activity_type: 'status_changed',
          details: { new_status: data.status }
        });
        
        return new Response(JSON.stringify({ message: 'Status updated successfully' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'reset_password': {
        const { error: resetError } = await supabaseClient.auth.admin.updateUserById(
          userId!,
          { password: data.newPassword }
        );
        if (resetError) throw resetError;
        
        await supabaseClient.from('user_activity_logs').insert({
          user_id: userId,
          activity_type: 'password_reset_by_admin',
          details: {}
        });
        
        return new Response(JSON.stringify({ message: 'Password reset successfully' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'delete_user': {
        const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(userId!);
        if (deleteError) throw deleteError;
        return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'make_admin': {
        // Check if user already has admin role
        const { data: existingRole } = await supabaseClient
          .from('user_roles')
          .select('*')
          .eq('user_id', userId)
          .eq('role', 'admin')
          .single();

        if (existingRole) {
          return new Response(JSON.stringify({ message: 'User is already an admin' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Add admin role
        const { error: roleError } = await supabaseClient
          .from('user_roles')
          .insert({ user_id: userId, role: 'admin' });

        if (roleError) throw roleError;

        await supabaseClient.from('user_activity_logs').insert({
          user_id: userId,
          activity_type: 'promoted_to_admin',
          details: {}
        });

        return new Response(JSON.stringify({ message: 'User promoted to admin successfully' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'remove_admin': {
        const { error: roleError } = await supabaseClient
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'admin');

        if (roleError) throw roleError;

        await supabaseClient.from('user_activity_logs').insert({
          user_id: userId,
          activity_type: 'demoted_from_admin',
          details: {}
        });

        return new Response(JSON.stringify({ message: 'Admin role removed successfully' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'send_results_email': {
        const { submissionId, studentEmail, studentName, totalScore, maxScore, gradeDetails, examTitle } = data;
        
        console.log('Sending results email to:', studentEmail, 'for submission:', submissionId);
        
        // Validate required fields
        if (!studentEmail) {
          throw new Error('Student email is required');
        }
        if (totalScore === undefined || totalScore === null) {
          throw new Error('Total score is required');
        }
        if (!maxScore || maxScore === 0) {
          throw new Error('Max score is required and must be greater than 0');
        }
        
        const resendApiKey = Deno.env.get('RESEND_API_KEY');
        if (!resendApiKey) {
          console.error('RESEND_API_KEY not found in environment');
          throw new Error('RESEND_API_KEY not configured');
        }

        const percentage = Math.round((totalScore / maxScore) * 100);
        const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : percentage >= 50 ? 'D' : 'F';

        // Build grade breakdown HTML
        let breakdownHtml = '';
        if (gradeDetails && typeof gradeDetails === 'object') {
          breakdownHtml = '<h3 style="margin-top: 20px;">Grade Breakdown:</h3><ul>';
          for (const [questionId, detail] of Object.entries(gradeDetails as Record<string, any>)) {
            if (detail && typeof detail === 'object') {
              breakdownHtml += `<li><strong>Question:</strong> ${detail.score || 0}/${detail.maxScore || 0} - ${detail.feedback || 'No feedback'}</li>`;
            }
          }
          breakdownHtml += '</ul>';
        }

        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0;">CS Experts Zimbabwe</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Exam Results</p>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
              <p>Dear <strong>${studentName || 'Student'}</strong>,</p>
              
              <p>Your exam "<strong>${examTitle || 'Examination'}</strong>" has been graded. Here are your results:</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border: 1px solid #e5e7eb;">
                <h2 style="margin: 0; color: #667eea; font-size: 48px;">${percentage}%</h2>
                <p style="margin: 5px 0; color: #6b7280;">Grade: <strong style="color: ${percentage >= 70 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444'}">${grade}</strong></p>
                <p style="margin: 5px 0; color: #6b7280;">Score: ${totalScore} / ${maxScore}</p>
              </div>
              
              ${breakdownHtml}
              
              <p style="margin-top: 20px;">Keep up the great work! 🎉</p>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                Best regards,<br>
                CS Experts Zimbabwe Team
              </p>
            </div>
          </div>
        `;

        console.log('Sending email via Resend API...');
        
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'CS Experts <onboarding@resend.dev>',
            to: [studentEmail],
            subject: `Your Exam Results - ${examTitle || 'Examination'}`,
            html: emailHtml,
          }),
        });

        const responseText = await emailResponse.text();
        console.log('Resend API response status:', emailResponse.status);
        console.log('Resend API response:', responseText);

        if (!emailResponse.ok) {
          console.error('Email send error:', responseText);
          throw new Error(`Failed to send email: ${responseText}`);
        }

        await supabaseClient.from('user_activity_logs').insert({
          user_id: userId || '00000000-0000-0000-0000-000000000000',
          activity_type: 'results_email_sent',
          details: { submissionId, studentEmail }
        });

        return new Response(JSON.stringify({ message: 'Results email sent successfully' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get_active_students': {
        // Get students currently taking exams (recent submissions in last hour without grading)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        
        const { data: activeStudents, error } = await supabaseClient
          .from('student_submissions')
          .select('student_name, student_email, exam_id, submitted_at')
          .gte('submitted_at', oneHourAgo)
          .eq('graded', false);

        if (error) throw error;

        return new Response(JSON.stringify({ activeStudents: activeStudents || [] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get_page_visits': {
        // Get page visit statistics from user_activity_logs
        const { data: visits, error } = await supabaseClient
          .from('user_activity_logs')
          .select('activity_type, created_at, details')
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;

        return new Response(JSON.stringify({ visits: visits || [] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'find_user_by_email': {
        const email = String(data?.email ?? '').trim().toLowerCase();
        if (!email) {
          return new Response(JSON.stringify({ error: 'Email is required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const perPage = 200;
        const maxPages = 50; // supports up to 10k users without timing out

        for (let page = 1; page <= maxPages; page++) {
          const { data: listData, error: listError } = await supabaseClient.auth.admin.listUsers({
            page,
            perPage,
          });

          if (listError) throw listError;

          const users = listData?.users ?? [];
          const match = users.find((u) => (u.email ?? '').toLowerCase() === email);

          if (match) {
            return new Response(JSON.stringify({ user: { id: match.id, email: match.email } }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          if (users.length < perPage) break; // no more pages
        }

        return new Response(JSON.stringify({ user: null }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Admin user management error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});