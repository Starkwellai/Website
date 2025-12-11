'use client'

import { useTranslation } from '@/hooks/useTranslation'

export default function TransparencySection() {
  const { t } = useTranslation()

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          {t.transparency.title}
        </h2>
        <p className="text-lg text-gray-700 mb-12 max-w-3xl">
          {t.transparency.description}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-3">{t.transparency.about}</h3>
            <p className="text-gray-700">
              {t.transparency.aboutDesc}
            </p>
          </div>
          
          <div>
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-bold mb-3">{t.transparency.threeRegulations}</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• {t.transparency.hospitalRule}</li>
              <li>• {t.transparency.coverageRule}</li>
              <li>• {t.transparency.noSurprisesAct}</li>
            </ul>
          </div>
          
          <div>
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-3">{t.transparency.ourMission}</h3>
            <p className="text-gray-700">
              {t.transparency.missionDesc}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

