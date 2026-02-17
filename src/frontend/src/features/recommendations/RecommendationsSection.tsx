import { useRecommendations } from './useRecommendations';
import { TrackList } from '../tracks/TrackList';
import { EmptyRecommendationsState } from './EmptyRecommendationsState';
import { Sparkles } from 'lucide-react';

export function RecommendationsSection() {
  const { recommendations, hasActivity } = useRecommendations();

  if (!hasActivity) {
    return <EmptyRecommendationsState />;
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5" />
        Recommended for You
      </h2>
      <TrackList tracks={recommendations} context="recommendations" />
    </section>
  );
}
