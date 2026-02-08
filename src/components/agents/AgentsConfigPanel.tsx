import React from 'react';
import { useAgentsDefaults } from '../../hooks/useAgents';
import { useProviders } from '../../hooks/useProviders';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';

export function AgentsConfigPanel() {
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
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  const availableModels = getAvailableModels();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Agents 配置</h2>
        <p className="text-sm text-muted-foreground mt-1">
          配置 OpenClaw Agents 的默认行为
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>模型设置</CardTitle>
          <CardDescription>
            选择不同场景下使用的默认模型
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="primary">主模型 (primary)</Label>
            <Select
              id="primary"
              value={formData.primary}
              onChange={(e) => setFormData({ ...formData, primary: e.target.value })}
              required
            >
              <option value="">选择模型...</option>
              {availableModels.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="fast">快速模型 (fast)</Label>
            <Select
              id="fast"
              value={formData.fast}
              onChange={(e) => setFormData({ ...formData, fast: e.target.value })}
            >
              <option value="">不设置</option>
              {availableModels.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="balanced">均衡模型 (balanced)</Label>
            <Select
              id="balanced"
              value={formData.balanced}
              onChange={(e) => setFormData({ ...formData, balanced: e.target.value })}
            >
              <option value="">不设置</option>
              {availableModels.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="powerful">强力模型 (powerful)</Label>
            <Select
              id="powerful"
              value={formData.powerful}
              onChange={(e) => setFormData({ ...formData, powerful: e.target.value })}
            >
              <option value="">不设置</option>
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
          <CardTitle>性能设置</CardTitle>
          <CardDescription>
            配置并发和性能相关参数
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxConcurrent">最大并发数</Label>
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
              <Label htmlFor="subagentMaxConcurrent">子代理最大并发数</Label>
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
          {isSaving ? '保存中...' : '保存配置'}
        </Button>
      </div>
    </div>
  );
}
