'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLocale } from '@/contexts/LocaleContext'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Building2,
  Home,
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  Menu,
  X,
  LogOut,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

const navItems = [
  { icon: TrendingUp, labelAr: 'نظرة عامة', labelEn: 'Overview', href: '/admin' },
  { icon: Building2, labelAr: 'العقارات', labelEn: 'Properties', href: '/admin/properties' },
  { icon: Users, labelAr: 'الملاك', labelEn: 'Owners', href: '/admin/owners' },
  { icon: Users, labelAr: 'العملاء', labelEn: 'Customers', href: '/admin/customers' },
  { icon: Calendar, labelAr: 'المواعيد', labelEn: 'Appointments', href: '/admin/appointments' },
  { icon: MessageSquare, labelAr: 'الاستفسارات', labelEn: 'Inquiries', href: '/admin/inquiries' },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { isAdmin, isLoading: authLoading } = useAuth()
  const { locale } = useLocale()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
          <Button asChild>
            <Link href="/">{locale === 'ar' ? 'العودة للرئيسية' : 'Go Home'}</Link>
          </Button>
        </div>
      </div>
    )
  }

  const NavLinks = () => (
    <>
      {navItems.map((item) => {
        const isActive = pathname === item.href ||
          (item.href !== '/admin' && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{locale === 'ar' ? item.labelAr : item.labelEn}</span>
          </Link>
        )
      })}
    </>
  )

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 start-0 end-0 z-50 h-16 bg-card border-b flex items-center justify-between px-4">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-primary" />
                  <span className="font-bold">{locale === 'ar' ? 'عقارات الأردن' : 'Jordan RE'}</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <NavLinks />
              </nav>
              <div className="p-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  {locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="font-bold">{locale === 'ar' ? 'عقارات' : 'RE'}</span>
        </Link>

        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            {locale === 'ar' ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
          </Link>
        </Button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-0 start-0 z-40 w-64 h-screen flex-col bg-card border-e">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-bold">{locale === 'ar' ? 'عقارات الأردن' : 'Jordan RE'}</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavLinks />
        </nav>
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ms-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  )
}
