'use client'

import { useLocale } from '@/contexts/LocaleContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { RegisterForm } from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  const { locale } = useLocale()

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <RegisterForm />
      </main>
      <Footer />
    </div>
  )
}
