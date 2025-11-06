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

    switch (action) {
      case 'list_users': {
        const { data: profilesData, error: profilesError } = await supabaseClient
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profilesError) throw profilesError;

        const { data: { users: authUsers }, error: authError } = 
          await supabaseClient.auth.admin.listUsers();

        if (authError) throw authError;

        const mergedUsers = (profilesData || []).map(profile => {
          const authUser = authUsers?.find(u => u.id === profile.id);
          return {
            ...profile,
            email: authUser?.email || 'N/A',
            last_login_at: profile.last_login_at || authUser?.last_sign_in_at || null
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
