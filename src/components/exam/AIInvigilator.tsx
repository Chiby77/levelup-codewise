import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, Camera, Monitor, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AIInvigilatorProps {
  isActive: boolean;
  onViolationDetected: (violation: string) => void;
}

interface ViolationLog {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}

export const AIInvigilator: React.FC<AIInvigilatorProps> = ({ isActive, onViolationDetected }) => {
  const [violations, setViolations] = useState<ViolationLog[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [suspiciousActivity, setSuspiciousActivity] = useState(0);
  const [windowFocusLost, setWindowFocusLost] = useState(0);
  const [showUI, setShowUI] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const addViolation = (type: string, message: string, severity: 'low' | 'medium' | 'high') => {
    const violation: ViolationLog = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      severity
    };
    
    setViolations(prev => [violation, ...prev.slice(0, 9)]);
    onViolationDetected(`${type}: ${message}`);
    
    if (severity === 'high') {
      toast.error(`High Risk: ${message}`);
    } else if (severity === 'medium') {
      toast.warning(`Warning: ${message}`);
    }
  };

  // Monitor tab/window switching and prevent leaving
  useEffect(() => {
    if (!isActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches(prev => prev + 1);
        setWindowFocusLost(prev => prev + 1);
        addViolation(
          'Tab Switch', 
          'Student switched away from exam tab', 
          'high'
        );
        
        // Force focus back to window
        setTimeout(() => {
          window.focus();
          if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(console.error);
          }
        }, 100);
      }
    };

    const handleWindowBlur = () => {
      setWindowFocusLost(prev => prev + 1);
      addViolation(
        'Window Focus Lost', 
        'Exam window lost focus', 
        'high'
      );
      
      // Immediately return focus
      setTimeout(() => window.focus(), 50);
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to leave the exam? Your progress will be lost.';
      addViolation(
        'Exit Attempt', 
        'Student attempted to leave exam page', 
        'high'
      );
      return e.returnValue;
    };

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      addViolation(
        'Navigation Attempt', 
        'Student attempted to navigate away from exam', 
        'high'
      );
      // Push the state back to prevent navigation
      window.history.pushState(null, '', window.location.href);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect suspicious key combinations
      if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'a')) {
        setSuspiciousActivity(prev => prev + 1);
        addViolation(
          'Suspicious Keys', 
          `Detected ${e.ctrlKey ? 'Ctrl+' : ''}${e.key.toUpperCase()} key combination`, 
          'low'
        );
      }
      
      // Prevent certain shortcuts
      if (e.ctrlKey && (e.key === 'u' || e.key === 'i' || e.key === 'j')) {
        e.preventDefault();
        addViolation(
          'Blocked Action', 
          'Attempted to access developer tools', 
          'high'
        );
      }
      
      if (e.key === 'F12') {
        e.preventDefault();
        addViolation(
          'Blocked Action', 
          'Attempted to open developer tools with F12', 
          'high'
        );
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      addViolation(
        'Right Click', 
        'Attempted to access context menu', 
        'low'
      );
    };

    // Add browser protection
    window.history.pushState(null, '', window.location.href);
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isActive]);

  // Start camera monitoring
  const startCameraMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240 },
        audio: false
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsMonitoring(true);
      toast.success('Camera monitoring active');
    } catch (error) {
      console.error('Camera access denied:', error);
      addViolation(
        'Camera Access', 
        'Camera access denied or unavailable', 
        'high'
      );
      toast.error('Camera access required for exam monitoring');
    }
  };

  // Stop monitoring
  const stopMonitoring = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsMonitoring(false);
  };

  useEffect(() => {
    if (isActive) {
      startCameraMonitoring();
    } else {
      stopMonitoring();
    }

    return () => stopMonitoring();
  }, [isActive]);

  if (!isActive) return null;

  // Hidden monitoring - only show minimal indicator

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900';
      case 'low': return 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const getOverallStatus = () => {
    const highViolations = violations.filter(v => v.severity === 'high').length;
    const mediumViolations = violations.filter(v => v.severity === 'medium').length;
    
    if (highViolations > 2) return 'high-risk';
    if (highViolations > 0 || mediumViolations > 3) return 'medium-risk';
    return 'low-risk';
  };

  const status = getOverallStatus();

  return (
    <>
      {/* Hidden camera for monitoring */}
      <video
        ref={videoRef}
        autoPlay
        muted
        className="fixed top-0 left-0 w-1 h-1 opacity-0 pointer-events-none z-0"
      />
      
      {/* Minimal monitoring indicator */}
      <div className="fixed top-2 left-2 z-50">
        <div 
          className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border rounded-full px-3 py-1 cursor-pointer hover:bg-background/90 transition-colors"
          onClick={() => setShowUI(!showUI)}
        >
          <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-xs font-medium">Secure Mode</span>
        </div>
      </div>

      {/* Expandable monitoring panel - only shown on click */}
      {showUI && (
        <div className="fixed top-12 left-2 w-72 sm:w-80 z-50">
          <Card className="bg-background/95 backdrop-blur-sm shadow-lg border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  AI Monitoring
                  {isMonitoring ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowUI(false)}
                  className="h-6 w-6 p-0"
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Status Overview */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-semibold text-orange-600">{tabSwitches}</div>
                  <div className="text-muted-foreground">Tab Switches</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-blue-600">{suspiciousActivity}</div>
                  <div className="text-muted-foreground">Suspicious</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-red-600">{windowFocusLost}</div>
                  <div className="text-muted-foreground">Focus Lost</div>
                </div>
              </div>

              {/* Overall Status */}
              <Alert className={`py-2 ${
                status === 'high-risk' ? 'border-destructive bg-destructive/10' :
                status === 'medium-risk' ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20' :
                'border-green-500 bg-green-50 dark:bg-green-950/20'
              }`}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Status: <span className="font-semibold">
                    {status === 'high-risk' ? 'High Risk' :
                     status === 'medium-risk' ? 'Medium Risk' : 'Normal'}
                  </span>
                </AlertDescription>
              </Alert>

              {/* Recent Violations */}
              {violations.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-foreground">Recent Activity:</div>
                  <div className="max-h-24 overflow-y-auto space-y-1">
                    {violations.slice(0, 2).map((violation) => (
                      <div
                        key={violation.id}
                        className={`text-xs p-2 rounded border ${getSeverityColor(violation.severity)}`}
                      >
                        <div className="font-medium">{violation.type}</div>
                        <div className="text-xs opacity-75">
                          {violation.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};