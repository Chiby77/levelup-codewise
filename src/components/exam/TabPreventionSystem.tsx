import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface TabPreventionSystemProps {
  isExamActive: boolean;
  onExamSubmit: () => void;
  examId?: string;
}

export const TabPreventionSystem: React.FC<TabPreventionSystemProps> = ({ 
  isExamActive, 
  onExamSubmit, 
  examId 
}) => {
  const handleVisibilityChange = useCallback(() => {
    if (!isExamActive) return;
    
    if (document.hidden || document.visibilityState === 'hidden') {
      toast.error('Exam security violation detected! Auto-submitting exam...');
      
      // Give user a brief moment to see the message
      setTimeout(() => {
        onExamSubmit();
      }, 2000);
    }
  }, [isExamActive, onExamSubmit]);

  const handleWindowBlur = useCallback(() => {
    if (!isExamActive) return;
    
    toast.warning('Focus lost detected - do not leave the exam tab!');
  }, [isExamActive]);

  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (!isExamActive) return;
    
    const message = 'Are you sure you want to leave? Your exam will be auto-submitted.';
    e.returnValue = message;
    return message;
  }, [isExamActive]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isExamActive) return;
    
    // Prevent common tab switching shortcuts
    if (
      (e.ctrlKey && e.key === 'Tab') ||
      (e.altKey && e.key === 'Tab') ||
      (e.metaKey && e.key === 'Tab') ||
      e.key === 'F11' || // Fullscreen
      (e.ctrlKey && e.shiftKey && e.key === 'I') || // Developer tools
      (e.ctrlKey && e.shiftKey && e.key === 'J') ||
      (e.ctrlKey && e.key === 'U') || // View source
      e.key === 'F12' // Developer tools
    ) {
      e.preventDefault();
      toast.error('This action is not allowed during the exam!');
    }
  }, [isExamActive]);

  const handleContextMenu = useCallback((e: MouseEvent) => {
    if (!isExamActive) return;
    
    e.preventDefault();
    toast.warning('Right-click is disabled during the exam');
  }, [isExamActive]);

  useEffect(() => {
    if (!isExamActive) return;

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    // Track exam session
    const examStartTime = Date.now();
    localStorage.setItem(`exam_${examId}_start`, examStartTime.toString());

    // Disable text selection
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    return () => {
      // Cleanup
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);

      // Re-enable text selection
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };
  }, [isExamActive, examId, handleVisibilityChange, handleWindowBlur, handleBeforeUnload, handleKeyDown, handleContextMenu]);

  // Request fullscreen when exam starts
  useEffect(() => {
    if (isExamActive && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {
        toast.warning('Fullscreen recommended for better exam experience');
      });
    }
  }, [isExamActive]);

  return null; // This component only handles events, no UI
};