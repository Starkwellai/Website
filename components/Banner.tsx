'use client'

import { useTranslation } from '@/hooks/useTranslation'

export default function Banner() {
  const { t } = useTranslation()

  return (
    <section className="bg-primary text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xl md:text-2xl font-semibold">
          {t.banner.text}
        </p>
      </div>
    </section>
  )
}

