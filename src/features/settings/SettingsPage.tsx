import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { organizationApi } from '@/api/organization'
import { queryKeys } from '@/api/queryKeys'
import { useAuth } from '@/auth/useAuth'
import { LanguageSwitch } from '@/components/layout/LanguageSwitch'
import { Button } from '@/components/ui/Button'
import { PageSpinner } from '@/components/ui/Spinner'
import { FeaturesSettings } from '@/features/platform/PlatformPages'

export function SettingsPage() {
  const { t } = useTranslation()
  const auth = useAuth()
  const orgQuery = useQuery({
    queryKey: queryKeys.organization,
    queryFn: organizationApi.current,
    enabled: auth.hasPermission('ORGANIZATION_READ'),
  })
  const user = auth.session?.user
  const org = orgQuery.data

  if (orgQuery.isLoading) return <PageSpinner label={t('common.loading')} />

  return (
    <div className="max-w-2xl space-y-5">
      <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-3">
        <h2 className="font-semibold">{t('common.profile')}</h2>
        <p className="text-lg font-medium">{user?.fullName}</p>
        <p className="text-sm text-neutral-500" dir="ltr">{user?.email}</p>
        <p className="text-sm text-neutral-500" dir="ltr">{user?.tenantSlug}</p>
        <Button variant="secondary" onClick={() => void auth.logout()}>
          {t('common.logout')}
        </Button>
      </section>
      {org && (
        <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-2">
          <h2 className="font-semibold">{t('settings.organization')}</h2>
          <p>{org.tenantName}</p>
          <p className="text-sm text-neutral-500">{org.institutionName}</p>
          <p className="text-sm text-neutral-500">{t('settings.timezone')}: <span dir="ltr">{org.timezone}</span></p>
        </section>
      )}
      <section className="bg-white rounded-xl border border-neutral-200 p-6 space-y-3">
        <h2 className="font-semibold">{t('settings.appearance')}</h2>
        <p className="text-sm text-neutral-500">{t('settings.languageHelp')}</p>
        <LanguageSwitch />
      </section>
      <FeaturesSettings />
    </div>
  )
}
