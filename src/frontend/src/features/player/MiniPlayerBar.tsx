import { usePlayer } from './PlayerProvider';
import { Play, Pause, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MiniPlayerBar() {
  const { currentTrack, isPlaying, pause, resume, next, openFullPlayer } = usePlayer();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-16 left-0 right-0 bg-card border-t border-border safe-bottom z-30">
      <button
        onClick={openFullPlayer}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-accent transition-colors"
      >
        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
          <span className="text-2xl">🎵</span>
        </div>
        
        <div className="flex-1 min-w-0 text-left">
          <p className="font-medium truncate">{currentTrack.title}</p>
          <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
        </div>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              if (isPlaying) {
                pause();
              } else {
                resume();
              }
            }}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          >
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>
      </button>
    </div>
  );
}
