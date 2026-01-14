import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Calendar, AlertTriangle, CheckCircle, RefreshCcw, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Enrollment {
  id: string;
  class_id: string;
  student_id: string;
  student_email: string;
  enrolled_at: string;
  is_active: boolean;
  payment_status: string | null;
  payment_due_date: string | null;
  last_payment_date: string | null;
  payment_amount: number | null;
  auto_suspended: boolean | null;
  suspension_reason: string | null;
}

interface PaymentManagementProps {
  enrollments: Enrollment[];
  onRefresh: () => void;
  className?: string;
}

export default function PaymentManagement({ enrollments, onRefresh, className }: PaymentManagementProps) {
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDueDate, setPaymentDueDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [updating, setUpdating] = useState(false);

  const handleOpenPaymentDialog = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setPaymentAmount(enrollment.payment_amount?.toString() || '');
    setPaymentDueDate(enrollment.payment_due_date?.split('T')[0] || '');
    setPaymentStatus(enrollment.payment_status || 'pending');
    setPaymentDialogOpen(true);
  };

  const handleUpdatePayment = async () => {
    if (!selectedEnrollment) return;
    setUpdating(true);

    try {
      const updateData: any = {
        payment_status: paymentStatus,
        payment_amount: paymentAmount ? parseFloat(paymentAmount) : null,
        payment_due_date: paymentDueDate ? new Date(paymentDueDate).toISOString() : null,
      };

      // If marking as paid, update last payment date and re-activate if suspended
      if (paymentStatus === 'paid') {
        updateData.last_payment_date = new Date().toISOString();
        updateData.is_active = true;
        updateData.auto_suspended = false;
        updateData.suspension_reason = null;
      }

      const { error } = await supabase
        .from('class_enrollments')
        .update(updateData)
        .eq('id', selectedEnrollment.id);

      if (error) throw error;

      toast.success('Payment details updated successfully');
      setPaymentDialogOpen(false);
      onRefresh();
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error('Failed to update payment details');
    } finally {
      setUpdating(false);
    }
  };

  const handleReEnroll = async (enrollment: Enrollment) => {
    try {
      const { error } = await supabase
        .from('class_enrollments')
        .update({
          is_active: true,
          auto_suspended: false,
          suspension_reason: null,
          payment_status: 'pending',
        })
        .eq('id', enrollment.id);

      if (error) throw error;

      toast.success('Student re-enrolled successfully');
      onRefresh();
    } catch (error) {
      console.error('Error re-enrolling student:', error);
      toast.error('Failed to re-enroll student');
    }
  };

  const getStatusBadge = (enrollment: Enrollment) => {
    if (enrollment.auto_suspended) {
      return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Suspended</Badge>;
    }
    if (!enrollment.is_active) {
      return <Badge variant="secondary" className="gap-1"><AlertTriangle className="h-3 w-3" /> Inactive</Badge>;
    }

    const status = enrollment.payment_status || 'pending';
    switch (status) {
      case 'paid':
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 gap-1"><CheckCircle className="h-3 w-3" /> Paid</Badge>;
      case 'overdue':
        return <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" /> Overdue</Badge>;
      default:
        return <Badge variant="outline" className="text-yellow-600 border-yellow-300 gap-1"><Calendar className="h-3 w-3" /> Pending</Badge>;
    }
  };

  const getBalanceDisplay = (enrollment: Enrollment) => {
    const amount = enrollment.payment_amount || 0;
    const isPaid = enrollment.payment_status === 'paid';
    
    if (isPaid) {
      return <span className="text-emerald-600 font-medium">$0.00</span>;
    }
    
    return <span className="text-red-600 font-bold">-${amount.toFixed(2)}</span>;
  };

  return (
    <div className={className}>
      {enrollments.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">No students enrolled</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Last Payment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollments.map((enrollment) => (
              <TableRow key={enrollment.id} className={enrollment.auto_suspended ? 'bg-red-50/50' : ''}>
                <TableCell className="font-medium">{enrollment.student_email}</TableCell>
                <TableCell>{getStatusBadge(enrollment)}</TableCell>
                <TableCell>{getBalanceDisplay(enrollment)}</TableCell>
                <TableCell>
                  {enrollment.payment_due_date 
                    ? format(new Date(enrollment.payment_due_date), 'MMM dd, yyyy')
                    : '-'}
                </TableCell>
                <TableCell>
                  {enrollment.last_payment_date
                    ? format(new Date(enrollment.last_payment_date), 'MMM dd, yyyy')
                    : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenPaymentDialog(enrollment)}
                    >
                      <DollarSign className="h-4 w-4" />
                    </Button>
                    {enrollment.auto_suspended && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                        onClick={() => handleReEnroll(enrollment)}
                      >
                        <RefreshCcw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              Manage Payment - {selectedEnrollment?.student_email}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Payment Status</Label>
              <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Payment Amount ($)</Label>
              <Input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="e.g., 50.00"
                step="0.01"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Due Date</Label>
              <Input
                type="date"
                value={paymentDueDate}
                onChange={(e) => setPaymentDueDate(e.target.value)}
              />
            </div>

            {selectedEnrollment?.auto_suspended && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  This student is currently suspended. Marking as "Paid" will automatically re-enroll them.
                </p>
              </div>
            )}

            <Button 
              onClick={handleUpdatePayment} 
              className="w-full"
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Update Payment Details'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
