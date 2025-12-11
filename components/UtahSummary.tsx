'use client'

import { useTranslation } from '@/hooks/useTranslation'

export default function UtahSummary() {
  const { t } = useTranslation()

  const summaryPoints = [
    {
      question: t.utah.summary1,
      answer: t.utah.summary1Desc,
      icon: '💰',
    },
    {
      question: t.utah.summary2,
      answer: t.utah.summary2Desc,
      icon: '🧮',
    },
    {
      question: t.utah.summary3,
      answer: t.utah.summary3Desc,
      icon: '🏥',
    },
    {
      question: t.utah.summary4,
      answer: t.utah.summary4Desc,
      icon: '🔍',
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-primary to-primary-dark text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t.utah.summary}
            </h2>
            <p className="text-xl text-blue-100">
              {t.utah.summaryTitle}
            </p>
          </div>

          <div className="space-y-6">
            {summaryPoints.map((point, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0">{point.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{point.question}</h3>
                    <p className="text-blue-100 leading-relaxed">{point.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

