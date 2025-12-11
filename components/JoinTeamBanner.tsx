'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function JoinTeamBanner() {
  const { t } = useTranslation()

  return (
    <section className="bg-primary text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="text-6xl mb-4">👥</div>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.joinTeam.title}</h2>
            <p className="text-lg mb-6 text-blue-100">
              {t.joinTeam.description}
            </p>
            <Link href="/careers" className="btn-secondary inline-block">
              {t.joinTeam.seeOpenings}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

