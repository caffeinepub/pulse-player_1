import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useOfflineOnlyMode } from '@/app/offline/useOfflineOnlyMode';
import type { UserProfile, CloudData } from '@/backend';

export function useGetCallerUserProfile() {
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

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useExportCloudData() {
  const { actor, isFetching: actorFetching } = useActor();
  const { offlineOnly } = useOfflineOnlyMode();

  return useQuery<CloudData | null>({
    queryKey: ['exportCloudData'],
    queryFn: async () => {
      if (!actor || offlineOnly) return null;
      try {
        return await actor.exportCloudData();
      } catch (error) {
        console.error('Cloud export error:', error);
        return null;
      }
    },
    enabled: false,
    retry: false,
  });
}
