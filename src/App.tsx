import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './components/LanguageSelector';
import { ProviderList } from './components/providers/ProviderList';
import { AgentsConfigPanel } from './components/agents/AgentsConfigPanel';
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

function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'providers' | 'agents'>('providers');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                {t('app.title')}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t('app.description')}
              </p>
            </div>
            <LanguageSelector />
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
              {t('nav.providers')}
            </button>
            <button
              onClick={() => setActiveTab('agents')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'agents'
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t('nav.agents')}
            </button>
          </div>

          {/* Providers Tab */}
          {activeTab === 'providers' && <ProviderList />}

          {/* Agents Tab */}
          {activeTab === 'agents' && <AgentsConfigPanel />}
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
