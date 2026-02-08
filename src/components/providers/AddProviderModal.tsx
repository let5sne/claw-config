import React, { useState } from 'react';
import { useProviders } from '../../hooks/useProviders';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import type { ProviderPreset } from '../../types';

interface AddProviderModalProps {
  presets: ProviderPreset[];
  onClose: () => void;
  onSave: () => void;
}

export function AddProviderModal({ presets, onClose, onSave }: AddProviderModalProps) {
  const { addProvider, isAdding } = useProviders();
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [customId, setCustomId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');

  const selectedPresetData = presets.find(p => p.id === selectedPreset);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const id = customId || selectedPreset;
    const preset = selectedPresetData || presets[0];

    const provider = {
      baseUrl: baseUrl || preset.defaultEndpoint || '',
      apiKey,
      api: preset.apiType,
      models: preset.models.map(m => ({
        ...m,
        cost: { input: 0, output: 0 },
      })),
    };

    await addProvider({ id, provider });
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg shadow-lg border w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">添加 Provider</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="preset">Provider 类型</Label>
            <Select
              id="preset"
              value={selectedPreset}
              onChange={(e) => {
                setSelectedPreset(e.target.value);
                if (!customId) {
                  setCustomId(e.target.value);
                }
                if (e.target.value) {
                  const preset = presets.find(p => p.id === e.target.value);
                  if (preset?.defaultEndpoint) {
                    setBaseUrl(preset.defaultEndpoint);
                  }
                }
              }}
              required
            >
              <option value="">选择 Provider...</option>
              {presets.map(preset => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="customId">配置 ID</Label>
            <Input
              id="customId"
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              placeholder={selectedPreset || "自定义 ID"}
              required
            />
          </div>

          <div>
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              required
            />
          </div>

          <div>
            <Label htmlFor="baseUrl">Base URL</Label>
            <Input
              id="baseUrl"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder={selectedPresetData?.defaultEndpoint || "https://api.example.com"}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" disabled={isAdding}>
              {isAdding ? '添加中...' : '添加'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
