'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from '@/contexts/LocaleContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PropertySearch } from '@/components/properties/PropertySearch'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  MapPin,
  TrendingUp,
  Users,
  Home,
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  Shield,
  Award,
  Clock,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Property, PropertyImage } from '@/lib/types/database'

const heroImages = [
  'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920',
]

const stats = [
  { icon: Home, value: '500+', labelAr: 'عقار متاح', labelEn: 'Available Properties' },
  { icon: Users, value: '1000+', labelAr: 'عميل سعيد', labelEn: 'Happy Clients' },
  { icon: Building2, value: '50+', labelAr: 'منطقة تغطيها', labelEn: 'Areas Covered' },
  { icon: Award, value: '15+', labelAr: 'سنوات خبرة', labelEn: 'Years Experience' },
]

const propertyTypes = [
  {
    type: 'apartment',
    image: 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=600',
    titleAr: 'شقق',
    titleEn: 'Apartments',
    count: '250+',
  },
  {
    type: 'land',
    image: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=600',
    titleAr: 'أراضي',
    titleEn: 'Lands',
    count: '180+',
  },
  {
    type: 'building',
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600',
    titleAr: 'مباني',
    titleEn: 'Buildings',
    count: '70+',
  },
]

const testimonials = [
  {
    name: 'أحمد محمد',
    nameEn: 'Ahmad Mohammed',
    text: 'خدمة ممتازة! وجدت شقة أحلامي في أقل من أسبوع.',
    textEn: 'Excellent service! Found my dream apartment in less than a week.',
  },
  {
    name: 'سارة علي',
    nameEn: 'Sara Ali',
    text: 'أفضل منصة عقارية في الأردن.',
    textEn: 'Best real estate platform in Jordan.',
  },
]

