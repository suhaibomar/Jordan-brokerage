'use client'

import Link from 'next/link'
import { useLocale } from '@/contexts/LocaleContext'
import { Separator } from '@/components/ui/separator'
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
} from 'lucide-react'

export function Footer() {
  const { locale, t } = useLocale()
  const isRTL = locale === 'ar'

  const footerLinks = {
    properties: [
      { name: locale === 'ar' ? 'شقق للبيع' : 'Apartments for Sale', href: '/properties?type=apartment&listing=sale' },
      { name: locale === 'ar' ? 'شقق للإيجار' : 'Apartments for Rent', href: '/properties?type=apartment&listing=rent' },
      { name: locale === 'ar' ? 'أراضي للبيع' : 'Lands for Sale', href: '/properties?type=land' },
      { name: locale === 'ar' ? 'مباني للبيع' : 'Buildings for Sale', href: '/properties?type=building' },
    ],
    areas: [
      { name: locale === 'ar' ? 'عمّان' : 'Amman', href: '/properties?governorate=amman' },
      { name: locale === 'ar' ? 'إربد' : 'Irbid', href: '/properties?governorate=irbid' },
      { name: locale === 'ar' ? 'الزرقاء' : 'Zarqa', href: '/properties?governorate=zarqa' },
      { name: locale === 'ar' ? 'العقبة' : 'Aqaba', href: '/properties?governorate=aqaba' },
    ],
    quickLinks: [
      { name: locale === 'ar' ? 'من نحن' : 'About Us', href: '/about' },
      { name: locale === 'ar' ? 'اتصل بنا' : 'Contact', href: '/contact' },
      { name: locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy', href: '/privacy' },
      { name: locale === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions', href: '/terms' },
    ],
  }

  return (
    <footer className="bg-card border-t">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href={locale === 'ar' ? '/' : '/en'} className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">
                {locale === 'ar' ? 'عقارات الأردن' : 'Jordan Real Estate'}
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              {locale === 'ar'
                ? 'شريكك الموثوق في العقارات في الأردن. نقدم لك أفضل العقارات للبيع والإيجار في جميع المحافظات.'
                : 'Your trusted real estate partner in Jordan. We offer the best properties for sale and rent across all governorates.'}
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/962791234567"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-green-600 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Properties */}
          <div>
            <h3 className="font-semibold mb-4">
              {locale === 'ar' ? 'العقارات' : 'Properties'}
            </h3>
            <ul className="space-y-3">
              {footerLinks.properties.map((link) => (
                <li key={link.href}>
                  <Link
                    href={locale === 'ar' ? link.href : `/en${link.href}`}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h3 className="font-semibold mb-4">
              {locale === 'ar' ? 'المحافظات' : 'Governorates'}
            </h3>
            <ul className="spac e-y-3">
              {footerLinks.areas.map((link) => (
                <li key={link.href}>
                  <Link
                    href={locale === 'ar' ? link.href : `/en${link.href}`}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">
              {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href="tel:+962791234567" className="hover:text-primary transition-colors">
                  +962 79 123 4567
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@jordan-realestate.com" className="hover:text-primary transition-colors">
                  info@jordan-realestate.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  {locale === 'ar'
                    ? 'عمّان، الأردن - شارع الملكة رانيا'
                    : 'Amman, Jordan - Queen Rania Street'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {locale === 'ar' ? 'عقارات الأردن. جميع الحقوق محفوظة.' : 'Jordan Real Estate. All Rights Reserved.'}
          </p>
          <div className="flex items-center gap-4">
            {footerLinks.quickLinks.map((link) => (
              <Link
                key={link.href}
                href={locale === 'ar' ? link.href : `/en${link.href}`}
                className="hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
