import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    // Verify admin role
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { data: roleData } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (roleData?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { action, userId, data } = await req.json()

    let result

    switch (action) {
      case 'reset_password':
        // Reset user password
        const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          userId,
          { password: data.newPassword }
        )
        
        if (updateError) throw updateError
        
        // Log activity
        await supabaseAdmin.from('user_activity_logs').insert({
          user_id: userId,
          activity_type: 'password_reset_by_admin',
          details: { admin_id: user.id }
        })
        
        result = { success: true, message: 'Password reset successfully' }
        break

      case 'delete_user':
        // Delete user
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
        
        if (deleteError) throw deleteError
        
        result = { success: true, message: 'User deleted successfully' }
        break

      case 'update_status':
        // Update account status
        const { error: statusError } = await supabaseAdmin
          .from('profiles')
          .update({ account_status: data.status })
          .eq('id', userId)
        
        if (statusError) throw statusError
        
        // Log activity
        await supabaseAdmin.from('user_activity_logs').insert({
          user_id: userId,
          activity_type: 'status_changed',
          details: { new_status: data.status, admin_id: user.id }
        })
        
        result = { success: true, message: 'Account status updated' }
        break

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
