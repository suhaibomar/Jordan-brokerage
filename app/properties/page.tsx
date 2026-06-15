'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLocale } from '@/contexts/LocaleContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { PropertySearch } from '@/components/properties/PropertySearch'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Grid, List, Building } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Property, PropertyImage } from '@/lib/types/database'

function PropertyListContent() {
  const searchParams = useSearchParams()
  const { locale } = useLocale()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('newest')
  const [properties, setProperties] = useState<(Property & { images: PropertyImage[] })[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const type = searchParams.get('type') || ''
  const governorate = searchParams.get('governorate') || ''
  const listing = searchParams.get('listing') || ''
  const q = searchParams.get('q') || ''
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      try {
        let query = supabase
          .from('properties')
          .select('*, images:property_images(*)', { count: 'exact' })
          .eq('status', 'available')

        if (type) {
          query = query.eq('property_type', type)
        }
        if (governorate) {
          query = query.ilike('governorate', `%${governorate}%`)
        }
        if (listing) {
          query = query.eq('listing_type', listing)
        }
        if (q) {
          query = query.or(`title_ar.ilike.%${q}%,title_en.ilike.%${q}%,city.ilike.%${q}%,district.ilike.%${q}%`)
        }
        if (minPrice) {
          query = query.gte('price', parseFloat(minPrice))
        }
        if (maxPrice) {
          query = query.lte('price', parseFloat(maxPrice))
        }

        // Sorting
        switch (sortBy) {
          case 'price_high':
            query = query.order('price', { ascending: false })
            break
          case 'price_low':
            query = query.order('price', { ascending: true })
            break
          case 'most_viewed':
            query = query.order('view_count', { ascending: false })
            break
          default:
            query = query.order('created_at', { ascending: false })
        }

        const { data, count, error } = await query.limit(50)

        if (!error && data) {
          setProperties(data)
          setTotal(count || 0)
        }
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [type, governorate, listing, q, minPrice, maxPrice, sortBy])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container px-4 py-8 mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {locale === 'ar' ? 'العقارات' : 'Properties'}
            </h1>
            <p className="text-muted-foreground">
              {!loading && `${total} ${locale === 'ar' ? 'عقار' : 'properties'}`}
            </p>
          </div>

          {/* Search & Filters */}
          <div className="mb-8">
            <PropertySearch />
          </div>

          {/* Active Filters */}
          {(type || governorate || listing) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {type && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString())
                    params.delete('type')
                    window.location.href = `?${params.toString()}`
                  }}
                >
                  {locale === 'ar'
                    ? type === 'apartment' ? 'شقة' : type === 'land' ? 'أرض' : 'مبنى'
                    : type.charAt(0).toUpperCase() + type.slice(1)}
                  <span className="ms-2">×</span>
                </Button>
              )}
              {governorate && (
                <Button variant="secondary" size="sm">
                  {governorate}
                  <span className="ms-2">×</span>
                </Button>
              )}
              {listing && (
                <Button variant="secondary" size="sm">
                  {locale === 'ar'
                    ? listing === 'sale' ? 'للبيع' : 'للإيجار'
                    : listing === 'sale' ? 'For Sale' : 'For Rent'}
                  <span className="ms-2">×</span>
                </Button>
              )}
            </div>
          )}

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={locale === 'ar' ? 'ترتيب حسب' : 'Sort by'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{locale === 'ar' ? 'الأحدث' : 'Newest'}</SelectItem>
                <SelectItem value="price_high">{locale === 'ar' ? 'السعر: الأعلى' : 'Price: High to Low'}</SelectItem>
                <SelectItem value="price_low">{locale === 'ar' ? 'السعر: الأدنى' : 'Price: Low to High'}</SelectItem>
                <SelectItem value="most_viewed">{locale === 'ar' ? 'الأكثر مشاهدة' : 'Most Viewed'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Building className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-xl font-semibold mb-2">
                {locale === 'ar' ? 'لا توجد عقارات' : 'No Properties Found'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {locale === 'ar'
                  ? 'لم نتمكن من العثور على عقارات تطابق معايير البحث'
                  : "We couldn't find any properties matching your criteria"}
              </p>
              <Button asChild>
                <a href={locale === 'ar' ? '/properties' : '/en/properties'}>
                  {locale === 'ar' ? 'عرض جميع العقارات' : 'View All Properties'}
                </a>
              </Button>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PropertyListContent />
    </Suspense>
  )
}
