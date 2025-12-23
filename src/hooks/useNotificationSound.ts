import { useCallback, useRef, useEffect, useState } from 'react';

const NOTIFICATION_SOUND_KEY = 'admin_notification_sound_enabled';

export const useNotificationSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const stored = localStorage.getItem(NOTIFICATION_SOUND_KEY);
    return stored === null ? true : stored === 'true';
  });

  useEffect(() => {
    // Create audio element with a simple notification sound
    // Using a base64 encoded short beep sound
    const audioData = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleP+IfYfxmqF4Sz9Xj7fj2KVWHAc7mNjVmXE4HT6b4ueVYRYHPJLX2ZNnLBlBnuPimGMXCjqP1daQYysaQ6Dm4pljFws4jdPTjmEqG0Wj6OKYYhcLOIzR0Y1fKRtFpOjhmGIXCziL0M+MXigbRaTn4JdiFws4is7NimApG0Wk5t+XYRcLOInNy4lfKBtFpObel2EXCziJzMqIXigbRaTl3ZZhFws4iMvJh14oG0Wk5NyWYRcLOIjKyIddKBtFpOPblmEXCziHycaGXSgbRaTi2pVgFws4h8jFhVwoG0Wk4dmVYBcLOIbHxIRcKBtFpODYlGAXCziFxsODXCgbRaPf15RgFws4hcXCglsoG0Wj3taUYBcLOITEwIFbKBtFo93VlGAXCziDw7+AWygbRaPc1JNfFws4g8K+f1soG0Wj29OTXxcLOILBvX5aKBtFotrSk18XCziBwLx9WigbRaLZ0ZJfFws4gL+7fFooG0Wi2NCSXxcLN3++unxaKBtFotfPkl8XCzd+vbl7WigbRaHWzpFeFws3fbq4elooG0Wh1c2RXhcLN3y5t3laKBtFodTMkF4XCzd7uLZ4WSgbRaHTy5BeFws3e7e1d1koG0Wg0sqPXhcLN3q2tHdZKBtFoNHJj14XCzd5tbN2WSgbRaDQyI5eFws3eLSydVkoG0Wfz8eOXhcLN3ezsXVYKBtFn87GjV4XCzd2sq90WCgbRZ7NxY1eFws3dbGuc1goG0WdzMSMXRcLN3SwrXJYKBtFnMvDjF0XCzdzsKxxWCgbRZzKwotdFws3cq+rcVgoG0WbyMGLXRcLN3GurHBYKBtFmsfAilwXCzdwraywa1goG0WZx7+KXBcLN2+srmxrKBtFmca+iVwXCzdvq65sa1goG0WZxr2JXBcLN26qrWtrKBtFmMW8iFwXCzdtqq1rayghRZjEu4hcFws3bKmsamsoIUWXw7qHWxcLN2uoq2lqKCFFl8K5h1sXCzdrqKtpaiggRZfBuIZbFws3aqeqaGooIEWWwLeGWhcLN2mnqWhqJyBFlr+2hVoXCzdpp6loaicgRZW+tYVaFws3aKaoZ2knIEWVvbSEWhcLN2elp2dpJyBFlLyzhFkXCzdmpqdmaCcfRZS7soNZFws3ZqWmZmgnH0WTurGDWRcLN2WkpWVnJx9Fk7mwglkXCzdlo6RlZycfRJK4r4JYFws3ZKOkZGYnH0SSt66BWBcLN2OiomRmJh9EkbatgVgXCzdjYmFjYmYmH0SRtq2BWBYLAA==';
    
    audioRef.current = new Audio(audioData);
    audioRef.current.volume = 0.5;
  }, []);

  const playSound = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
    }
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem(NOTIFICATION_SOUND_KEY, String(newValue));
      return newValue;
    });
  }, []);

  return { playSound, soundEnabled, toggleSound };
};
