import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Save, History, Download, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { generatePDFReport } from '@/utils/reportGenerator';

interface Submission {
  id: string;
  student_name: string;
  student_email?: string;
  total_score: number;
  max_score: number;
  graded: boolean;
  answers: any;
  grade_details: any;
  submitted_at: string;
  time_taken_minutes?: number;
}

interface AuditEntry {
  id: string;
  question_id: string | null;
  action: string;
  previous_score: number | null;
  new_score: number | null;
  previous_feedback: string | null;
  new_feedback: string | null;
  notes: string | null;
  created_at: string;
}

interface Props {
  submission: Submission;
  onUpdated?: () => void;
}

export const SubmissionGradingReview: React.FC<Props> = ({ submission, onUpdated }) => {
  const [details, setDetails] = useState<Record<string, any>>(submission.grade_details || {});
  const [saving, setSaving] = useState<string | null>(null);
  const [regrading, setRegrading] = useState(false);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);

  useEffect(() => {
    setDetails(submission.grade_details || {});
    loadAudit();
  }, [submission.id]);

  const loadAudit = async () => {
    const { data, error } = await (supabase as any)
      .from('grading_audit_log')
      .select('*')
      .eq('submission_id', submission.id)
      .order('created_at', { ascending: false });
    if (!error) setAuditLog((data || []) as AuditEntry[]);
  };

  const updateField = (qId: string, field: 'score' | 'feedback', value: any) => {
    setDetails((prev) => ({
      ...prev,
      [qId]: { ...prev[qId], [field]: value },
    }));
  };

  const saveQuestionOverride = async (qId: string) => {
    setSaving(qId);
    try {
      const prev = (submission.grade_details || {})[qId] || {};
      const next = details[qId];
      const newScore = Math.max(0, Math.min(Number(next.maxScore || prev.maxScore || 0), Number(next.score) || 0));

      const updatedDetails = { ...details, [qId]: { ...next, score: newScore } };
      const total = Object.values(updatedDetails).reduce(
        (sum: number, d: any) => sum + (Number(d?.score) || 0),
        0,
      );

      const { error: updErr } = await supabase
        .from('student_submissions')
        .update({
          grade_details: updatedDetails,
          total_score: Math.round(total * 10) / 10,
          graded: true,
          grading_status: 'completed',
        })
        .eq('id', submission.id);
      if (updErr) throw updErr;

      const { data: { user } } = await supabase.auth.getUser();
      await (supabase as any).from('grading_audit_log').insert({
        submission_id: submission.id,
        question_id: qId,
        action: 'admin_override',
        previous_score: prev.score ?? null,
        new_score: newScore,
        previous_feedback: prev.feedback ?? null,
        new_feedback: next.feedback ?? null,
        changed_by: user?.id ?? null,
        notes: 'Manual admin override',
      });

      setDetails(updatedDetails);
      await loadAudit();
      toast.success('Score override saved');
      onUpdated?.();
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || 'Failed to save override');
    } finally {
      setSaving(null);
    }
  };

  const triggerRegrade = async () => {
    setRegrading(true);
    try {
      const { error } = await supabase.functions.invoke('grade-exam', {
        body: { submissionId: submission.id, examId: (submission as any).exam_id, answers: submission.answers },
      });
      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();
      await (supabase as any).from('grading_audit_log').insert({
        submission_id: submission.id,
        action: 'regrade',
        changed_by: user?.id ?? null,
        notes: 'Admin-triggered AI regrade',
      });

      toast.success('Regrade triggered — refreshing shortly');
      setTimeout(() => onUpdated?.(), 3000);
      await loadAudit();
    } catch (e: any) {
      toast.error(e.message || 'Regrade failed');
    } finally {
      setRegrading(false);
    }
  };

  const handleDownload = async () => {
    try {
      await generatePDFReport(submission as any);
      toast.success('PDF report downloaded');
    } catch (e) {
      console.error(e);
      toast.error('Failed to generate PDF');
    }
  };

  const totalLive = Object.values(details).reduce(
    (s: number, d: any) => s + (Number(d?.score) || 0),
    0,
  );
  const maxLive = Object.values(details).reduce(
    (s: number, d: any) => s + (Number(d?.maxScore) || 0),
    0,
  ) || submission.max_score;
  const pct = maxLive > 0 ? Math.round((totalLive / maxLive) * 100) : 0;

  const answers = submission.answers || {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
        <div>
          <p className="text-xs text-muted-foreground">Student</p>
          <p className="font-semibold">{submission.student_name}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Submitted</p>
          <p className="font-semibold text-sm">{new Date(submission.submitted_at).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Score</p>
          <p className="font-semibold">
            {Math.round(totalLive * 10) / 10} / {maxLive} <span className="text-muted-foreground">({pct}%)</span>
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button size="sm" variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" /> PDF
          </Button>
          <Button size="sm" variant="outline" onClick={triggerRegrade} disabled={regrading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${regrading ? 'animate-spin' : ''}`} /> Regrade
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Per-Question Review & Override</h3>
        {Object.entries(answers).map(([qId, answer], idx) => {
          const d = details[qId] || { score: 0, maxScore: 0, feedback: '', questionText: '' };
          const studentAnswer =
            typeof answer === 'string' ? answer : JSON.stringify(answer, null, 2);
          return (
            <Card key={qId}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Question {idx + 1}</span>
                  <Badge variant="outline">
                    {d.score ?? 0} / {d.maxScore ?? 0}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {d.questionText && (
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{d.questionText}</p>
                )}
                <div>
                  <Label className="text-xs">Student Answer</Label>
                  <div className="p-2 bg-muted/50 rounded text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {studentAnswer || <em className="text-muted-foreground">No answer</em>}
                  </div>
                  {d.studentImageUrl && (
                    <img src={d.studentImageUrl} alt="answer" className="mt-2 max-h-48 rounded border" />
                  )}
                </div>
                {d.correctAnswer && (
                  <div>
                    <Label className="text-xs">Reference Answer</Label>
                    <div className="p-2 bg-primary/5 rounded text-sm whitespace-pre-wrap">{d.correctAnswer}</div>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-3">
                  <div>
                    <Label className="text-xs">Score (max {d.maxScore ?? 0})</Label>
                    <Input
                      type="number"
                      step="0.5"
                      min={0}
                      max={d.maxScore ?? 0}
                      value={d.score ?? 0}
                      onChange={(e) => updateField(qId, 'score', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Feedback</Label>
                    <Textarea
                      rows={2}
                      value={d.feedback ?? ''}
                      onChange={(e) => updateField(qId, 'feedback', e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => saveQuestionOverride(qId)}
                  disabled={saving === qId}
                >
                  <Save className="h-4 w-4 mr-1" />
                  {saving === qId ? 'Saving…' : 'Save Override'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
          <History className="h-4 w-4" /> Grading Audit Log
        </h3>
        {auditLog.length === 0 ? (
          <p className="text-sm text-muted-foreground">No grading changes recorded yet.</p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {auditLog.map((e) => (
              <div key={e.id} className="text-xs p-2 border rounded bg-muted/30">
                <div className="flex justify-between mb-1">
                  <Badge variant={e.action === 'admin_override' ? 'default' : 'secondary'}>
                    {e.action}
                  </Badge>
                  <span className="text-muted-foreground">
                    {new Date(e.created_at).toLocaleString()}
                  </span>
                </div>
                {e.question_id && <p>Question: <code>{e.question_id.slice(0, 8)}…</code></p>}
                {(e.previous_score !== null || e.new_score !== null) && (
                  <p>
                    Score: {e.previous_score ?? '—'} → <strong>{e.new_score ?? '—'}</strong>
                  </p>
                )}
                {e.notes && <p className="text-muted-foreground">{e.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
