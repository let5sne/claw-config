import { useProviders } from '../../hooks/useProviders';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useTranslation } from 'react-i18next';

export function ProviderList() {
  const { t } = useTranslation();
  const { providers, isLoading, error, refetch } = useProviders();

  console.log('ProviderList render:', { providers, isLoading, error });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">{t('common.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-red-500 mb-2">{t('providers.loadFailed')}</p>
          <p className="text-sm text-muted-foreground mb-4">{String(error)}</p>
          <Button onClick={() => refetch()}>{t('common.retry')}</Button>
        </CardContent>
      </Card>
    );
  }

  const providerEntries = Object.entries(providers || {});
  console.log('Provider entries:', providerEntries);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t('providers.title')}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t('providers.description')}
          </p>
        </div>
        <Button>
          {t('providers.addProvider')}
        </Button>
      </div>

      {providerEntries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">{t('providers.noProviders')}</p>
            <Button>{t('providers.addFirstProvider')}</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {providerEntries.map(([id, provider]) => (
            <Card key={id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="capitalize">{id}</CardTitle>
                    <CardDescription className="mt-1">
                      {provider.baseUrl}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      {t('common.edit')}
                    </Button>
                    <Button variant="destructive" size="sm">
                      {t('common.delete')}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    {t('providers.modelList', { count: provider.models?.length || 0 })}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {provider.models?.map((model) => (
                      <span
                        key={model.id}
                        className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      >
                        {model.name}
                      </span>
                    )) || <span className="text-sm text-muted-foreground">{t('providers.noModels')}</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
