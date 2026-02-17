import { useState } from 'react';
import { usePlaylists } from './usePlaylists';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Music } from 'lucide-react';
import { PlaylistDetail } from './PlaylistDetail';

export function PlaylistsPanel() {
  const { playlists, createPlaylist } = usePlaylists();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

  const handleCreate = async () => {
    if (newPlaylistName.trim()) {
      await createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setIsCreateOpen(false);
    }
  };

  if (selectedPlaylistId) {
    const playlist = playlists.find(p => p.id === selectedPlaylistId);
    if (playlist) {
      return <PlaylistDetail playlist={playlist} onBack={() => setSelectedPlaylistId(null)} />;
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              New Playlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Playlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="playlist-name">Playlist Name</Label>
                <Input
                  id="playlist-name"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="My Awesome Playlist"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                />
              </div>
              <Button onClick={handleCreate} className="w-full">
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {playlists.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Music className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No playlists yet</p>
          <p className="text-sm mt-1">Create your first playlist to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {playlists.map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => setSelectedPlaylistId(playlist.id)}
              className="p-4 bg-card rounded-xl border border-border hover:bg-accent transition-colors text-left"
            >
              <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-3 flex items-center justify-center">
                <Music className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium truncate">{playlist.name}</h3>
              <p className="text-sm text-muted-foreground">
                {playlist.trackIds.length} track{playlist.trackIds.length !== 1 ? 's' : ''}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
