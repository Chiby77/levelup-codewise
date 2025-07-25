import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  // Monitor tab/window switching
  useEffect(() => {
    if (!isActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitches(prev => prev + 1);
        setWindowFocusLost(prev => prev + 1);
        addViolation(
          'Tab Switch', 
          'Student switched away from exam tab', 
          'medium'
        );
      }
    };

    const handleWindowBlur = () => {
      setWindowFocusLost(prev => prev + 1);
      addViolation(
        'Window Focus Lost', 
        'Exam window lost focus', 
        'medium'
      );
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

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
    <div className="fixed top-4 right-4 w-80 z-50">
      <Card className="bg-white/95 backdrop-blur-sm shadow-lg border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Eye className="h-4 w-4" />
            AI Invigilation System
            {isMonitoring ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Camera Feed */}
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-24 bg-gray-900 rounded object-cover"
            />
            <div className="absolute top-1 right-1">
              <Badge variant={isMonitoring ? "default" : "destructive"} className="text-xs">
                <Camera className="h-3 w-3 mr-1" />
                {isMonitoring ? 'ACTIVE' : 'OFF'}
              </Badge>
            </div>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-semibold text-orange-600">{tabSwitches}</div>
              <div className="text-gray-600">Tab Switches</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-600">{suspiciousActivity}</div>
              <div className="text-gray-600">Suspicious</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-600">{windowFocusLost}</div>
              <div className="text-gray-600">Focus Lost</div>
            </div>
          </div>

          {/* Overall Status */}
          <Alert className={`py-2 ${
            status === 'high-risk' ? 'border-red-200 bg-red-50' :
            status === 'medium-risk' ? 'border-yellow-200 bg-yellow-50' :
            'border-green-200 bg-green-50'
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
              <div className="text-xs font-semibold text-gray-700">Recent Activity:</div>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {violations.slice(0, 3).map((violation) => (
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
  );
};