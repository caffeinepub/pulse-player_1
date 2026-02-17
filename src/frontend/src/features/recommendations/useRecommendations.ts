import { useMemo } from 'react';
import { useLibrary } from '../library/useLibrary';
import { useFavorites } from '../favorites/useFavorites';
import { useHistory } from '../history/useHistory';
import { generateRecommendations } from './recommendationLogic';

export function useRecommendations() {
  const { audioTracks } = useLibrary();
  const { favorites } = useFavorites();
  const { recentlyPlayed } = useHistory();

  const recommendations = useMemo(() => {
    return generateRecommendations(audioTracks, favorites, recentlyPlayed);
  }, [audioTracks, favorites, recentlyPlayed]);

  return {
    recommendations,
    hasActivity: favorites.length > 0 || recentlyPlayed.length > 0,
  };
}
