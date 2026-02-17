import { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { AppShell } from './app/layout/AppShell';
import { PlayerProvider } from './features/player/PlayerProvider';

export default function App() {
  useEffect(() => {
    // Register service worker for PWA offline support
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('New version available. Will activate on next session.');
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <PlayerProvider>
        <AppShell />
        <Toaster />
      </PlayerProvider>
    </ThemeProvider>
  );
}
