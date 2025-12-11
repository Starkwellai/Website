'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

const PP_KEY = 'ppAcceptedAt'
const TOU_KEY = 'touAcceptedAt'

function useLocalStorage(key: string) {
  const [value, setValue] = useState<string | null>(null)

  useEffect(() => {
    try {
      const item = localStorage.getItem(key)
      setValue(item)
    } catch {
      setValue(null)
    }
  }, [key])

  const setItem = (val: string) => {
    try {
      localStorage.setItem(key, val)
      setValue(val)
    } catch {}
  }

  const removeItem = () => {
    try {
      localStorage.removeItem(key)
      setValue(null)
    } catch {}
  }

  return [value, setItem, removeItem] as const
}

function useScrollToEnable(
  scrollEl: HTMLDivElement | null,
  onEnabled: () => void,
  isOpen: boolean
) {
  useEffect(() => {
    if (!scrollEl || !isOpen) return

    let enabled = false

    const checkScroll = () => {
      if (enabled) return

      const scrollTop = scrollEl.scrollTop
      const scrollHeight = scrollEl.scrollHeight
      const clientHeight = scrollEl.clientHeight
      const threshold = 10 // 10pxの余裕を持たせる
      
      const atBottom = scrollTop + clientHeight >= scrollHeight - threshold
      
      if (atBottom && !enabled) {
        enabled = true
        onEnabled()
      }
    }

    // スクロールイベントを追加
    scrollEl.addEventListener('scroll', checkScroll, { passive: true })
    scrollEl.addEventListener('touchmove', checkScroll, { passive: true })
    scrollEl.addEventListener('wheel', checkScroll, { passive: true })
    
    // 初期状態で既に最下部にいる場合をチェック（複数回チェック）
    const initialCheck = () => {
      checkScroll()
    }
    setTimeout(initialCheck, 100)
    setTimeout(initialCheck, 300)
    setTimeout(initialCheck, 500)
    
    // リサイズ時もチェック（コンテンツが短い場合など）
    const handleResize = () => {
      checkScroll()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      enabled = false
      scrollEl.removeEventListener('scroll', checkScroll)
      scrollEl.removeEventListener('touchmove', checkScroll)
      scrollEl.removeEventListener('wheel', checkScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [scrollEl, onEnabled, isOpen])
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
  onDecline: () => void
  title: string
  badge: string
  content: React.ReactNode
  checkboxLabel: string
  acceptLabel: string
  declineLabel: string
}

function Modal({
  isOpen,
  onClose,
  onAccept,
  onDecline,
  title,
  badge,
  content,
  checkboxLabel,
  acceptLabel,
  declineLabel,
}: ModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [checkboxEnabled, setCheckboxEnabled] = useState(false)
  const [checkboxChecked, setCheckboxChecked] = useState(false)

  // スクロール検知フック（isOpenを依存配列に追加）
  useScrollToEnable(scrollRef.current, () => {
    setCheckboxEnabled(true)
  }, isOpen)

  // モーダルが開かれた時にリセット
  useEffect(() => {
    if (isOpen) {
      setCheckboxEnabled(false)
      setCheckboxChecked(false)
      // スクロール位置をリセット（少し遅延を入れて確実に）
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = 0
        }
      }, 50)
    }
  }, [isOpen])

  const handleAccept = () => {
    if (!checkboxChecked) return
    onAccept()
  }

  const handleDecline = () => {
    onDecline()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      aria-hidden={!isOpen}
      aria-modal="true"
      role="dialog"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          // Don't close on overlay click - require explicit action
        }
      }}
    >
      <div className="bg-gray-900 border border-white/10 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[84vh] grid grid-rows-[auto_1fr_auto]">
        {/* Header */}
        <header className="px-5 py-4 border-b border-white/10 flex items-center gap-3">
          <span className="text-xs px-2 py-1 rounded-full border border-white/20 text-blue-200 bg-blue-900/20">
            {badge}
          </span>
          <h2 className="text-lg font-semibold m-0 text-white">{title}</h2>
        </header>

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          className="px-5 py-4 overflow-auto text-gray-200 leading-relaxed"
          tabIndex={0}
          style={{ scrollbarWidth: 'thin' }}
        >
          {content}
        </div>

        {/* Footer */}
        <footer className="px-5 py-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <label 
            className={`flex items-center gap-2 select-none ${
              checkboxEnabled 
                ? 'cursor-pointer' 
                : 'cursor-not-allowed opacity-60'
            }`}
            title={checkboxEnabled ? '' : 'Please scroll to the bottom to enable'}
          >
            <input
              type="checkbox"
              checked={checkboxChecked}
              onChange={(e) => {
                if (checkboxEnabled) {
                  setCheckboxChecked(e.target.checked)
                }
              }}
              disabled={!checkboxEnabled}
              className="w-4 h-4 rounded border-gray-400 text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className={`text-sm ${
              checkboxEnabled 
                ? 'text-gray-300' 
                : 'text-gray-500'
            }`}>
              {checkboxLabel}
              {!checkboxEnabled && (
                <span className="block text-xs text-gray-500 mt-1">
                  (スクロールして最後まで読んでください / Please scroll to the end)
                </span>
              )}
            </span>
          </label>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleDecline}
              className="px-4 py-2 rounded-xl bg-red-900/30 border border-red-500/30 text-red-200 hover:bg-red-900/40 transition-colors text-sm font-semibold"
            >
              {declineLabel}
            </button>
            <button
              onClick={handleAccept}
              disabled={!checkboxChecked || !checkboxEnabled}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                checkboxChecked && checkboxEnabled
                  ? 'bg-primary text-white hover:bg-primary-dark cursor-pointer'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
              }`}
              title={!checkboxEnabled ? 'Please scroll to the bottom first' : !checkboxChecked ? 'Please check the checkbox' : ''}
            >
              {acceptLabel}
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

