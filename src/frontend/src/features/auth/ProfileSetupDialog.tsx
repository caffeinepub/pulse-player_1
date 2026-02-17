import { useState } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useCurrentUserProfile } from './useCurrentUserProfile';
import { useActor } from '@/hooks/useActor';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function ProfileSetupDialog() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useCurrentUserProfile();
  const { actor } = useActor();
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleSave = async () => {
    if (!name.trim() || !actor) return;

    setIsSaving(true);
    try {
      await actor.saveCallerUserProfile({ name: name.trim(), email: undefined });
      toast.success('Profile created successfully');
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to create profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={showProfileSetup} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Welcome to Pulse Player</DialogTitle>
          <DialogDescription>
            Please tell us your name to get started
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          </div>
          <Button onClick={handleSave} disabled={!name.trim() || isSaving} className="w-full">
            {isSaving ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
