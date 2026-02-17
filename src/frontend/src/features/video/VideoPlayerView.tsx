import { useState, useRef, useEffect } from 'react';
import type { MediaTrack } from '@/lib/storage/indexedDb';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { X, Play, Pause, Maximize, Minimize, Settings } from 'lucide-react';
import { formatDuration } from '@/lib/media-utils';
import { usePlayerSettings } from '../settings/usePlayerSettings';

interface VideoPlayerViewProps {
  video: MediaTrack;
  onClose: () => void;
}

export function VideoPlayerView({ video, onClose }: VideoPlayerViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const { settings } = usePlayerSettings();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 flex flex-col"
      onMouseMove={() => setShowControls(true)}
    >
      <div className="relative flex-1">
        <video
          ref={videoRef}
          src={video.objectUrl}
          className="w-full h-full object-contain"
          onClick={togglePlay}
        />

        {showControls && (
          <>
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-medium truncate flex-1">{video.title}</h2>
                <Button size="icon" variant="ghost" onClick={onClose} className="text-white">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 space-y-3">
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={0.1}
                onValueChange={handleSeek}
                className="w-full"
              />

              <div className="flex items-center justify-between text-white text-sm">
                <span>{formatDuration(currentTime)}</span>
                <span>{formatDuration(duration)}</span>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={togglePlay}
                  className="text-white"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </Button>

                <div className="flex items-center gap-2">
                  <select
                    value={playbackRate}
                    onChange={(e) => {
                      const rate = parseFloat(e.target.value);
                      setPlaybackRate(rate);
                      if (videoRef.current) {
                        videoRef.current.playbackRate = rate;
                      }
                    }}
                    className="bg-white/10 text-white rounded px-2 py-1 text-sm"
                  >
                    <option value="0.5">0.5x</option>
                    <option value="0.75">0.75x</option>
                    <option value="1">1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                  </select>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={toggleFullscreen}
                    className="text-white"
                  >
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
