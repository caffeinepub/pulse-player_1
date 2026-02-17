import { useSleepTimer, type SleepDuration } from './useSleepTimer';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Timer, X } from 'lucide-react';
import { useState } from 'react';

export function SleepTimerControl() {
  const { isActive, remainingSeconds, start, cancel } = useSleepTimer();
  const [selectedDuration, setSelectedDuration] = useState<SleepDuration>(15);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isActive) {
    return (
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Sleep Timer Active</p>
            <p className="text-2xl font-bold text-primary mt-1">
              {formatTime(remainingSeconds)}
            </p>
          </div>
          <Button size="icon" variant="ghost" onClick={cancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Timer className="w-5 h-5 text-muted-foreground" />
        <p className="font-medium">Set Sleep Timer</p>
      </div>
      
      <div className="flex gap-2">
        <Select
          value={selectedDuration.toString()}
          onValueChange={(v) => setSelectedDuration(parseInt(v) as SleepDuration)}
        >
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 minutes</SelectItem>
            <SelectItem value="10">10 minutes</SelectItem>
            <SelectItem value="15">15 minutes</SelectItem>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="60">60 minutes</SelectItem>
          </SelectContent>
        </Select>
        
        <Button onClick={() => start(selectedDuration)}>
          Start
        </Button>
      </div>
    </div>
  );
}
