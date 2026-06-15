'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { translations, Locale, getTranslations } from '@/lib/i18n'

type Translations = typeof translations.ar | typeof translations.en

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
  isRTL: boolean
  dir: 'rtl' | 'ltr'
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ar')

  useEffect(() => {
    // Check localStorage or cookie for saved preference
    const savedLocale = localStorage.getItem('locale') as Locale | null
    if (savedLocale && (savedLocale === 'ar' || savedLocale === 'en')) {
      setLocaleState(savedLocale)
    } else {
      // Check browser language
      const browserLang = navigator.language.split('-')[0]
      if (browserLang === 'ar') {
        setLocaleState('ar')
      }
    }
  }, [])

  useEffect(() => {
    // Update document direction and lang attribute
    const dir = locale === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.setAttribute('dir', dir)
    document.documentElement.setAttribute('lang', locale)

    // Save preference
    localStorage.setItem('locale', locale)
  }, [locale])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
  }

  const value: LocaleContextType = {
    locale,
    setLocale,
    t: getTranslations(locale),
    isRTL: locale === 'ar',
    dir: locale === 'ar' ? 'rtl' : 'ltr',
  }

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}

// Hook for accessing translations
export function useTranslation() {
  const { t, locale } = useLocale()
  return { t, locale }
}
