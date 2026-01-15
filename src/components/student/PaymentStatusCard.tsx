import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Calendar, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface Enrollment {
  id: string;
  class_id: string;
  is_active: boolean;
  payment_status: string | null;
  payment_due_date: string | null;
  last_payment_date: string | null;
  payment_amount: number | null;
  auto_suspended: boolean | null;
  suspension_reason: string | null;
  classes: {
    name: string;
    subject: string;
  };
}

interface PaymentStatusCardProps {
  userId: string;
}

export default function PaymentStatusCard({ userId }: PaymentStatusCardProps) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchEnrollments();
    }
  }, [userId]);

  const fetchEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('class_enrollments')
        .select('*, classes(name, subject)')
        .eq('student_id', userId);

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (enrollment: Enrollment) => {
    if (enrollment.auto_suspended) {
      return {
        icon: XCircle,
        label: 'Suspended',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-300',
      };
    }

    const status = enrollment.payment_status || 'pending';
    switch (status) {
      case 'paid':
        return {
          icon: CheckCircle,
          label: 'Paid',
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-100',
          borderColor: 'border-emerald-300',
        };
      case 'overdue':
        return {
          icon: AlertTriangle,
          label: 'Overdue',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-300',
        };
      default:
        return {
          icon: Clock,
          label: 'Pending',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          borderColor: 'border-yellow-300',
        };
    }
  };

  const getDaysUntilDue = (dueDate: string | null) => {
    if (!dueDate) return null;
    return differenceInDays(new Date(dueDate), new Date());
  };

  if (loading) {
    return (
      <Card className="border-muted">
        <CardContent className="py-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-muted h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (enrollments.length === 0) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background mb-4">
      <CardHeader className="p-3 sm:pb-3">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Payment Status
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2 sm:space-y-3">
        {enrollments.map((enrollment) => {
          const statusInfo = getStatusInfo(enrollment);
          const StatusIcon = statusInfo.icon;
          const daysUntilDue = getDaysUntilDue(enrollment.payment_due_date);
          const isPaid = enrollment.payment_status === 'paid';
          const amount = enrollment.payment_amount || 0;

          return (
            <div
              key={enrollment.id}
              className={`p-2.5 sm:p-4 rounded-lg border ${statusInfo.borderColor} ${statusInfo.bgColor}/50`}
            >
              <div className="flex items-start sm:items-center justify-between gap-2">
                <div className="space-y-0.5 min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base text-foreground truncate">{enrollment.classes?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{enrollment.classes?.subject}</p>
                </div>
                <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border-0 gap-1 text-[10px] sm:text-xs flex-shrink-0`}>
                  <StatusIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  {statusInfo.label}
                </Badge>
              </div>

              <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-current/10 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs sm:text-sm">
                {/* Amount Paid / Balance */}
                <div>
                  <p className="text-muted-foreground text-[10px] sm:text-xs">
                    {isPaid ? 'Amount Paid' : 'Balance Due'}
                  </p>
                  <p className={`font-bold text-sm sm:text-base ${isPaid ? 'text-emerald-600' : 'text-red-600'}`}>
                    {isPaid ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        ${amount.toFixed(2)}
                      </span>
                    ) : (
                      <span>-${amount.toFixed(2)}</span>
                    )}
                  </p>
                </div>
                
                {/* Due Date */}
                {enrollment.payment_due_date && (
                  <div>
                    <p className="text-muted-foreground text-[10px] sm:text-xs">Due Date</p>
                    <p className="font-medium text-xs sm:text-sm flex items-center gap-1">
                      <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      {format(new Date(enrollment.payment_due_date), 'MMM dd')}
                    </p>
                    {daysUntilDue !== null && daysUntilDue >= 0 && !isPaid && (
                      <p className={`text-[10px] sm:text-xs ${daysUntilDue <= 3 ? 'text-red-500 font-medium' : 'text-yellow-600'}`}>
                        {daysUntilDue === 0 ? '⚠️ Due today!' : `${daysUntilDue}d left`}
                      </p>
                    )}
                    {daysUntilDue !== null && daysUntilDue < 0 && !isPaid && (
                      <p className="text-[10px] sm:text-xs text-red-500 font-bold">
                        ⚠️ {Math.abs(daysUntilDue)}d overdue
                      </p>
                    )}
                  </div>
                )}

                {/* Current Balance */}
                <div>
                  <p className="text-muted-foreground text-[10px] sm:text-xs">Current Balance</p>
                  <p className={`font-bold text-sm sm:text-base ${isPaid ? 'text-emerald-600' : 'text-red-600'}`}>
                    {isPaid ? '$0.00' : `-$${amount.toFixed(2)}`}
                  </p>
                </div>

                {/* Last Payment */}
                {enrollment.last_payment_date && (
                  <div className="hidden sm:block">
                    <p className="text-muted-foreground text-xs">Last Payment</p>
                    <p className="font-medium text-sm text-emerald-600">
                      {format(new Date(enrollment.last_payment_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                )}
              </div>

              {enrollment.auto_suspended && (
                <div className="mt-2 p-1.5 sm:p-2 bg-red-100 rounded-md">
                  <p className="text-[10px] sm:text-xs text-red-700 flex items-center gap-1 font-medium">
                    <AlertTriangle className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                    <span className="line-clamp-2">{enrollment.suspension_reason || 'Account suspended - Please contact admin to make payment'}</span>
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
