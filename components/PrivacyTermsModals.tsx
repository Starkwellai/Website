'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { translations } from '@/lib/translations'

const HIPAA_KEY = 'hipaaAcceptedAt'
const PP_KEY = 'ppAcceptedAt'
const TOU_KEY = 'touAcceptedAt'

// クライアント側でのみ日付を表示するコンポーネント（Hydration errorを防ぐため）
function LastUpdatedDate({ label }: { label: string }) {
  const [date, setDate] = useState<string>('')

  useEffect(() => {
    // クライアント側でのみ日付を設定
    setDate(new Date().toLocaleDateString())
  }, [])

  return <p className="mt-8 mb-0">— {label}: {date || '...'} —</p>
}

// HIPAAモーダルのコンテンツ（常に英語で表示）
function HipaaModalContent() {
  const { t } = useTranslation()
  // 英語の翻訳を直接参照
  const enTranslations = translations.en

  return (
    <div>
      <div className="bg-yellow-900/30 border border-yellow-500/30 p-4 rounded-lg mb-4">
        <p className="text-yellow-200 font-semibold text-sm">{enTranslations.hipaa.importantNotice}</p>
      </div>
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-white">{enTranslations.hipaa.notMedicalAdvice}</h3>
        <p className="mb-4">{enTranslations.hipaa.notMedicalAdviceDesc}</p>
      </section>
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-white">{enTranslations.hipaa.hipaaCompliance}</h3>
        <p className="mb-4">{enTranslations.hipaa.hipaaComplianceDesc}</p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>{enTranslations.hipaa.hipaaComplianceItem1}</li>
          <li>{enTranslations.hipaa.hipaaComplianceItem2}</li>
          <li>{enTranslations.hipaa.hipaaComplianceItem3}</li>
          <li>{enTranslations.hipaa.hipaaComplianceItem4}</li>
        </ul>
      </section>
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-white">{enTranslations.hipaa.dataProtection}</h3>
        <p className="mb-4">{enTranslations.hipaa.dataProtectionDesc}</p>
      </section>
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-white">{enTranslations.hipaa.limitations}</h3>
        <p className="mb-4">{enTranslations.hipaa.limitationsDesc}</p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>{enTranslations.hipaa.limitationsItem1}</li>
          <li>{enTranslations.hipaa.limitationsItem2}</li>
          <li>{enTranslations.hipaa.limitationsItem3}</li>
        </ul>
      </section>
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-white">{enTranslations.hipaa.userResponsibility}</h3>
        <p className="mb-4">{enTranslations.hipaa.userResponsibilityDesc}</p>
      </section>
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-white">{enTranslations.hipaa.contact}</h3>
        <p className="mb-4">{enTranslations.hipaa.contactDesc}</p>
      </section>
      <p className="text-gray-400 text-sm mt-6 mb-4">
        {enTranslations.modals.disagreeMessage}
      </p>
      <LastUpdatedDate label={enTranslations.hipaa.lastUpdated} />
    </div>
  )
}

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
  scrollRef: React.RefObject<HTMLDivElement> | null,
  onEnabled: () => void,
  isOpen: boolean
) {
  useEffect(() => {
    if (!isOpen) return

    const enabledRef = { current: false }
    let scrollEl: HTMLDivElement | null = null
    let intervalId: ReturnType<typeof setInterval> | null = null

    const checkScroll = () => {
      if (!scrollEl || enabledRef.current) return

      const scrollTop = scrollEl.scrollTop
      const scrollHeight = scrollEl.scrollHeight
      const clientHeight = scrollEl.clientHeight
      
      // 閾値（5px）- 最後まで読んだことを確認
      const threshold = 5

      // コンテンツが短くてスクロールが不要な場合も有効化
      const noScrollNeeded = scrollHeight <= clientHeight + threshold
      
      // シンプルな計算：スクロール位置 + 表示領域 >= コンテンツ全体 - 閾値
      const scrollBottom = scrollTop + clientHeight
      const remaining = scrollHeight - scrollBottom
      
      // 最下部に到達したかどうか（厳密に判定）
      const isAtBottomStrict = remaining <= threshold
      
      // デバッグ用（常に表示して問題を特定）
      console.log('📜 Scroll check:', {
        scrollTop: Math.round(scrollTop),
        scrollHeight: Math.round(scrollHeight),
        clientHeight: Math.round(clientHeight),
        scrollBottom: Math.round(scrollBottom),
        remaining: Math.round(remaining),
        isAtBottomStrict,
        noScrollNeeded,
        threshold,
        willEnable: (isAtBottomStrict || noScrollNeeded) && !enabledRef.current
      })
      
      // 最下部到達またはスクロール不要な場合のみ有効化
      if ((isAtBottomStrict || noScrollNeeded) && !enabledRef.current) {
        enabledRef.current = true
        console.log('✅✅✅ CHECKBOX ENABLED! Scroll reached bottom')
        console.log('Enabled conditions:', { isAtBottomStrict, noScrollNeeded })
        onEnabled()
      }
    }

    const attachListeners = () => {
      if (!scrollEl) return

      // スクロールイベントを追加（より確実に検知）
      const scrollHandler = () => {
        checkScroll()
        requestAnimationFrame(checkScroll)
        setTimeout(checkScroll, 50)
      }
      scrollEl.addEventListener('scroll', scrollHandler, { passive: true })
      scrollEl.addEventListener('touchmove', scrollHandler, { passive: true })
      scrollEl.addEventListener('wheel', scrollHandler, { passive: true })
      try {
        scrollEl.addEventListener('scrollend', checkScroll, { passive: true })
      } catch (e) {}

      const initialCheck = () => {
        requestAnimationFrame(checkScroll)
      }
      setTimeout(initialCheck, 50)
      setTimeout(initialCheck, 100)
      setTimeout(initialCheck, 200)
      setTimeout(initialCheck, 300)
      setTimeout(initialCheck, 500)
      setTimeout(initialCheck, 800)
      setTimeout(initialCheck, 1200)
      setTimeout(initialCheck, 2000)

      const handleResize = () => {
        checkScroll()
      }
      window.addEventListener('resize', handleResize)

      const observer = new MutationObserver(() => {
        setTimeout(checkScroll, 100)
      })
      observer.observe(scrollEl, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      })

      const fallbackIntervalId = setInterval(() => {
        if (!enabledRef.current) {
          checkScroll()
        } else {
          clearInterval(fallbackIntervalId)
        }
      }, 50)

      return () => {
        enabledRef.current = false
        scrollEl?.removeEventListener('scroll', scrollHandler)
        scrollEl?.removeEventListener('touchmove', scrollHandler)
        scrollEl?.removeEventListener('wheel', scrollHandler)
        try {
          scrollEl?.removeEventListener('scrollend', checkScroll)
        } catch (e) {}
        window.removeEventListener('resize', handleResize)
        observer.disconnect()
        clearInterval(fallbackIntervalId)
      }
    }

    // Wait for ref to be available
    intervalId = setInterval(() => {
      if (scrollRef?.current) {
        scrollEl = scrollRef.current
        if (intervalId) clearInterval(intervalId)
        intervalId = null
        cleanupListeners = attachListeners()
      }
    }, 50)

    let cleanupListeners: (() => void) | undefined

    return () => {
      if (intervalId) clearInterval(intervalId)
      if (cleanupListeners) cleanupListeners()
    }
  }, [scrollRef, onEnabled, isOpen])
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
  const [mounted, setMounted] = useState(false)

  // クライアント側でのみマウントされたことを確認（Hydration errorを防ぐため）
  useEffect(() => {
    setMounted(true)
  }, [])

  // スクロール検知フック
  useScrollToEnable(scrollRef, () => {
    console.log('✅ Checkbox enabled callback called - setting state to true')
    console.log('Current checkboxEnabled state before update:', checkboxEnabled)
    setCheckboxEnabled(true)
    // 状態更新を確認
    setTimeout(() => {
      console.log('Checkbox enabled state after update should be true')
    }, 0)
  }, isOpen)
  
  // チェックボックスの状態を監視（デバッグ用）
  useEffect(() => {
    console.log('🔔 Checkbox enabled state changed:', checkboxEnabled)
  }, [checkboxEnabled])

  // モーダルが開かれた時にリセット
  useEffect(() => {
    if (isOpen) {
      setCheckboxEnabled(false)
      setCheckboxChecked(false)
      // スクロール位置をリセット（少し遅延を入れて確実に）
      const resetScroll = () => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = 0
          // スクロール位置をリセットした後、複数回チェック
          const checkAfterReset = () => {
            if (scrollRef.current) {
              const scrollHeight = scrollRef.current.scrollHeight
              const clientHeight = scrollRef.current.clientHeight
              const threshold = 5
              // コンテンツが短い場合は即座に有効化
              if (scrollHeight <= clientHeight + threshold) {
                console.log('✅ Content is short, enabling checkbox immediately')
                setCheckboxEnabled(true)
              } else {
                console.log('Content needs scrolling:', {
                  scrollHeight,
                  clientHeight,
                  needsScroll: scrollHeight > clientHeight + threshold
                })
              }
            }
          }
          // 複数回チェックして確実に検知
          setTimeout(checkAfterReset, 100)
          setTimeout(checkAfterReset, 200)
          setTimeout(checkAfterReset, 400)
          setTimeout(checkAfterReset, 600)
        } else {
          // refがまだ利用できない場合は再試行
          setTimeout(resetScroll, 50)
        }
      }
      setTimeout(resetScroll, 50)
      setTimeout(resetScroll, 100)
      setTimeout(resetScroll, 200)
    }
  }, [isOpen])

  const handleAccept = () => {
    if (!checkboxChecked) return
    onAccept()
  }

  const handleDecline = () => {
    onDecline()
  }

  if (!isOpen || !mounted) return null

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
          <span className="text-xs px-2 py-1 rounded-full border border-white/20 text-primary-200 bg-primary-900/20">
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
          suppressHydrationWarning
        >
          {mounted ? content : <div className="px-5 py-4">Loading...</div>}
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
            onClick={(e) => {
              if (!checkboxEnabled) {
                e.preventDefault()
                e.stopPropagation()
              }
            }}
          >
            <input
              type="checkbox"
              checked={checkboxChecked}
              onChange={(e) => {
                if (checkboxEnabled) {
                  console.log('✅ Checkbox clicked, setting to:', e.target.checked)
                  setCheckboxChecked(e.target.checked)
                } else {
                  console.log('❌ Checkbox is disabled, cannot check. Enabled state:', checkboxEnabled)
                  e.preventDefault()
                }
              }}
              disabled={!checkboxEnabled}
              onClick={(e) => {
                console.log('Checkbox onClick - enabled:', checkboxEnabled)
                if (!checkboxEnabled) {
                  console.log('❌ Checkbox click prevented - not enabled')
                  e.preventDefault()
                  e.stopPropagation()
                } else {
                  console.log('✅ Checkbox click allowed')
                }
              }}
              className={`w-5 h-5 rounded border-2 transition-all ${
                checkboxEnabled 
                  ? 'cursor-pointer opacity-100 border-primary' 
                  : 'cursor-not-allowed opacity-50 border-gray-500'
              }`}
              style={{ 
                pointerEvents: checkboxEnabled ? 'auto' : 'none',
                cursor: checkboxEnabled ? 'pointer' : 'not-allowed',
                accentColor: checkboxEnabled ? 'var(--primary)' : undefined
              }}
            />
            <span className={`text-sm ${
              checkboxEnabled 
                ? 'text-gray-300' 
                : 'text-gray-500'
            }`}>
              {checkboxLabel}
              {!checkboxEnabled && (
                <span className="block text-xs text-yellow-400 mt-1 font-semibold">
                  ⚠️ Please scroll to the end to read all content
                </span>
              )}
              {checkboxEnabled && !checkboxChecked && (
                <span className="block text-xs text-green-400 mt-1 font-semibold">
                  ✅ Checkbox enabled. Please check to accept.
                </span>
              )}
              {checkboxEnabled && checkboxChecked && (
                <span className="block text-xs text-green-400 mt-1 font-semibold">
                  ✅ Accepted
                </span>
              )}
              {process.env.NODE_ENV === 'development' && (
                <span className="block text-xs mt-1" style={{ color: checkboxEnabled ? 'green' : 'red' }}>
                  Debug Status: {checkboxEnabled ? '✅ Enabled' : '❌ Disabled'}
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
  const [mounted, setMounted] = useState(false)
  const [hipaaAccepted, setHipaaAccepted, removeHipaaAccepted] = useLocalStorage(HIPAA_KEY)
  const [ppAccepted, setPpAccepted, removePpAccepted] = useLocalStorage(PP_KEY)
  const [touAccepted, setTouAccepted, removeTouAccepted] = useLocalStorage(TOU_KEY)
  const [showHipaa, setShowHipaa] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const scrollPositionRef = useRef<number>(0)

  // クライアント側でのみマウントされたことを確認（Hydration errorを防ぐため）
  useEffect(() => {
    setMounted(true)
  }, [])

  // 自動表示が有効な場合のみ、同意状態をチェックして自動表示
  // HIPAA → Privacy Policy → Terms of Condition の順
  // 一度承諾したら次回からは表示しない（開発環境でも同様）
  useEffect(() => {
    if (!autoShow || !mounted) return

    const hasHipaa = !!hipaaAccepted
    const hasPP = !!ppAccepted
    const hasToU = !!touAccepted

    if (!hasHipaa) {
      setShowHipaa(true)
    } else if (!hasPP) {
      setShowPrivacy(true)
    } else if (!hasToU) {
      setShowTerms(true)
    }
  }, [hipaaAccepted, ppAccepted, touAccepted, autoShow, mounted])

  // モーダルを開く関数をグローバルに公開（親コンポーネントから呼び出し可能にする）
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).openHipaaModal = () => {
        setShowHipaa(true)
      }
      (window as any).openPrivacyModal = () => {
        setShowPrivacy(true)
      }
      (window as any).openTermsModal = () => {
        setShowTerms(true)
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).openHipaaModal
        delete (window as any).openPrivacyModal
        delete (window as any).openTermsModal
      }
    }
  }, [])

  const handleHipaaAccept = () => {
    setHipaaAccepted(new Date().toISOString())
    setShowHipaa(false)
    // Privacy Policyモーダルを少し遅延して開く
    setTimeout(() => {
      setShowPrivacy(true)
    }, 100)
  }

  const handleHipaaDecline = () => {
    alert(t.modals.declineMessage || 'You must accept the HIPAA disclaimer to use this service.')
    // You can customize this behavior (redirect, disable app, etc.)
  }

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

  // いずれかのモーダルが開いている時に背景のスクロールを無効化
  useEffect(() => {
    const anyModalOpen = showHipaa || showPrivacy || showTerms
    
    if (anyModalOpen) {
      // 最初のモーダルが開く時にスクロール位置を保存
      if (scrollPositionRef.current === 0) {
        scrollPositionRef.current = window.scrollY
      }
      // bodyのoverflowをhiddenにしてスクロールを無効化
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollPositionRef.current}px`
      document.body.style.width = '100%'
    } else {
      // すべてのモーダルが閉じている時にスクロールを復元
      const savedScrollY = scrollPositionRef.current
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      // スクロール位置を復元
      if (savedScrollY > 0) {
        window.scrollTo(0, savedScrollY)
        scrollPositionRef.current = 0
      }
    }
  }, [showHipaa, showPrivacy, showTerms])

  // クライアント側でマウントされるまで何も表示しない（Hydration errorを防ぐため）
  if (!mounted) {
    return null
  }

  return (
    <>
      {/* HIPAA Modal */}
      <Modal
        isOpen={showHipaa}
        onClose={() => setShowHipaa(false)}
        onAccept={handleHipaaAccept}
        onDecline={handleHipaaDecline}
        title={translations.en.hipaa.title}
        badge="HIPAA"
        checkboxLabel="I have read and understand the HIPAA Disclaimer"
        acceptLabel="Accept"
        declineLabel="Decline"
        content={
          <HipaaModalContent />
        }
      />

      {/* Privacy Policy Modal */}
      <Modal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        onAccept={handlePrivacyAccept}
        onDecline={handlePrivacyDecline}
        title={translations.en.modals.privacyTitle}
        badge="Privacy"
        checkboxLabel={translations.en.modals.privacyCheckboxLabel}
        acceptLabel="Accept"
        declineLabel="Decline"
        content={
          <div>
            <p className="mb-4">{translations.en.modals.privacyEnglishText1}</p>
            <p className="mb-4">{translations.en.modals.privacyEnglishText2}</p>
            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-white">{translations.en.modals.dataCategories}</h3>
              <p className="mb-2">{translations.en.modals.dataCategoriesDesc}</p>
            </section>
            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-white">{translations.en.modals.yourRights}</h3>
              <p className="mb-2">{translations.en.modals.yourRightsDesc}</p>
            </section>
            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-white">{translations.en.modals.dataSecurity}</h3>
              <p className="mb-2">{translations.en.modals.dataSecurityDesc}</p>
            </section>
            <section className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-white">{translations.en.modals.yourRightsHIPAA}</h3>
              <p className="mb-2">{translations.en.modals.yourRightsHIPAADesc}</p>
            </section>
            <p className="text-gray-400 text-sm mt-6 mb-4">
              {translations.en.modals.disagreeMessage}
            </p>
            <p className="mt-8 mb-0">— {translations.en.modals.endOfPrivacy} —</p>
          </div>
        }
      />

      <Modal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={handleTermsAccept}
        onDecline={handleTermsDecline}
        title={translations.en.modals.termsTitle}
        badge="Terms"
        checkboxLabel={translations.en.modals.termsCheckboxLabel}
        acceptLabel="Accept"
        declineLabel="Decline"
        content={
          <div>
            <p className="mb-4">{translations.en.modals.termsEnglishText1}</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                <strong>{translations.en.modals.acceptableUse}:</strong>{' '}
                {translations.en.modals.acceptableUseDesc}
              </li>
              <li>
                <strong>{translations.en.modals.contentOwnership}:</strong>{' '}
                {translations.en.modals.contentOwnershipDesc}
              </li>
              <li>
                <strong>{translations.en.modals.limitationOfLiability}:</strong>{' '}
                {translations.en.modals.limitationOfLiabilityDesc}
              </li>
              <li>
                <strong>{translations.en.modals.changes}:</strong> {translations.en.modals.changesDesc}
              </li>
              <li>
                <strong>{translations.en.modals.governingLaw}:</strong>{' '}
                {translations.en.modals.governingLawDesc}
              </li>
            </ul>
            <p className="text-gray-400 text-sm mt-6 mb-4">
              {translations.en.modals.disagreeMessage}
            </p>
            <p className="mt-8 mb-0">— {translations.en.modals.endOfTerms} —</p>
          </div>
        }
      />

    </>
  )
}

