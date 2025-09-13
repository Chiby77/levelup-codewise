-- Drop the existing insecure policy
DROP POLICY IF EXISTS "Admin sessions are public" ON admin_sessions;

-- Create secure RLS policies for admin_sessions
-- Only allow system/service role to manage admin sessions
CREATE POLICY "Service role can manage admin sessions"
ON admin_sessions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Only allow reading of non-expired sessions
CREATE POLICY "Can only view valid sessions"
ON admin_sessions
FOR SELECT
TO anon, authenticated
USING (expires_at > now());

-- Only allow insertion of new sessions (for login)
CREATE POLICY "Can create new sessions"
ON admin_sessions
FOR INSERT
TO anon, authenticated
WITH CHECK (expires_at > now());

-- Prevent unauthorized updates and deletes
CREATE POLICY "No unauthorized modifications"
ON admin_sessions
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "No unauthorized deletes"
ON admin_sessions
FOR DELETE
TO service_role
USING (true);