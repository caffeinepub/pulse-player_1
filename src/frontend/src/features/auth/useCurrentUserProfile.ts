import { useQuery } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';
import { useOfflineOnlyMode } from '@/app/offline/useOfflineOnlyMode';
import type { UserProfile } from '@/backend';

export function useCurrentUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { offlineOnly } = useOfflineOnlyMode();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !offlineOnly,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}
