'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLocale } from '@/contexts/LocaleContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, LogIn } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Property, PropertyImage, Favorite } from '@/lib/types/database'

export default function FavoritesPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { locale } = useLocale()
  const [favorites, setFavorites] = useState<(Favorite & { properties: Property & { images: PropertyImage[] } })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      supabase
        .from('favorites')
        .select('*, properties(*, images:property_images(*))')
        .eq('user_id', user.id)
        .then(({ data }) => {
          if (data) setFavorites(data as typeof favorites)
          setLoading(false)
        })
    }
  }, [user])

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-12 pb-8 px-6">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-6" />
              <h2 className="text-2xl font-bold mb-2">{locale === 'ar' ? 'سجل الدخول للمفضلة' : 'Login for Favorites'}</h2>
              <p className="text-muted-foreground mb-6">{locale === 'ar' ? 'يجب تسجيل الدخول لحفظ العقارات' : 'Please login to save your favorite properties'}</p>
              <Button asChild className="w-full">
                <Link href={locale === 'ar' ? '/login' : '/en/login'}>
                  <LogIn className="me-2 h-4 w-4" />
                  {locale === 'ar' ? 'تسجيل الدخول' : 'Login'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 py-12">
        <div className="container px-4 mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{locale === 'ar' ? 'العقارات المفضلة' : 'Favorite Properties'}</h1>
            <p className="text-muted-foreground mt-1">{locale === 'ar' ? `${favorites.length} عقار محفوظ` : `${favorites.length} saved properties`}</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="aspect-[4/3] bg-muted rounded-lg animate-pulse" />)}
            </div>
          ) : favorites.length === 0 ? (
            <Card className="p-12 text-center">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{locale === 'ar' ? 'لا توجد عقارات مفضلة' : 'No Favorites Yet'}</h3>
              <p className="text-muted-foreground mb-6">{locale === 'ar' ? 'ابدأ بإضافة عقارات للمفضلة' : 'Start adding properties to your favorites'}</p>
              <Button asChild><Link href={locale === 'ar' ? '/properties' : '/en/properties'}>{locale === 'ar' ? 'تصفح العقارات' : 'Browse Properties'}</Link></Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((fav) => <PropertyCard key={fav.id} property={fav.properties} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
