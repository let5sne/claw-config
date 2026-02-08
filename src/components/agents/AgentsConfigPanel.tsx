import React from 'react';
import { useAgentsDefaults } from '../../hooks/useAgents';
import { useProviders } from '../../hooks/useProviders';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { useTranslation } from 'react-i18next';

export function AgentsConfigPanel() {
  const { t } = useTranslation();
  const { agents, isLoading, saveDefaults, isSaving } = useAgentsDefaults();
  const { providers } = useProviders();

  const [formData, setFormData] = React.useState({
    primary: '',
    fast: '',
    balanced: '',
    powerful: '',
    maxConcurrent: 6,
    subagentMaxConcurrent: 12,
  });

  React.useEffect(() => {
    if (agents) {
      setFormData({
        primary: agents.model?.primary || '',
        fast: agents.model?.fast || '',
        balanced: agents.model?.balanced || '',
        powerful: agents.model?.powerful || '',
        maxConcurrent: agents.maxConcurrent || 6,
        subagentMaxConcurrent: agents.subagents?.maxConcurrent || 12,
      });
    }
  }, [agents]);

  // 获取所有可用的模型选项
  const getAvailableModels = () => {
    if (!providers) return [];

    const models: Array<{ id: string; name: string }> = [];
    Object.entries(providers).forEach(([providerId, provider]) => {
      provider.models.forEach(model => {
        models.push({
          id: `${providerId}/${model.id}`,
          name: `${model.name} (${providerId})`,
        });
      });
    });
    return models;
  };

  const handleSave = async () => {
    await saveDefaults({
      model: {
        primary: formData.primary,
        fast: formData.fast || undefined,
        balanced: formData.balanced || undefined,
        powerful: formData.powerful || undefined,
      },
      models: agents?.models || {},
      maxConcurrent: formData.maxConcurrent,
      subagents: {
        maxConcurrent: formData.subagentMaxConcurrent,
      },
      workspace: agents?.workspace,
      caching: agents?.caching,
      timeout: agents?.timeout,
      retry: agents?.retry,
      compaction: agents?.compaction,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">{t('common.loading')}</div>
      </div>
    );
  }

  const availableModels = getAvailableModels();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t('agents.title')}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t('agents.description')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('agents.modelConfig')}</CardTitle>
          <CardDescription>
            {t('agents.modelConfigDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="primary">{t('agents.primaryModel')}</Label>
            <Select
              id="primary"
              value={formData.primary}
              onChange={(e) => setFormData({ ...formData, primary: e.target.value })}
              required
            >
              <option value="">{t('agents.selectModel')}</option>
              {availableModels.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="fast">{t('agents.fastModel')}</Label>
            <Select
              id="fast"
              value={formData.fast}
              onChange={(e) => setFormData({ ...formData, fast: e.target.value })}
            >
              <option value="">{t('agents.notSet')}</option>
              {availableModels.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="balanced">{t('agents.balancedModel')}</Label>
            <Select
              id="balanced"
              value={formData.balanced}
              onChange={(e) => setFormData({ ...formData, balanced: e.target.value })}
            >
              <option value="">{t('agents.notSet')}</option>
              {availableModels.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="powerful">{t('agents.powerfulModel')}</Label>
            <Select
              id="powerful"
              value={formData.powerful}
              onChange={(e) => setFormData({ ...formData, powerful: e.target.value })}
            >
              <option value="">{t('agents.notSet')}</option>
              {availableModels.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('agents.performanceSettings')}</CardTitle>
          <CardDescription>
            {t('agents.performanceSettingsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxConcurrent">{t('agents.maxConcurrent')}</Label>
              <Input
                id="maxConcurrent"
                type="number"
                min="1"
                max="20"
                value={formData.maxConcurrent}
                onChange={(e) => setFormData({ ...formData, maxConcurrent: parseInt(e.target.value) || 6 })}
              />
            </div>

            <div>
              <Label htmlFor="subagentMaxConcurrent">{t('agents.subagentMaxConcurrent')}</Label>
              <Input
                id="subagentMaxConcurrent"
                type="number"
                min="1"
                max="50"
                value={formData.subagentMaxConcurrent}
                onChange={(e) => setFormData({ ...formData, subagentMaxConcurrent: parseInt(e.target.value) || 12 })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? t('agents.saveInProgress') : t('agents.saveConfiguration')}
        </Button>
      </div>
    </div>
  );
}
