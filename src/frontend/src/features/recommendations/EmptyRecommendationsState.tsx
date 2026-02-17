import { Sparkles } from 'lucide-react';

export function EmptyRecommendationsState() {
  return (
    <section className="bg-card rounded-xl border border-border p-8 text-center">
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
        <Sparkles className="w-12 h-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Discover Your Music</h3>
      <p className="text-muted-foreground">
        Start playing and liking tracks to get personalized recommendations
      </p>
    </section>
  );
}
