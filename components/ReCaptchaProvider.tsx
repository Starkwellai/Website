'use client'

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { ReactNode, useEffect } from 'react'

interface ReCaptchaProviderProps {
  children: ReactNode
}

let hasWarned = false

export function ReCaptchaProvider({ children }: ReCaptchaProviderProps) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
  
  useEffect(() => {
    if (!siteKey && !hasWarned && process.env.NODE_ENV === 'development') {
      // 警告を1回だけ表示（チェックボックスのデバッグを妨げないように）
      console.warn('NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set. reCAPTCHA will not work. (This does not affect checkbox functionality)')
      hasWarned = true
    }
  }, [siteKey])
  
  if (!siteKey) {
    return <>{children}</>
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      language="en"
    >
      {children}
    </GoogleReCaptchaProvider>
  )
}
