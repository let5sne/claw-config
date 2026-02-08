import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { providerApi, configUtils } from '../lib/api';
import type { Provider } from '../types';

export function useProviders() {
  const queryClient = useQueryClient();

  const providers = useQuery({
    queryKey: ['providers'],
    queryFn: async () => {
      console.log('Fetching providers...');
      try {
        const result = await providerApi.getProviders();
        console.log('Providers fetched:', result);
        return result;
      } catch (error) {
        console.error('Error fetching providers:', error);
        throw error;
      }
    },
    retry: 3,
    staleTime: 1000 * 60 * 5,
  });

  const addProvider = useMutation({
    mutationFn: ({ id, provider }: { id: string; provider: Provider }) =>
      providerApi.addProvider(id, provider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: ['config'] });
    },
  });

  const updateProvider = useMutation({
    mutationFn: ({ id, provider }: { id: string; provider: Provider }) =>
      providerApi.updateProvider(id, provider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: ['config'] });
    },
  });

  const deleteProvider = useMutation({
    mutationFn: (id: string) => providerApi.deleteProvider(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: ['config'] });
    },
  });

  // 获取所有可用的模型
  const availableModels = useQuery({
    queryKey: ['available-models'],
    queryFn: async () => {
      const providersData = providers.data || {};
      return configUtils.getAllAvailableModels(providersData);
    },
    enabled: !!providers.data,
  });

  return {
    providers: providers.data,
    isLoading: providers.isLoading,
    error: providers.error,
    refetch: providers.refetch,
    addProvider: addProvider.mutateAsync,
    isAdding: addProvider.isPending,
    updateProvider: updateProvider.mutateAsync,
    isUpdating: updateProvider.isPending,
    deleteProvider: deleteProvider.mutateAsync,
    isDeleting: deleteProvider.isPending,
    availableModels: availableModels.data,
  };
}
