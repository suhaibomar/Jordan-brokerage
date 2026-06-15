'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLocale } from '@/contexts/LocaleContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Building2,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Heart,
  Moon,
  Sun,
  Globe,
  ChevronDown,
  Plus,
} from 'lucide-react'
import { useTheme } from 'next-themes'

const navigation = {
  ar: [
    { name: 'الرئيسية', href: '/' },
    { name: 'العقارات', href: '/properties' },
    { name: 'الشقق', href: '/properties?type=apartment' },
    { name: 'الأراضي', href: '/properties?type=land' },
    { name: 'المباني', href: '/properties?type=building' },
    { name: 'اتصل بنا', href: '/contact' },
  ],
  en: [
    { name: 'Home', href: '/' },
    { name: 'Properties', href: '/en/properties' },
    { name: 'Apartments', href: '/en/properties?type=apartment' },
    { name: 'Lands', href: '/en/properties?type=land' },
    { name: 'Buildings', href: '/en/properties?type=building' },
    { name: 'Contact', href: '/en/contact' },
  ],
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isAdmin, signOut } = useAuth()
  const { locale, setLocale, t, isRTL } = useLocale()
  const { theme, setTheme } = useTheme()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  const toggleLanguage = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar'
    setLocale(newLocale)
    // Update path for language
    const newPath = pathname === '/'
      ? (newLocale === 'ar' ? '/' : '/en')
      : pathname.replace(/^\/(ar|en)?/, newLocale === 'ar' ? '' : '/en')
    window.location.href = newPath || '/'
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between px-4 mx-auto">
        {/* Logo */}
        <Link href={locale === 'ar' ? '/' : '/en'} className="flex items-center space-x-2 rtl:space-x-reverse">
          <Building2 className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {locale === 'ar' ? 'عقارات الأردن' : 'Jordan Real Estate'}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {navigation[locale].slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Language toggle */}
          <Button variant="ghost" size="icon" onClick={toggleLanguage}>
            <Globe className="h-5 w-5" />
            <span className="sr-only">Toggle language</span>
          </Button>

          {/* Auth buttons or user menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="hidden md:inline-block font-medium">
                    {user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="w-56">
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href={locale === 'ar' ? '/admin' : '/en/admin'} className="flex items-center">
                        <Settings className="me-2 h-4 w-4" />
                        {locale === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={locale === 'ar' ? '/admin/properties/new' : '/en/admin/properties/new'} className="flex items-center">
                        <Plus className="me-2 h-4 w-4" />
                        {locale === 'ar' ? 'إضافة عقار' : 'Add Property'}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link href={locale === 'ar' ? '/favorites' : '/en/favorites'} className="flex items-center">
                    <Heart className="me-2 h-4 w-4" />
                    {locale === 'ar' ? 'المفضلة' : 'Favorites'}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="me-2 h-4 w-4" />
                  {locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href={locale === 'ar' ? '/login' : '/en/login'}>
                  {locale === 'ar' ? 'تسجيل الدخول' : 'Login'}
                </Link>
              </Button>
              <Button asChild>
                <Link href={locale === 'ar' ? '/register' : '/en/register'}>
                  {locale === 'ar' ? 'إنشاء حساب' : 'Register'}
                </Link>
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side={isRTL ? 'left' : 'right'} className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <Link
                    href={locale === 'ar' ? '/' : '/en'}
                    className="flex items-center space-x-2 rtl:space-x-reverse"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Building2 className="h-6 w-6 text-primary" />
                    <span className="font-bold">
                      {locale === 'ar' ? 'عقارات الأردن' : 'Jordan Real Estate'}
                    </span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <nav className="flex flex-col space-y-4">
                  {navigation[locale].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-base font-medium transition-colors hover:text-primary ${
                        pathname === item.href
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto pb-8 space-y-4">
                  {!user && (
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" asChild className="w-full">
                        <Link href={locale === 'ar' ? '/login' : '/en/login'}>
                          {locale === 'ar' ? 'تسجيل الدخول' : 'Login'}
                        </Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link href={locale === 'ar' ? '/register' : '/en/register'}>
                          {locale === 'ar' ? 'إنشاء حساب' : 'Register'}
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
