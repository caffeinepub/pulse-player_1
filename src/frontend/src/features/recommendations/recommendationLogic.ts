import type { MediaTrack } from '@/lib/storage/indexedDb';

export function generateRecommendations(
  allTracks: MediaTrack[],
  favorites: string[],
  history: string[]
): MediaTrack[] {
  if (allTracks.length === 0) return [];
  
  const scores = new Map<string, number>();
  
  allTracks.forEach(track => {
    let score = 0;
    
    if (favorites.includes(track.id)) {
      score += 10;
    }
    
    const historyIndex = history.indexOf(track.id);
    if (historyIndex >= 0) {
      score += Math.max(5 - historyIndex * 0.1, 0);
    }
    
    const favoriteArtists = allTracks
      .filter(t => favorites.includes(t.id))
      .map(t => t.artist);
    
    if (favoriteArtists.includes(track.artist) && !favorites.includes(track.id)) {
      score += 3;
    }
    
    scores.set(track.id, score);
  });
  
  return allTracks
    .filter(track => !favorites.includes(track.id))
    .sort((a, b) => (scores.get(b.id) || 0) - (scores.get(a.id) || 0))
    .slice(0, 10);
}
