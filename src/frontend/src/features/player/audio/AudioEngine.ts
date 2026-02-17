interface AudioEngineCallbacks {
  onTimeUpdate: (time: number) => void;
  onDurationChange: (duration: number) => void;
  onEnded: () => void;
  onPlay: () => void;
  onPause: () => void;
}

export class AudioEngine {
  private audio: HTMLAudioElement;
  private callbacks: AudioEngineCallbacks;

  constructor(callbacks: AudioEngineCallbacks) {
    this.callbacks = callbacks;
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    
    this.audio.addEventListener('timeupdate', this.handleTimeUpdate);
    this.audio.addEventListener('durationchange', this.handleDurationChange);
    this.audio.addEventListener('ended', this.handleEnded);
    this.audio.addEventListener('play', this.handlePlay);
    this.audio.addEventListener('pause', this.handlePause);
  }

  private handleTimeUpdate = () => {
    this.callbacks.onTimeUpdate(this.audio.currentTime);
  };

  private handleDurationChange = () => {
    this.callbacks.onDurationChange(this.audio.duration);
  };

  private handleEnded = () => {
    this.callbacks.onEnded();
  };

  private handlePlay = () => {
    this.callbacks.onPlay();
  };

  private handlePause = () => {
    this.callbacks.onPause();
  };

  load(url: string) {
    this.audio.src = url;
    this.audio.load();
  }

  play() {
    this.audio.play().catch(error => {
      console.error('Playback failed:', error);
    });
  }

  pause() {
    this.audio.pause();
  }

  seek(time: number) {
    this.audio.currentTime = time;
  }

  setVolume(volume: number) {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  cleanup() {
    this.audio.removeEventListener('timeupdate', this.handleTimeUpdate);
    this.audio.removeEventListener('durationchange', this.handleDurationChange);
    this.audio.removeEventListener('ended', this.handleEnded);
    this.audio.removeEventListener('play', this.handlePlay);
    this.audio.removeEventListener('pause', this.handlePause);
    this.audio.pause();
    this.audio.src = '';
  }
}
