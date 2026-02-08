import React, { useState } from 'react';
import { useProviders } from '../../hooks/useProviders';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import type { Provider } from '../../types';

interface EditProviderModalProps {
  id: string;
  provider: Provider;
  onClose: () => void;
  onSave: () => void;
}

export function EditProviderModal({ id, provider, onClose, onSave }: EditProviderModalProps) {
  const { updateProvider, isUpdating } = useProviders();
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState(provider.baseUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProvider: Provider = {
      ...provider,
      baseUrl,
      apiKey: apiKey || provider.apiKey,
    };

    await updateProvider({ id, provider: updatedProvider });
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg shadow-lg border w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">编辑 Provider</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Provider ID</Label>
            <Input value={id} disabled />
          </div>

          <div>
            <Label htmlFor="editBaseUrl">Base URL</Label>
            <Input
              id="editBaseUrl"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="editApiKey">API Key（留空保持不变）</Label>
            <Input
              id="editApiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="不修改请留空"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? '保存中...' : '保存'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
