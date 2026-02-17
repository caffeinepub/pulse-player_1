import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from 'react';
import type { MediaTrack } from '@/lib/storage/indexedDb';
import { AudioEngine } from './audio/AudioEngine';
import { useHistory } from '../history/useHistory';

type RepeatMode = 'off' | 'one' | 'all';

interface PlayerContextValue {
  currentTrack: MediaTrack | null;
  queue: MediaTrack[];
  queueIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  isFullPlayerOpen: boolean;
  play: (track: MediaTrack, queue?: MediaTrack[]) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  openFullPlayer: () => void;
  closeFullPlayer: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<MediaTrack | null>(null);
  const [queue, setQueue] = useState<MediaTrack[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  
  const audioEngineRef = useRef<AudioEngine | null>(null);
  const { addToHistory } = useHistory();

  useEffect(() => {
    audioEngineRef.current = new AudioEngine({
      onTimeUpdate: setCurrentTime,
      onDurationChange: setDuration,
      onEnded: handleTrackEnded,
      onPlay: () => setIsPlaying(true),
      onPause: () => setIsPlaying(false),
    });

    return () => {
      audioEngineRef.current?.cleanup();
    };
  }, []);

  function handleTrackEnded() {
    if (repeatMode === 'one') {
      audioEngineRef.current?.seek(0);
      audioEngineRef.current?.play();
    } else {
      next();
    }
  }

  function play(track: MediaTrack, newQueue?: MediaTrack[]) {
    if (newQueue) {
      setQueue(newQueue);
      const index = newQueue.findIndex(t => t.id === track.id);
      setQueueIndex(index >= 0 ? index : 0);
    }
    
    setCurrentTrack(track);
    audioEngineRef.current?.load(track.objectUrl || '');
    audioEngineRef.current?.play();
    addToHistory(track.id);
  }

  function pause() {
    audioEngineRef.current?.pause();
  }

  function resume() {
    audioEngineRef.current?.play();
  }

  function next() {
    if (queue.length === 0) return;
    
    let nextIndex = queueIndex + 1;
    
    if (nextIndex >= queue.length) {
      if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        pause();
        return;
      }
    }
    
    setQueueIndex(nextIndex);
    play(queue[nextIndex], queue);
  }

  function previous() {
    if (queue.length === 0) return;
    
    if (currentTime > 3) {
      seek(0);
      return;
    }
    
    let prevIndex = queueIndex - 1;
    if (prevIndex < 0) {
      prevIndex = repeatMode === 'all' ? queue.length - 1 : 0;
    }
    
    setQueueIndex(prevIndex);
    play(queue[prevIndex], queue);
  }

  function seek(time: number) {
    audioEngineRef.current?.seek(time);
  }

  function setVolume(vol: number) {
    setVolumeState(vol);
    audioEngineRef.current?.setVolume(vol);
  }

  function toggleShuffle() {
    setIsShuffle(!isShuffle);
  }

  function toggleRepeat() {
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  }

  const value: PlayerContextValue = {
    currentTrack,
    queue,
    queueIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isShuffle,
    repeatMode,
    isFullPlayerOpen,
    play,
    pause,
    resume,
    next,
    previous,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    openFullPlayer: () => setIsFullPlayerOpen(true),
    closeFullPlayer: () => setIsFullPlayerOpen(false),
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