export default function HomePage() {
  const { locale } = useLocale()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [featuredProperties, setFeaturedProperties] = useState<(Property & { images: PropertyImage[] })[]>([])
  const [latestProperties, setLatestProperties] = useState<(Property & { images: PropertyImage[] })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data: featured } = await supabase
          .from('properties')
          .select('*, images:property_images(*)')
          .eq('featured', true)
          .eq('status', 'available')
          .limit(6)
          .order('created_at', { ascending: false })

        if (featured) setFeaturedProperties(featured)

        const { data: latest } = await supabase
          .from('properties')
          .select('*, images:property_images(*)')
          .eq('status', 'available')
          .limit(8)
          .order('created_at', { ascending: false })

        if (latest) setLatestProperties(latest)
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {heroImages.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={src}
              alt="Real Estate Hero"
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          </div>
        ))}

        <div className="relative z-10 container px-4 mx-auto text-center text-white">
          <Badge className="mb-6 bg-primary/20 text-white border-white/20 text-sm px-4 py-2">
            {locale === 'ar' ? 'أفضل منصة عقارية في الأردن' : 'Best Real Estate Platform in Jordan'}
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            {locale === 'ar' ? (
              <>
                اعثر على <span className="text-primary">عقارك المثالي</span>
                <br />
                في الأردن
              </>
            ) : (
              <>
                Find Your <span className="text-primary">Perfect Property</span>
                <br />
                in Jordan
              </>
            )}
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto">
            {locale === 'ar'
              ? 'آلاف العقارات المعروضة للبيع والإيجار في جميع المحافظات الأردنية'
              : 'Thousands of properties for sale and rent across all Jordan governorates'}
          </p>

          <div className="relative z-20">
            <PropertySearch variant="hero" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.labelAr} className="text-center">
                <stat.icon className="h-10 w-10 mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm opacity-80">
                  {locale === 'ar' ? stat.labelAr : stat.labelEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {locale === 'ar' ? 'تصفح حسب نوع العقار' : 'Browse by Property Type'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {locale === 'ar'
                ? 'اختر نوع العقار الذي تبحث عنه واستكشف الخيارات المتاحة'
                : 'Select the property type you are looking for'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {propertyTypes.map((item) => (
              <Link
                key={item.type}
                href={locale === 'ar' ? `/properties?type=${item.type}` : `/en/properties?type=${item.type}`}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden"
              >
                <Image
                  src={item.image}
                  alt={locale === 'ar' ? item.titleAr : item.titleEn}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {locale === 'ar' ? item.titleAr : item.titleEn}
                  </h3>
                  <Badge variant="secondary">{item.count}</Badge>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">
                {locale === 'ar' ? 'عقارات مميزة' : 'Featured Properties'}
              </h2>
              <p className="text-muted-foreground mt-2">
                {locale === 'ar' ? 'أفضل العقارات المختارة لك' : 'Best selected properties for you'}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href={locale === 'ar' ? '/properties' : '/en/properties'}>
                {locale === 'ar' ? 'عرض الكل' : 'View All'}
                {locale === 'ar' ? <ArrowLeft className="ms-2 h-4 w-4" /> : <ArrowRight className="ms-2 h-4 w-4" />}
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                {locale === 'ar' ? 'لا توجد عقارات مميزة حالياً' : 'No featured properties available'}
              </p>
            </Card>
          )}
        </div>
      </section>

      {/* Latest Properties */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">
                {locale === 'ar' ? 'أحدث العقارات' : 'Latest Properties'}
              </h2>
              <p className="text-muted-foreground mt-2">
                {locale === 'ar' ? 'آخر العقارات المضافة' : 'Recently added properties'}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href={locale === 'ar' ? '/properties' : '/en/properties'}>
                {locale === 'ar' ? 'عرض الكل' : 'View All'}
                {locale === 'ar' ? <ArrowLeft className="ms-2 h-4 w-4" /> : <ArrowRight className="ms-2 h-4 w-4" />}
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : latestProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                {locale === 'ar' ? 'لا توجد عقارات حالياً' : 'No properties available'}
              </p>
            </Card>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {locale === 'ar' ? 'لماذا تختارنا؟' : 'Why Choose Us?'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {locale === 'ar'
                ? 'نقدم خدمات عقارية متميزة'
                : 'We provide distinguished real estate services'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                titleAr: 'موثوقية عالية',
                titleEn: 'High Reliability',
                descAr: 'نتحقق من جميع العقارات',
                descEn: 'We verify all properties',
              },
              {
                icon: Clock,
                titleAr: 'دعم على مدار الساعة',
                titleEn: '24/7 Support',
                descAr: 'فريق دعم متاح دائماً',
                descEn: 'Support team always available',
              },
              {
                icon: MapPin,
                titleAr: 'تغطية شاملة',
                titleEn: 'Wide Coverage',
                descAr: 'عقارات في جميع المحافظات',
                descEn: 'Properties across all governorates',
              },
              {
                icon: TrendingUp,
                titleAr: 'أسعار منافسة',
                titleEn: 'Competitive Prices',
                descAr: 'أفضل الأسعار في السوق',
                descEn: 'Best prices in the market',
              },
            ].map((item) => (
              <Card key={item.titleAr} className="text-center p-6">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {locale === 'ar' ? item.titleAr : item.titleEn}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {locale === 'ar' ? item.descAr : item.descEn}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {locale === 'ar' ? 'ماذا يقول عملاؤنا' : 'What Our Clients Say'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-0">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mb-4 text-white/90">
                    "{locale === 'ar' ? testimonial.text : testimonial.textEn}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-semibold">
                      {(locale === 'ar' ? testimonial.name : testimonial.nameEn).charAt(0)}
                    </div>
                    <div className="ms-3">
                      <p className="font-semibold">{locale === 'ar' ? testimonial.name : testimonial.nameEn}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="relative rounded-2xl overflow-hidden">
            <Image
              src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920"
              alt="CTA Background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10 p-8 md:p-16 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {locale === 'ar' ? 'هل تبحث عن عقار؟' : 'Looking for a Property?'}
              </h2>
              <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
                {locale === 'ar'
                  ? 'تواصل معنا الآن وسنساعدك في العثور على عقارك المثالي'
                  : 'Contact us now and we will help you find your perfect property'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href={locale === 'ar' ? '/properties' : '/en/properties'}>
                    {locale === 'ar' ? 'تصفح العقارات' : 'Browse Properties'}
                    {locale === 'ar' ? <ArrowLeft className="ms-2 h-5 w-5" /> : <ArrowRight className="ms-2 h-5 w-5" />}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-black" asChild>
                  <a href="https://wa.me/962791234567" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="me-2 h-5 w-5" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
