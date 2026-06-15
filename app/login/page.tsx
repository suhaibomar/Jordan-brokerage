'use client'

import { useLocale } from '@/contexts/LocaleContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  const { locale } = useLocale()

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <LoginForm />
      </main>
      <Footer />
    </div>
  )
}
