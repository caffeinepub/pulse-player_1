import { usePlayer } from './PlayerProvider';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Volume2, X } from 'lucide-react';
import { formatDuration } from '@/lib/media-utils';
import { cn } from '@/lib/utils';

export function FullPlayerSheet() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isShuffle,
    repeatMode,
    isFullPlayerOpen,
    pause,
    resume,
    next,
    previous,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    closeFullPlayer,
  } = usePlayer();

  if (!currentTrack) return null;

  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat;

  return (
    <Sheet open={isFullPlayerOpen} onOpenChange={(open) => !open && closeFullPlayer()}>
      <SheetContent side="bottom" className="h-[90vh] p-0">
        <div className="h-full flex flex-col p-6">
          <div className="flex justify-end mb-4">
            <Button size="icon" variant="ghost" onClick={closeFullPlayer}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="w-64 h-64 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center mb-8">
              <span className="text-8xl">🎵</span>
            </div>

            <h2 className="text-2xl font-bold text-center mb-2">{currentTrack.title}</h2>
            <p className="text-lg text-muted-foreground mb-8">{currentTrack.artist}</p>

            <div className="w-full space-y-2 mb-8">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={([value]) => seek(value)}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatDuration(currentTime)}</span>
                <span>{formatDuration(duration)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-8">
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleShuffle}
                className={cn(isShuffle && 'text-primary')}
              >
                <Shuffle className="w-5 h-5" />
              </Button>
              
              <Button size="icon" variant="ghost" onClick={previous}>
                <SkipBack className="w-6 h-6" />
              </Button>
              
              <Button
                size="icon"
                className="w-16 h-16"
                onClick={isPlaying ? pause : resume}
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </Button>
              
              <Button size="icon" variant="ghost" onClick={next}>
                <SkipForward className="w-6 h-6" />
              </Button>
              
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleRepeat}
                className={cn(repeatMode !== 'off' && 'text-primary')}
              >
                <RepeatIcon className="w-5 h-5" />
              </Button>
            </div>

            <div className="w-full flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-muted-foreground" />
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={([value]) => setVolume(value / 100)}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
