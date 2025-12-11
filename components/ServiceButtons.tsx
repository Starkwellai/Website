'use client'

import { useTranslation } from '@/hooks/useTranslation'

export default function ServiceButtons() {
  const { t } = useTranslation()

  const services = [
    t.services.colonoscopy,
    t.services.kneeRepair,
    t.services.infectionScreening,
    t.services.visionHearingTest,
    t.services.stdTesting,
    t.services.dentalCheckup,
    t.services.specificHealthCheckup,
    t.services.gynecology,
    t.services.mammogram,
    t.services.bloodPressureTest,
    t.services.bodyMeasurement,
    t.services.bodyHealthCheckup,
    t.services.cancerScreening,
    t.services.fertilityTreatment,
    t.services.immunization,
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t.services.title}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {services.map((service, index) => (
            <button
              key={index}
              className="bg-primary text-white px-6 py-4 rounded-full font-semibold hover:bg-primary-dark transition-colors flex items-center justify-between gap-2 text-sm md:text-base"
            >
              <span>{service}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

