import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agentsApi } from '../lib/api';

export function useAgentsDefaults() {
  const queryClient = useQueryClient();

  const agents = useQuery({
    queryKey: ['agents-defaults'],
    queryFn: agentsApi.getAgentsDefaults,
  });

  const saveDefaults = useMutation({
    mutationFn: agentsApi.saveAgentsDefaults,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents-defaults'] });
      queryClient.invalidateQueries({ queryKey: ['config'] });
    },
  });

  return {
    agents: agents.data,
    isLoading: agents.isLoading,
    error: agents.error,
    refetch: agents.refetch,
    saveDefaults: saveDefaults.mutateAsync,
    isSaving: saveDefaults.isPending,
  };
}
