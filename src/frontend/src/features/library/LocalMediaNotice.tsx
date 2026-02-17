import { Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function LocalMediaNotice() {
  return (
    <Alert className="mb-4">
      <Info className="h-4 w-4" />
      <AlertDescription>
        Your media files are stored locally on your device and are not uploaded to the cloud.
        Works offline once indexed.
      </AlertDescription>
    </Alert>
  );
}
