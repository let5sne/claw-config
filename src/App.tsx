import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api/core';
import './index.css';

// 在组件外部创建 QueryClient 实例，避免每次渲染都创建新实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

interface Provider {
  baseUrl: string;
  apiKey?: string;
  api: string;
  models: Array<{
    id: string;
    name: string;
    reasoning: boolean;
    input: string[];
    cost: { input: number; output: number; cacheRead?: number; cacheWrite?: number };
    contextWindow: number;
    maxTokens: number;
    tier?: string;
  }>;
}

interface AgentsDefaults {
  model?: {
    primary: string;
    fast?: string;
    balanced?: string;
    powerful?: string;
  };
  models: Record<string, { alias: string; description?: string }>;
  workspace?: string;
  maxConcurrent?: number;
  subagents?: { maxConcurrent: number };
  caching?: { enabled: boolean; maxCacheSize: string };
  timeout?: { request: number; idle: number };
  retry?: { maxAttempts: number; backoff: string };
  compaction?: { mode: string; threshold?: number };
}

function App() {
  const [activeTab, setActiveTab] = useState<'providers' | 'agents'>('providers');
  const [providers, setProviders] = React.useState<Record<string, Provider>>({});
  const [agentsDefaults, setAgentsDefaults] = React.useState<AgentsDefaults | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [editingProvider, setEditingProvider] = React.useState<{ id: string; provider: Provider } | null>(null);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingAgents, setEditingAgents] = React.useState(false);

  const loadData = async () => {
    console.log('[App] 开始加载数据...');
    try {
      const [providersResult, agentsResult] = await Promise.all([
        invoke('get_providers'),
        invoke('get_agents_defaults')
      ]);
      console.log('[App] Providers 加载成功:', providersResult);
      console.log('[App] Agents Defaults 加载成功:', agentsResult);
      setProviders(providersResult as Record<string, Provider>);
      setAgentsDefaults(agentsResult as AgentsDefaults | null);
      setLoading(false);
    } catch (err) {
      console.error('[App] 加载数据失败:', err);
      setError(String(err));
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleDeleteProvider = async (id: string) => {
    console.log(`[App] 尝试删除 Provider: ${id}`);
    if (!confirm(`确定删除 Provider "${id}" 吗？`)) return;

    try {
      await invoke('delete_provider', { id });
      console.log(`[App] Provider ${id} 删除成功`);
      await loadData();
    } catch (err) {
      console.error(`[App] 删除 Provider ${id} 失败:`, err);
      alert(`删除失败: ${err}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-500 mb-4">加载失败: {error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          重试
        </button>
      </div>
    );
  }

  const providerEntries = Object.entries(providers);
  const modelsList = agentsDefaults?.model ? [
    { key: 'primary', label: '主模型', value: agentsDefaults.model.primary },
    { key: 'fast', label: '快速', value: agentsDefaults.model.fast || '-' },
    { key: 'balanced', label: '平衡', value: agentsDefaults.model.balanced || '-' },
    { key: 'powerful', label: '强力', value: agentsDefaults.model.powerful || '-' },
  ] : [];

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              OpenClaw Switch
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              OpenClaw 配置管理工具
            </p>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Tab 切换 */}
          <div className="flex gap-4 border-b mb-6">
            <button
              onClick={() => setActiveTab('providers')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'providers'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Providers ({providerEntries.length})
            </button>
            <button
              onClick={() => setActiveTab('agents')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'agents'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Agents 配置
            </button>
          </div>

          {/* Providers Tab */}
          {activeTab === 'providers' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Providers</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    管理你的模型提供商配置
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  添加 Provider
                </button>
              </div>

              {providerEntries.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-card">
                  <p className="text-muted-foreground mb-4">还没有配置任何 Provider</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    添加第一个 Provider
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {providerEntries.map(([id, provider]) => (
                    <div key={id} className="border rounded-lg p-4 bg-card">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold capitalize">{id}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{provider.baseUrl}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            API: {provider.api} | API Key: {provider.apiKey ? '已配置' : '无'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingProvider({ id, provider })}
                            className="px-3 py-1 text-sm border rounded-md hover:bg-accent"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDeleteProvider(id)}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">模型列表 ({provider.models?.length || 0})</p>
                        <div className="flex flex-wrap gap-2">
                          {provider.models?.map((model) => (
                            <span
                              key={model.id}
                              className="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-md border bg-secondary text-secondary-foreground"
                              title={`Tier: ${model.tier || 'N/A'} | Context: ${model.contextWindow} | Max: ${model.maxTokens}`}
                            >
                              {model.name}
                            </span>
                          )) || <span className="text-sm text-muted-foreground">无模型</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Agents Tab */}
          {activeTab === 'agents' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Agents 默认配置</h2>
                <button
                  onClick={() => setEditingAgents(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  编辑配置
                </button>
              </div>

              <div className="border rounded-lg p-4 bg-card space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">模型配置</h3>
                  <div className="space-y-2">
                    {modelsList.map((item) => (
                      <div key={item.key} className="flex items-center justify-between py-2 border-b last:border-0">
                        <span className="text-sm font-medium">{item.label}:</span>
                        <span className="text-sm text-muted-foreground font-mono">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">性能设置</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">最大并发:</span>
                      <span className="ml-2 font-mono">{agentsDefaults?.maxConcurrent || '-'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">子代理并发:</span>
                      <span className="ml-2 font-mono">{agentsDefaults?.subagents?.maxConcurrent || '-'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">缓存:</span>
                      <span className="ml-2">{agentsDefaults?.caching?.enabled ? '启用' : '禁用'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">缓存大小:</span>
                      <span className="ml-2">{agentsDefaults?.caching?.maxCacheSize || '-'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">高级设置</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">请求超时:</span>
                      <span className="ml-2">{agentsDefaults?.timeout?.request || '-'} ms</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">空闲超时:</span>
                      <span className="ml-2">{agentsDefaults?.timeout?.idle || '-'} ms</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">最大重试:</span>
                      <span className="ml-2">{agentsDefaults?.retry?.maxAttempts || '-'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">工作空间:</span>
                      <span className="ml-2 font-mono text-xs">{agentsDefaults?.workspace || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 编辑 Provider Modal */}
      {editingProvider && (
        <EditModal
          id={editingProvider.id}
          provider={editingProvider.provider}
          onClose={() => setEditingProvider(null)}
          onSave={async (id, provider) => {
            console.log(`[App] 尝试更新 Provider: ${id}`, provider);
            try {
              await invoke('update_provider', { id, provider });
              console.log(`[App] Provider ${id} 更新成功`);
              await loadData();
              setEditingProvider(null);
            } catch (err) {
              console.error(`[App] 更新 Provider ${id} 失败:`, err);
              alert(`更新失败: ${err}`);
            }
          }}
        />
      )}

      {/* 添加 Provider Modal */}
      {showAddModal && (
        <AddModal
          onClose={() => setShowAddModal(false)}
          onSave={async (id, provider) => {
            console.log(`[App] 尝试添加 Provider: ${id}`, provider);
            try {
              await invoke('add_provider', { id, provider });
              console.log(`[App] Provider ${id} 添加成功`);
              await loadData();
              setShowAddModal(false);
            } catch (err) {
              console.error(`[App] 添加 Provider ${id} 失败:`, err);
              alert(`添加失败: ${err}`);
            }
          }}
        />
      )}

      {/* 编辑 Agents 配置 Modal */}
      {editingAgents && (
        <AgentsEditModal
          agentsDefaults={agentsDefaults}
          providers={providers}
          onClose={() => setEditingAgents(false)}
          onSave={async (defaults) => {
            console.log('[App] 尝试保存 Agents 配置:', defaults);
            try {
              await invoke('save_agents_defaults', { defaults });
              console.log('[App] Agents 配置保存成功');
              await loadData();
              setEditingAgents(false);
            } catch (err) {
              console.error('[App] 保存 Agents 配置失败:', err);
              alert(`保存失败: ${err}`);
            }
          }}
        />
      )}
    </QueryClientProvider>
  );
}

function EditModal({ id, provider, onClose, onSave }: {
  id: string;
  provider: Provider;
  onClose: () => void;
  onSave: (id: string, provider: Provider) => Promise<void>;
}) {
  const [formData, setFormData] = React.useState({
    baseUrl: provider.baseUrl,
    apiKey: provider.apiKey || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(id, {
      ...provider,
      baseUrl: formData.baseUrl,
      apiKey: formData.apiKey || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-background rounded-lg shadow-lg border w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">编辑 Provider: {id}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Base URL</label>
            <input
              type="text"
              value={formData.baseUrl}
              onChange={e => setFormData({ ...formData, baseUrl: e.target.value })}
              className="w-full px-3 py-2 border rounded-md bg-background"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">API Key (可选)</label>
            <input
              type="password"
              value={formData.apiKey}
              onChange={e => setFormData({ ...formData, apiKey: e.target.value })}
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="留空则不使用 API Key"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-accent"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AddModal({ onClose, onSave }: {
  onClose: () => void;
  onSave: (id: string, provider: Provider) => Promise<void>;
}) {
  const [formData, setFormData] = React.useState({
    id: '',
    baseUrl: '',
    apiKey: '',
    api: 'openai',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.id.trim()) {
        alert('请输入 Provider ID');
        return;
      }
      await onSave(formData.id, {
        baseUrl: formData.baseUrl,
        apiKey: formData.apiKey || undefined,
        api: formData.api,
        models: [],
      });
      setFormData({ id: '', baseUrl: '', apiKey: '', api: 'openai' });
    } catch (error) {
      console.error('添加 Provider 失败:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-background rounded-lg shadow-lg border w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">添加新 Provider</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Provider ID</label>
            <input
              type="text"
              value={formData.id}
              onChange={e => setFormData({ ...formData, id: e.target.value })}
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="例如: openai, anthropic"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Base URL</label>
            <input
              type="text"
              value={formData.baseUrl}
              onChange={e => setFormData({ ...formData, baseUrl: e.target.value })}
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="https://api.example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">API Key (可选)</label>
            <input
              type="password"
              value={formData.apiKey}
              onChange={e => setFormData({ ...formData, apiKey: e.target.value })}
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="留空则不使用 API Key"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">API 类型</label>
            <select
              value={formData.api}
              onChange={e => setFormData({ ...formData, api: e.target.value })}
              className="w-full px-3 py-2 border rounded-md bg-background"
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="openrouter">OpenRouter</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-accent"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              添加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AgentsEditModal({ agentsDefaults, providers, onClose, onSave }: {
  agentsDefaults: AgentsDefaults | null;
  providers: Record<string, Provider>;
  onClose: () => void;
  onSave: (defaults: AgentsDefaults) => Promise<void>;
}) {
  // 获取所有可用的模型选项
  const getAvailableModels = () => {
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

  const availableModels = getAvailableModels();

  const [formData, setFormData] = React.useState({
    primary: agentsDefaults?.model?.primary || '',
    fast: agentsDefaults?.model?.fast || '',
    balanced: agentsDefaults?.model?.balanced || '',
    powerful: agentsDefaults?.model?.powerful || '',
    maxConcurrent: agentsDefaults?.maxConcurrent || 6,
    subagentsMaxConcurrent: agentsDefaults?.subagents?.maxConcurrent || 12,
    cachingEnabled: agentsDefaults?.caching?.enabled || false,
    maxCacheSize: agentsDefaults?.caching?.maxCacheSize || '2GB',
    requestTimeout: agentsDefaults?.timeout?.request || 120000,
    idleTimeout: agentsDefaults?.timeout?.idle || 300000,
    maxAttempts: agentsDefaults?.retry?.maxAttempts || 3,
    workspace: agentsDefaults?.workspace || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      model: {
        primary: formData.primary,
        fast: formData.fast || undefined,
        balanced: formData.balanced || undefined,
        powerful: formData.powerful || undefined,
      },
      models: agentsDefaults?.models || {},
      workspace: formData.workspace || undefined,
      maxConcurrent: formData.maxConcurrent,
      subagents: {
        maxConcurrent: formData.subagentsMaxConcurrent,
      },
      caching: {
        enabled: formData.cachingEnabled,
        maxCacheSize: formData.maxCacheSize,
      },
      timeout: {
        request: formData.requestTimeout,
        idle: formData.idleTimeout,
      },
      retry: {
        maxAttempts: formData.maxAttempts,
        backoff: 'exponential',
      },
      compaction: agentsDefaults?.compaction,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto" onClick={onClose}>
      <div className="bg-background rounded-lg shadow-lg border w-full max-w-2xl p-6 my-8" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">编辑 Agents 配置</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 模型配置 */}
          <div>
            <h3 className="text-lg font-medium mb-3">模型配置</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">主模型</label>
                <select
                  value={formData.primary}
                  onChange={e => setFormData({ ...formData, primary: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  required
                >
                  <option value="">选择模型...</option>
                  {availableModels.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">快速模型</label>
                <select
                  value={formData.fast}
                  onChange={e => setFormData({ ...formData, fast: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="">不设置</option>
                  {availableModels.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">平衡模型</label>
                <select
                  value={formData.balanced}
                  onChange={e => setFormData({ ...formData, balanced: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="">不设置</option>
                  {availableModels.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">强力模型</label>
                <select
                  value={formData.powerful}
                  onChange={e => setFormData({ ...formData, powerful: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="">不设置</option>
                  {availableModels.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 性能设置 */}
          <div>
            <h3 className="text-lg font-medium mb-3">性能设置</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">最大并发</label>
                <input
                  type="number"
                  value={formData.maxConcurrent}
                  onChange={e => setFormData({ ...formData, maxConcurrent: parseInt(e.target.value) || 6 })}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  min="1"
                  max="20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">子代理并发</label>
                <input
                  type="number"
                  value={formData.subagentsMaxConcurrent}
                  onChange={e => setFormData({ ...formData, subagentsMaxConcurrent: parseInt(e.target.value) || 12 })}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  min="1"
                  max="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">缓存大小</label>
                <select
                  value={formData.maxCacheSize}
                  onChange={e => setFormData({ ...formData, maxCacheSize: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="1GB">1 GB</option>
                  <option value="2GB">2 GB</option>
                  <option value="4GB">4 GB</option>
                  <option value="8GB">8 GB</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.cachingEnabled}
                    onChange={e => setFormData({ ...formData, cachingEnabled: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">启用缓存</span>
                </label>
              </div>
            </div>
          </div>

          {/* 超时设置 */}
          <div>
            <h3 className="text-lg font-medium mb-3">超时设置 (毫秒)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">请求超时</label>
                <input
                  type="number"
                  value={formData.requestTimeout}
                  onChange={e => setFormData({ ...formData, requestTimeout: parseInt(e.target.value) || 120000 })}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  min="10000"
                  max="600000"
                  step="10000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">空闲超时</label>
                <input
                  type="number"
                  value={formData.idleTimeout}
                  onChange={e => setFormData({ ...formData, idleTimeout: parseInt(e.target.value) || 300000 })}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  min="10000"
                  max="600000"
                  step="10000"
                />
              </div>
            </div>
          </div>

          {/* 重试设置 */}
          <div>
            <h3 className="text-lg font-medium mb-3">重试设置</h3>
            <div>
              <label className="block text-sm font-medium mb-1">最大重试次数</label>
              <input
                type="number"
                value={formData.maxAttempts}
                onChange={e => setFormData({ ...formData, maxAttempts: parseInt(e.target.value) || 3 })}
                className="w-full px-3 py-2 border rounded-md bg-background"
                min="1"
                max="10"
              />
            </div>
          </div>

          {/* 工作空间 */}
          <div>
            <label className="block text-sm font-medium mb-1">工作空间路径</label>
            <input
              type="text"
              value={formData.workspace}
              onChange={e => setFormData({ ...formData, workspace: e.target.value })}
              className="w-full px-3 py-2 border rounded-md bg-background font-mono text-sm"
              placeholder="C:\Users\...\workspace"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-accent"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
