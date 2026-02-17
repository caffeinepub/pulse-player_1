import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { AppShell } from './app/layout/AppShell';
import { PlayerProvider } from './features/player/PlayerProvider';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <PlayerProvider>
        <AppShell />
        <Toaster />
      </PlayerProvider>
    </ThemeProvider>
  );
}
