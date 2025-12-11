'use client'

import { useLocale } from '@/contexts/LocaleContext'
import { translations } from '@/lib/translations'

export function useTranslation() {
  const { locale } = useLocale()
  const t = translations[locale]

  return { t, locale }
}

