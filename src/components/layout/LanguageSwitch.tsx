import { useTranslation } from 'react-i18next'
import { LANGUAGE_KEY } from '@/i18n'

export function LanguageSwitch() {
  const { i18n, t } = useTranslation()
  const language = i18n.language.startsWith('en') ? 'en' : 'fa'

  async function setLanguage(next: 'fa' | 'en') {
    localStorage.setItem(LANGUAGE_KEY, next)
    await i18n.changeLanguage(next)
  }

  return (
    <div className="flex items-center bg-neutral-100 rounded-lg p-0.5" role="group" aria-label={t('common.language')}>
      {(['fa', 'en'] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => void setLanguage(code)}
          className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
            language === code ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          {code === 'fa' ? t('common.persian') : t('common.english')}
        </button>
      ))}
    </div>
  )
}
