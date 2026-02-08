import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { configApi } from '../lib/api';

export function useConfig() {
  const queryClient = useQueryClient();

  const config = useQuery({
    queryKey: ['config'],
    queryFn: configApi.getConfig,
  });

  const saveConfig = useMutation({
    mutationFn: configApi.saveConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] });
    },
  });

  return {
    config: config.data,
    isLoading: config.isLoading,
    error: config.error,
    refetch: config.refetch,
    saveConfig: saveConfig.mutateAsync,
    isSaving: saveConfig.isPending,
  };
}

export function useConfigPath() {
  return useQuery({
    queryKey: ['config-path'],
    queryFn: configApi.getConfigPath,
  });
}

export function useConfigExists() {
  return useQuery({
    queryKey: ['config-exists'],
    queryFn: configApi.configExists,
  });
}

export function useConfigBackup() {
  const queryClient = useQueryClient();

  const backup = useMutation({
    mutationFn: configApi.backupConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] });
    },
  });

  const restore = useMutation({
    mutationFn: configApi.restoreConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] });
    },
  });

  return {
    backup: backup.mutateAsync,
    isBackingUp: backup.isPending,
    restore: restore.mutateAsync,
    isRestoring: restore.isPending,
  };
}
