import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

// Build timestamp - gets updated on each deployment
const BUILD_VERSION = Date.now().toString();
const VERSION_CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes
const VERSION_STORAGE_KEY = 'app_build_version';

export function useVersionCheck() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const checkForUpdates = useCallback(async () => {
    try {
      // Fetch the main page with cache-busting query param
      const response = await fetch(`/?_v=${Date.now()}`, {
        method: 'HEAD',
        cache: 'no-store',
      });
      
      // Check the ETag or Last-Modified header as version indicator
      const etag = response.headers.get('etag');
      const lastModified = response.headers.get('last-modified');
      const currentVersion = etag || lastModified || '';
      
      const storedVersion = localStorage.getItem(VERSION_STORAGE_KEY);
      
      if (storedVersion && currentVersion && storedVersion !== currentVersion) {
        setUpdateAvailable(true);
        return true;
      }
      
      if (currentVersion) {
        localStorage.setItem(VERSION_STORAGE_KEY, currentVersion);
      }
      
      return false;
    } catch (error) {
      console.log('[VersionCheck] Could not check for updates:', error);
      return false;
    }
  }, []);

  const refreshApp = useCallback(() => {
    // Clear all caches and reload
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
    
    // Unregister service workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister();
        });
      });
    }
    
    // Clear version storage and force reload
    localStorage.removeItem(VERSION_STORAGE_KEY);
    window.location.reload();
  }, []);

  useEffect(() => {
    // Initial check after a short delay
    const initialCheck = setTimeout(() => {
      checkForUpdates();
    }, 3000);

    // Periodic checks
    const interval = setInterval(() => {
      checkForUpdates();
    }, VERSION_CHECK_INTERVAL);

    // Check when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdates();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(initialCheck);
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkForUpdates]);

  // Show toast when update is available
  useEffect(() => {
    if (updateAvailable) {
      toast('New version available!', {
        description: 'Click to refresh and get the latest updates.',
        duration: Infinity,
        action: {
          label: 'Refresh Now',
          onClick: refreshApp,
        },
      });
    }
  }, [updateAvailable, refreshApp]);

  return { updateAvailable, refreshApp, checkForUpdates };
}
