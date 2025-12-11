'use client'

import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

interface InsurancePlan {
  id: string
  company: string
  planName: string
  deductible: number
  copay: {
    primary: number
    urgent: number
    specialist: number
  }
  coinsurance: number
  outOfPocketMax: number
}

interface InsurancePlanSelectorProps {
  selectedPlan: string | null
  onPlanSelect: (planId: string) => void
}

export default function InsurancePlanSelector({ selectedPlan, onPlanSelect }: InsurancePlanSelectorProps) {
  const { t } = useTranslation()
  const [selectedCompany, setSelectedCompany] = useState<string>('')

  // Mock insurance plans data (in real app, this would come from API)
  const insurancePlans: Record<string, InsurancePlan[]> = {
    selecthealth: [
      {
        id: 'selecthealth-value-plus',
        company: 'SelectHealth',
        planName: t.utah.selectHealthValuePlus,
        deductible: 1500,
        copay: { primary: 25, urgent: 45, specialist: 50 },
        coinsurance: 20,
        outOfPocketMax: 5000,
      },
      {
        id: 'selecthealth-select-plus',
        company: 'SelectHealth',
        planName: t.utah.selectHealthSelectPlus,
        deductible: 2000,
        copay: { primary: 30, urgent: 50, specialist: 60 },
        coinsurance: 20,
        outOfPocketMax: 6000,
      },
      {
        id: 'selecthealth-select-care',
        company: 'SelectHealth',
        planName: t.utah.selectHealthSelectCare,
        deductible: 1000,
        copay: { primary: 20, urgent: 40, specialist: 45 },
        coinsurance: 15,
        outOfPocketMax: 4000,
      },
    ],
    regence: [
      {
        id: 'regence-blue-options',
        company: 'Regence BlueCross BlueShield',
        planName: t.utah.regenceBlueOptions,
        deductible: 1800,
        copay: { primary: 30, urgent: 50, specialist: 55 },
        coinsurance: 20,
        outOfPocketMax: 5500,
      },
      {
        id: 'regence-blue-preferred',
        company: 'Regence BlueCross BlueShield',
        planName: t.utah.regenceBluePreferred,
        deductible: 1200,
        copay: { primary: 25, urgent: 45, specialist: 50 },
        coinsurance: 15,
        outOfPocketMax: 4500,
      },
      {
        id: 'regence-blue-traditional',
        company: 'Regence BlueCross BlueShield',
        planName: t.utah.regenceBlueTraditional,
        deductible: 2500,
        copay: { primary: 35, urgent: 60, specialist: 65 },
        coinsurance: 25,
        outOfPocketMax: 7000,
      },
    ],
    university: [
      {
        id: 'university-basic',
        company: 'University of Utah Health Plans',
        planName: t.utah.universityUtahBasic,
        deductible: 2000,
        copay: { primary: 30, urgent: 50, specialist: 60 },
        coinsurance: 20,
        outOfPocketMax: 6000,
      },
      {
        id: 'university-plus',
        company: 'University of Utah Health Plans',
        planName: t.utah.universityUtahPlus,
        deductible: 1500,
        copay: { primary: 25, urgent: 45, specialist: 50 },
        coinsurance: 15,
        outOfPocketMax: 5000,
      },
    ],
    molina: [
      {
        id: 'molina-complete-care',
        company: 'Molina Healthcare',
        planName: t.utah.molinaCompleteCare,
        deductible: 1000,
        copay: { primary: 20, urgent: 40, specialist: 45 },
        coinsurance: 15,
        outOfPocketMax: 4000,
      },
      {
        id: 'molina-marketplace',
        company: 'Molina Healthcare',
        planName: t.utah.molinaMarketplace,
        deductible: 1500,
        copay: { primary: 25, urgent: 45, specialist: 50 },
        coinsurance: 20,
        outOfPocketMax: 5000,
      },
    ],
  }

  const selectedPlanData = selectedPlan && selectedCompany
    ? insurancePlans[selectedCompany]?.find(p => p.id === selectedPlan)
    : null

  return (
    <div className="space-y-4">
      {/* Insurance Company Selection */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          {t.search.insuranceCompany}
        </label>
        <select
          value={selectedCompany}
          onChange={(e) => {
            setSelectedCompany(e.target.value)
            onPlanSelect('')
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">{t.search.insuranceType}</option>
          <option value="selecthealth">{t.utah.selectHealth}</option>
          <option value="regence">{t.utah.regence}</option>
          <option value="university">{t.utah.universityUtah}</option>
          <option value="molina">{t.utah.molina}</option>
          <option value="none">{t.utah.noInsurance}</option>
        </select>
      </div>

      {/* Plan Selection */}
      {selectedCompany && selectedCompany !== 'none' && insurancePlans[selectedCompany] && (
        <div>
          <label className="block text-sm font-semibold mb-2">
            {t.search.planName}
          </label>
          <div className="space-y-2">
            {insurancePlans[selectedCompany].map((plan) => (
              <div
                key={plan.id}
                onClick={() => onPlanSelect(plan.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedPlan === plan.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{plan.planName}</h4>
                    <p className="text-sm text-gray-600">{plan.company}</p>
                  </div>
                  {selectedPlan === plan.id && (
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plan Details */}
      {selectedPlanData && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold mb-3">{t.utah.planDetails}</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">{t.utah.deductible}:</span>
              <span className="ml-2 font-semibold">${selectedPlanData.deductible.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-600">{t.utah.outOfPocketMax}:</span>
              <span className="ml-2 font-semibold">${selectedPlanData.outOfPocketMax.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-600">{t.utah.copay} (Primary):</span>
              <span className="ml-2 font-semibold">${selectedPlanData.copay.primary}</span>
            </div>
            <div>
              <span className="text-gray-600">{t.utah.copay} (Urgent):</span>
              <span className="ml-2 font-semibold">${selectedPlanData.copay.urgent}</span>
            </div>
            <div>
              <span className="text-gray-600">{t.utah.coinsurance}:</span>
              <span className="ml-2 font-semibold">{selectedPlanData.coinsurance}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

