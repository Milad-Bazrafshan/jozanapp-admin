import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/auth/useAuth'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { LanguageSwitch } from '@/components/layout/LanguageSwitch'

export function LoginPage() {
  const { t } = useTranslation()
  const auth = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    tenantSlug: 'jozan',
    email: import.meta.env.DEV ? '0099999991' : '',
    password: '',
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (auth.session) return <Navigate to="/" replace />

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      await auth.login(form)
      navigate('/')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t('common.retry'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50 grid lg:grid-cols-2">
      <section className="hidden lg:flex flex-col justify-between p-12 bg-neutral-900 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-neutral-900 flex items-center justify-center font-bold">O</div>
          <div>
            <p className="font-semibold">{t('brand.name')}</p>
            <p className="text-sm text-neutral-400">{t('brand.admin')}</p>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400 mb-3">Orix School</p>
          <h1 className="text-4xl font-semibold leading-tight max-w-md">{t('brand.tagline')}</h1>
        </div>
        <LanguageSwitch />
      </section>
      <section className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-md bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-400">{t('page.login.title')}</p>
              <h2 className="text-2xl font-semibold mt-1">{t('auth.welcome')}</h2>
              <p className="text-sm text-neutral-500 mt-1">{t('page.login.subtitle')}</p>
            </div>
            <div className="lg:hidden">
              <LanguageSwitch />
            </div>
          </div>
          <Field label={t('auth.tenantSlug')} value={form.tenantSlug} onChange={(tenantSlug) => setForm({ ...form, tenantSlug })} autoComplete="organization" className="ltr-field" />
          <Field label={t('auth.nationalCode')} type="text" inputMode="numeric" value={form.email} onChange={(email) => setForm({ ...form, email })} autoComplete="username" className="ltr-field" />
          <Field label={t('auth.password')} type="password" value={form.password} onChange={(password) => setForm({ ...form, password })} autoComplete="current-password" />
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? t('auth.signingIn') : t('auth.signIn')}
          </Button>
          <Link to="/forgot-password" className="block text-sm text-neutral-500 hover:text-neutral-900 text-center">
            {t('auth.forgotLink')}
          </Link>
        </form>
      </section>
    </main>
  )
}
