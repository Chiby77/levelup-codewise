import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNotificationSound } from './useNotificationSound';

interface UseRealtimeSubmissionsWithSoundProps {
  onNewSubmission?: (submission: any) => void;
  enabled?: boolean;
}

export const useRealtimeSubmissionsWithSound = ({ 
  onNewSubmission, 
  enabled = true 
}: UseRealtimeSubmissionsWithSoundProps = {}) => {
  const { playSound, soundEnabled, toggleSound } = useNotificationSound();

  useEffect(() => {
    if (!enabled) return;

    const channel = supabase
      .channel('admin-submission-notifications-with-sound')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'student_submissions'
        },
        async (payload) => {
          const newSubmission = payload.new;
          
          // Play notification sound
          playSound();
          
          // Fetch exam title for the notification
          const { data: exam } = await supabase
            .from('exams')
            .select('title')
            .eq('id', newSubmission.exam_id)
            .single();
          
          // Show toast notification
          toast.success(
            `🎓 New Submission!`,
            {
              description: `${newSubmission.student_name} just submitted "${exam?.title || 'an exam'}"`,
              duration: 8000,
              action: {
                label: 'View',
                onClick: () => window.location.href = '/exams?tab=submissions'
              }
            }
          );
          
          // Call the callback if provided
          if (onNewSubmission) {
            onNewSubmission(newSubmission);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, onNewSubmission, playSound]);

  return { soundEnabled, toggleSound };
};