interface PrivacyTermsModalsProps {
  autoShow?: boolean
  onPrivacyClick?: () => void
  onTermsClick?: () => void
}

export default function PrivacyTermsModals({ 
  autoShow = false,
  onPrivacyClick,
  onTermsClick,
}: PrivacyTermsModalsProps = {}) {
  const { t } = useTranslation()
  const [ppAccepted, setPpAccepted, removePpAccepted] = useLocalStorage(PP_KEY)
  const [touAccepted, setTouAccepted, removeTouAccepted] = useLocalStorage(TOU_KEY)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  // 自動表示が有効な場合のみ、同意状態をチェックして自動表示
  useEffect(() => {
    if (!autoShow) return

    const hasPP = !!ppAccepted
    const hasToU = !!touAccepted

    if (!hasPP) {
      setShowPrivacy(true)
    } else if (!hasToU) {
      setShowTerms(true)
    }
  }, [ppAccepted, touAccepted, autoShow])

  // モーダルを開く関数をグローバルに公開（親コンポーネントから呼び出し可能にする）
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).openPrivacyModal = () => {
        setShowPrivacy(true)
      }
      (window as any).openTermsModal = () => {
        setShowTerms(true)
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).openPrivacyModal
        delete (window as any).openTermsModal
      }
    }
  }, [])

  const handlePrivacyAccept = () => {
    setPpAccepted(new Date().toISOString())
    setShowPrivacy(false)
    // Terms of Useモーダルを少し遅延して開く（スクロール位置のリセットを確実にするため）
    setTimeout(() => {
      setShowTerms(true)
    }, 100)
  }

  const handlePrivacyDecline = () => {
    alert(t.modals.declineMessage)
    // You can customize this behavior (redirect, disable app, etc.)
  }

  const handleTermsAccept = () => {
    setTouAccepted(new Date().toISOString())
    setShowTerms(false)
  }

  const handleTermsDecline = () => {
    alert(t.modals.declineMessage)
    // You can customize this behavior (redirect, disable app, etc.)
  }

  return (
    <>
      <Modal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        onAccept={handlePrivacyAccept}
        onDecline={handlePrivacyDecline}
        title={t.modals.privacyTitle}
        badge="Privacy"
        checkboxLabel={t.modals.privacyCheckboxLabel}
        acceptLabel={t.modals.accept}
        declineLabel={t.modals.decline}
        content={
          <div>
            <p className="text-xs opacity-75 mb-4">English</p>
            <p className="mb-4">{t.modals.privacyEnglishText1}</p>
            <p className="mb-4">{t.modals.privacyEnglishText2}</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                <strong>{t.modals.dataCategories}:</strong>{' '}
                {t.modals.dataCategoriesDesc}
              </li>
              <li>
                <strong>{t.modals.yourRights}:</strong> {t.modals.yourRightsDesc}
              </li>
              <li>
                <strong>{t.modals.dataSecurity}:</strong>{' '}
                {t.modals.dataSecurityDesc}
              </li>
              <li>
                <strong>{t.modals.updates}:</strong> {t.modals.updatesDesc}
              </li>
            </ul>
            <div className="h-px bg-white/10 my-6"></div>
            <p className="text-xs opacity-75 mb-4">日本語</p>
            <p className="mb-4">{t.modals.privacyJapaneseText1}</p>
            <p className="mb-4">{t.modals.privacyJapaneseText2}</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                <strong>{t.modals.dataCategories}:</strong>{' '}
                {t.modals.dataCategoriesDescJa}
              </li>
              <li>
                <strong>{t.modals.yourRights}:</strong>{' '}
                {t.modals.yourRightsDescJa}
              </li>
              <li>
                <strong>{t.modals.dataSecurity}:</strong>{' '}
                {t.modals.dataSecurityDescJa}
              </li>
              <li>
                <strong>{t.modals.updates}:</strong> {t.modals.updatesDescJa}
              </li>
            </ul>
            <p className="text-gray-400 text-sm mt-6 mb-4">
              {t.modals.disagreeMessage}
            </p>
            <p className="mt-8 mb-0">— {t.modals.endOfPrivacy} —</p>
          </div>
        }
      />

      <Modal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={handleTermsAccept}
        onDecline={handleTermsDecline}
        title={t.modals.termsTitle}
        badge="Terms"
        checkboxLabel={t.modals.termsCheckboxLabel}
        acceptLabel={t.modals.accept}
        declineLabel={t.modals.decline}
        content={
          <div>
            <p className="text-xs opacity-75 mb-4">English</p>
            <p className="mb-4">{t.modals.termsEnglishText1}</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                <strong>{t.modals.acceptableUse}:</strong>{' '}
                {t.modals.acceptableUseDesc}
              </li>
              <li>
                <strong>{t.modals.contentOwnership}:</strong>{' '}
                {t.modals.contentOwnershipDesc}
              </li>
              <li>
                <strong>{t.modals.limitationOfLiability}:</strong>{' '}
                {t.modals.limitationOfLiabilityDesc}
              </li>
              <li>
                <strong>{t.modals.changes}:</strong> {t.modals.changesDesc}
              </li>
              <li>
                <strong>{t.modals.governingLaw}:</strong>{' '}
                {t.modals.governingLawDesc}
              </li>
            </ul>
            <div className="h-px bg-white/10 my-6"></div>
            <p className="text-xs opacity-75 mb-4">日本語</p>
            <p className="mb-4">{t.modals.termsJapaneseText1}</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                <strong>{t.modals.acceptableUse}:</strong>{' '}
                {t.modals.acceptableUseDescJa}
              </li>
              <li>
                <strong>{t.modals.contentOwnership}:</strong>{' '}
                {t.modals.contentOwnershipDescJa}
              </li>
              <li>
                <strong>{t.modals.limitationOfLiability}:</strong>{' '}
                {t.modals.limitationOfLiabilityDescJa}
              </li>
              <li>
                <strong>{t.modals.changes}:</strong> {t.modals.changesDescJa}
              </li>
              <li>
                <strong>{t.modals.governingLaw}:</strong>{' '}
                {t.modals.governingLawDescJa}
              </li>
            </ul>
            <p className="text-gray-400 text-sm mt-6 mb-4">
              {t.modals.disagreeMessage}
            </p>
            <p className="mt-8 mb-0">— {t.modals.endOfTerms} —</p>
          </div>
        }
      />
    </>
  )
}

