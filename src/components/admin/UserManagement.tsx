import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Trash2, Lock, Activity, Crown, UserMinus, RefreshCw } from "lucide-react";

interface UserProfile {
  id: string;
  full_name: string | null;
  student_id: string | null;
  account_status: string;
  last_login_at: string | null;
  created_at: string;
  email?: string;
  role?: string;
}

interface UserActivity {
  id: string;
  activity_type: string;
  details: any;
  created_at: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    
    const channel = supabase
      .channel('user-management-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchUsers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({ title: "Error", description: "You must be logged in", variant: "destructive" });
        return;
      }

      const response = await fetch(
        `https://lprllsdtgnewmsnjyxhj.supabase.co/functions/v1/admin-user-management`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "list_users" }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch users");
      }

      const result = await response.json();
      setUsers(result.users || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserActivity = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_activity_logs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setActivities(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleAdminAction = async (action: string, userId: string, data?: any) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `https://lprllsdtgnewmsnjyxhj.supabase.co/functions/v1/admin-user-management`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action, userId, data }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      toast({ title: "Success", description: result.message });
      fetchUsers();
      setShowPasswordDialog(false);
      setShowDeleteDialog(false);
      setShowAdminDialog(false);
      setNewPassword("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    (user.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.student_id?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      active: "default",
      suspended: "secondary",
      deactivated: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const getRoleBadge = (role?: string) => {
    if (role === 'admin') {
      return <Badge className="bg-amber-500 hover:bg-amber-600"><Crown className="h-3 w-3 mr-1" />Admin</Badge>;
    }
    return <Badge variant="outline">User</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
              <Badge variant="secondary">{users.length} users</Badge>
            </CardTitle>
            <div className="flex gap-2">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Button variant="outline" size="icon" onClick={fetchUsers} disabled={loading}>
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name || "N/A"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.email || "N/A"}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.account_status)}</TableCell>
                    <TableCell className="text-sm">
                      {user.last_login_at ? new Date(user.last_login_at).toLocaleString() : "Never"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        <Select
                          value={user.account_status}
                          onValueChange={(value) => handleAdminAction("update_status", user.id, { status: value })}
                        >
                          <SelectTrigger className="w-28 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                            <SelectItem value="deactivated">Deactivated</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowAdminDialog(true);
                          }}
                          title={user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        >
                          {user.role === 'admin' ? <UserMinus className="h-4 w-4 text-amber-500" /> : <Crown className="h-4 w-4" />}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => { setSelectedUser(user); setShowPasswordDialog(true); }}
                          title="Reset Password"
                        >
                          <Lock className="h-4 w-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => { setSelectedUser(user); fetchUserActivity(user.id); setShowActivityDialog(true); }}
                          title="View Activity"
                        >
                          <Activity className="h-4 w-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 w-8 p-0"
                          onClick={() => { setSelectedUser(user); setShowDeleteDialog(true); }}
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Make Admin Dialog */}
      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              {selectedUser?.role === 'admin' ? 'Remove Admin Role' : 'Make User Admin'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.role === 'admin'
                ? `Are you sure you want to remove admin privileges from ${selectedUser?.full_name}?`
                : `Are you sure you want to make ${selectedUser?.full_name} an administrator? They will have full access to manage exams, users, and all settings.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdminDialog(false)}>Cancel</Button>
            <Button
              variant={selectedUser?.role === 'admin' ? 'destructive' : 'default'}
              onClick={() => handleAdminAction(selectedUser?.role === 'admin' ? 'remove_admin' : 'make_admin', selectedUser!.id)}
              disabled={loading}
            >
              {selectedUser?.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Reset Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>Set a new password for {selectedUser?.full_name}</DialogDescription>
          </DialogHeader>
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
            <Button onClick={() => handleAdminAction("reset_password", selectedUser!.id, { newPassword })} disabled={loading || !newPassword}>
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete {selectedUser?.full_name}? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => handleAdminAction("delete_user", selectedUser!.id)} disabled={loading}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activity Log Dialog */}
      <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Activity Log - {selectedUser?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">No activity recorded</TableCell>
                  </TableRow>
                ) : (
                  activities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.activity_type}</TableCell>
                      <TableCell className="text-xs">
                        <pre className="whitespace-pre-wrap">{JSON.stringify(activity.details, null, 2)}</pre>
                      </TableCell>
                      <TableCell className="text-sm">{new Date(activity.created_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};