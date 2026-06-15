'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useLocale } from '@/contexts/LocaleContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PropertyGallery } from '@/components/properties/PropertyGallery'
import { PropertyContactForm } from '@/components/properties/PropertyContactForm'
import { PropertyCard } from '@/components/properties/PropertyCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Building,
  Calendar,
  Share2,
  Heart,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Home,
  Building2,
  Sofa,
  Fan,
  Battery,
  Droplets,
  Car,
  Warehouse,
  Thermometer,
  ArrowUp,
  TreePine,
  Zap,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { PropertyWithDetails } from '@/lib/types/database'

const featureIcons: Record<string, React.ElementType> = {
  has_elevator: ArrowUp,
  has_parking: Car,
  has_storage: Warehouse,
  has_solar_system: Battery,
  has_water_well: Droplets,
  is_furnished: Sofa,
  has_air_conditioning: Fan,
  has_central_heating: Thermometer,
}

export default function PropertyDetailsPage() {
  const params = useParams()
  const propertyNumber = params.propertyNumber as string
  const { locale } = useLocale()
  const [property, setProperty] = useState<PropertyWithDetails | null>(null)
  const [similarProperties, setSimilarProperties] = useState<PropertyWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        // Fetch main property
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = supabase as any
        const { data, error } = await db
          .from('properties')
          .select(`
            *,
            images:property_images(*),
            videos:property_videos(*),
            owner:owners(*)
          `)
          .eq('property_number', propertyNumber)
          .maybeSingle()

        if (error) throw error

        if (data) {
          // Fetch type-specific details
          if (data.property_type === 'apartment') {
            const { data: apartment } = await db
              .from('apartments')
              .select('*')
              .eq('property_id', data.id)
              .maybeSingle()
            if (apartment) data.apartment = apartment
          } else if (data.property_type === 'land') {
            const { data: land } = await db
              .from('lands')
              .select('*')
              .eq('property_id', data.id)
              .maybeSingle()
            if (land) data.land = land
          } else if (data.property_type === 'building') {
            const { data: building } = await db
              .from('buildings')
              .select('*, floors:building_floors(*)')
              .eq('property_id', data.id)
              .maybeSingle()
            if (building) data.building = building
          }

          setProperty(data as PropertyWithDetails)

          // Track view
          await db.from('property_views').insert({
            property_id: data.id,
          })

          // Fetch similar properties
          const { data: similar } = await db
            .from('properties')
            .select('*, images:property_images(*)')
            .eq('status', 'available')
            .eq('property_type', data.property_type)
            .neq('id', data.id)
            .limit(4)

          if (similar) setSimilarProperties(similar as PropertyWithDetails[])
        }
      } catch (error) {
        console.error('Error fetching property:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [propertyNumber])

  const handleShare = async () => {
    const url = window.location.href
    const title = (locale === 'ar' ? property?.title_ar : property?.title_en) || property?.title_ar || ''

    if (navigator.share) {
      await navigator.share({ title, url })
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return locale === 'ar'
        ? `${(price / 1000000).toFixed(1)} مليون`
        : `${(price / 1000000).toFixed(1)}M JOD`
    } else if (price >= 1000) {
      return locale === 'ar'
        ? `${(price / 1000).toFixed(0)} ألف`
        : `${(price / 1000).toFixed(0)}K JOD`
    }
    return price.toLocaleString() + ' JOD'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-muted/30 py-8">
          <div className="container px-4 mx-auto">
            <div className="aspect-video bg-muted rounded-lg animate-pulse mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
              </div>
              <div className="h-96 bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Building className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <h1 className="text-2xl font-bold mb-2">
              {locale === 'ar' ? 'العقار غير موجود' : 'Property Not Found'}
            </h1>
            <p className="text-muted-foreground mb-6">
              {locale === 'ar'
                ? 'لم نتمكن من العثور على هذا العقار'
                : "We couldn't find this property"}
            </p>
            <Button asChild>
              <a href={locale === 'ar' ? '/properties' : '/en/properties'}>
                {locale === 'ar' ? 'تصفح العقارات' : 'Browse Properties'}
              </a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const title = locale === 'ar' ? property.title_ar : (property.title_en || property.title_ar)
  const description = locale === 'ar' ? property.description_ar : (property.description_en || property.description_ar)

  const statusColors = {
    available: 'bg-success text-white',
    sold: 'bg-destructive text-white',
    rented: 'bg-warning text-white',
    archived: 'bg-muted text-muted-foreground',
    pending: 'bg-primary text-white',
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="container px-4 py-8 mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <a href={locale === 'ar' ? '/' : '/en'} className="hover:text-primary">
              {locale === 'ar' ? 'الرئيسية' : 'Home'}
            </a>
            <span>/</span>
            <a href={locale === 'ar' ? '/properties' : '/en/properties'} className="hover:text-primary">
              {locale === 'ar' ? 'العقارات' : 'Properties'}
            </a>
            <span>/</span>
            <span className="text-foreground">{property.property_number}</span>
          </nav>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Gallery */}
              <PropertyGallery images={property.images} videos={property.videos} />

              {/* Title and Actions */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={statusColors[property.status]}>
                      {locale === 'ar'
                        ? property.status === 'available' ? 'متاح' : property.status === 'sold' ? 'مباع' : 'مؤجر'
                        : property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </Badge>
                    <Badge variant="outline">
                      {property.property_type === 'apartment' && (locale === 'ar' ? 'شقة' : 'Apartment')}
                      {property.property_type === 'land' && (locale === 'ar' ? 'أرض' : 'Land')}
                      {property.property_type === 'building' && (locale === 'ar' ? 'مبنى' : 'Building')}
                    </Badge>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 me-1" />
                    <span>
                      {property.governorate}, {property.city}
                      {property.district && `, ${property.district}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    {copied ? <Check className="h-4 w-4 text-success" /> : <Share2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant={isFavorite ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </div>

              {/* Price */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-3xl font-bold text-primary">
                        {formatPrice(property.price)}
                      </span>
                      {property.price_type !== 'total' && (
                        <span className="text-muted-foreground text-sm me-2">
                          {property.price_type === 'per_meter' && (locale === 'ar' ? '/ م²' : '/ m²')}
                          {property.price_type === 'per_dunum' && (locale === 'ar' ? '/ دونم' : '/ Dunum')}
                        </span>
                      )}
                    </div>
                    {property.negotiable && (
                      <Badge variant="secondary">
                        {locale === 'ar' ? 'قابل للتفاوض' : 'Negotiable'}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Details Tabs */}
              <Tabs defaultValue="details">
                <TabsList className="w-full">
                  <TabsTrigger value="details" className="flex-1">
                    {locale === 'ar' ? 'التفاصيل' : 'Details'}
                  </TabsTrigger>
                  <TabsTrigger value="features" className="flex-1">
                    {locale === 'ar' ? 'المميزات' : 'Features'}
                  </TabsTrigger>
                  <TabsTrigger value="location" className="flex-1">
                    {locale === 'ar' ? 'الموقع' : 'Location'}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      {/* Apartment Details */}
                      {property.property_type === 'apartment' && property.apartment && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{locale === 'ar' ? 'المساحة' : 'Area'}</p>
                            <p className="font-semibold">{property.apartment.area} {locale === 'ar' ? 'م²' : 'm²'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{locale === 'ar' ? 'غرف نوم' : 'Bedrooms'}</p>
                            <p className="font-semibold">{property.apartment.bedrooms}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{locale === 'ar' ? 'حمامات' : 'Bathrooms'}</p>
                            <p className="font-semibold">{property.apartment.bathrooms}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{locale === 'ar' ? 'الطابق' : 'Floor'}</p>
                            <p className="font-semibold">{property.apartment.apartment_floor || '-'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{locale === 'ar' ? 'مطابخ' : 'Kitchens'}</p>
                            <p className="font-semibold">{property.apartment.kitchens}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{locale === 'ar' ? 'غرف معيشة' : 'Living Rooms'}</p>
                            <p className="font-semibold">{property.apartment.living_rooms}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{locale === 'ar' ? 'شرفات' : 'Balconies'}</p>
                            <p className="font-semibold">{property.apartment.balconies}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{locale === 'ar' ? 'عمر المبنى' : 'Building Age'}</p>
                            <p className="font-semibold">{property.apartment.building_age || '-'} {locale === 'ar' ? 'سنة' : 'years'}</p>
                          </div>
                        </div>
                      )}

                      {/* Land Details */}
                      {property.property_type === 'land' && property.land && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{locale === 'ar' ? 'المساحة' : 'Area'}</p>
                            <p className="font-semibold">{property.land.area_dunum} {locale === 'ar' ? 'دونم' : 'Dunum'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{locale === 'ar' ? 'سكني' : 'Residential'}</p>
                            <p className="font-semibold">{property.land.is_residential ? (locale === 'ar' ? 'نعم' : 'Yes') : (locale === 'ar' ? 'لا' : 'No')}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{locale === 'ar' ? 'تجاري' : 'Commercial'}</p>
                            <p className="font-semibold">{property.land.is_commercial ? (locale === 'ar' ? 'نعم' : 'Yes') : (locale === 'ar' ? 'لا' : 'No')}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{locale === 'ar' ? 'زراعي' : 'Agricultural'}</p>
                            <p className="font-semibold">{property.land.is_agricultural ? (locale === 'ar' ? 'نعم' : 'Yes') : (locale === 'ar' ? 'لا' : 'No')}</p>
                          </div>
                        </div>
                      )}

                      {/* Building Details */}
                      {property.property_type === 'building' && property.building && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{locale === 'ar' ? 'مساحة البناء' : 'Building Area'}</p>
                            <p className="font-semibold">{property.building.building_area} {locale === 'ar' ? 'م²' : 'm²'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{locale === 'ar' ? 'مساحة الأرض' : 'Land Area'}</p>
                            <p className="font-semibold">{property.building.land_area || '-'} {locale === 'ar' ? 'م²' : 'm²'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{locale === 'ar' ? 'عدد الطوابق' : 'Total Floors'}</p>
                            <p className="font-semibold">{property.building.total_floors}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{locale === 'ar' ? 'عمر المبنى' : 'Building Age'}</p>
                            <p className="font-semibold">{property.building.building_age || '-'} {locale === 'ar' ? 'سنة' : 'years'}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="features" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      {property.property_type === 'apartment' && property.apartment ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(featureIcons).map(([key, Icon]) => {
                            const value = property.apartment?.[key as keyof typeof property.apartment]
                            if (typeof value === 'boolean') {
                              return (
                                <div
                                  key={key}
                                  className={`flex items-center gap-2 p-3 rounded-lg ${
                                    value ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                                  }`}
                                >
                                  <Icon className="h-5 w-5" />
                                  <span className="text-sm">
                                    {locale === 'ar'
                                      ? key.replace('has_', '').replace('is_', '').replace(/_/g, ' ')
                                      : key.replace('has_', '').replace('is_', '').replace(/_/g, ' ')}
                                  </span>
                                </div>
                              )
                            }
                            return null
                          })}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">
                          {locale === 'ar' ? 'لا توجد مميزات إضافية' : 'No additional features'}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="location" className="mt-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          <p>{property.full_address || `${property.governorate}, ${property.city}${property.district ? `, ${property.district}` : ''}`}</p>
                        </div>

                        {property.google_maps_link ? (
                          <a
                            href={property.google_maps_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                              <span className="text-primary">
                                {locale === 'ar' ? 'فتح في خرائط جوجل' : 'Open in Google Maps'}
                              </span>
                            </div>
                          </a>
                        ) : property.latitude && property.longitude ? (
                          <a
                            href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                              <span className="text-primary">
                                {locale === 'ar' ? 'عرض الخريطة' : 'View Map'}
                              </span>
                            </div>
                          </a>
                        ) : (
                          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                            <span className="text-muted-foreground">
                              {locale === 'ar' ? 'الموقع غير متاح' : 'Location not available'}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Description */}
              {description && (
                <Card>
                  <CardHeader>
                    <CardTitle>{locale === 'ar' ? 'الوصف' : 'Description'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-line">{description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Property Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{locale === 'ar' ? 'رقم العقار:' : 'Property ID:'} {property.property_number}</span>
                    <span>
                      {locale === 'ar' ? 'تاريخ الإضافة:' : 'Added:'}{' '}
                      {new Date(property.created_at).toLocaleDateString(locale === 'ar' ? 'ar-JO' : 'en-US')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Contact */}
            <div className="space-y-6">
              <PropertyContactForm
                propertyId={property.id}
                propertyNumber={property.property_number}
                contactNumber={property.public_contact_number || '+962791234567'}
              />

              {/* Quick Actions */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <Button className="w-full" variant="outline" asChild>
                    <a href={`tel:${property.public_contact_number || '+962791234567'}`}>
                      <Phone className="me-2 h-4 w-4" />
                      {locale === 'ar' ? 'اتصل الآن' : 'Call Now'}
                    </a>
                  </Button>
                  <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                    <a
                      href={`https://wa.me/${(property.public_contact_number || '+962791234567').replace(/\D/g, '')}?text=${encodeURIComponent(
                        locale === 'ar'
                          ? `مرحباً، أنا مهتم بالعقار رقم ${property.property_number}`
                          : `Hi, I'm interested in property ${property.property_number}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="me-2 h-4 w-4" />
                      WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Similar Properties */}
          {similarProperties.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-6">
                {locale === 'ar' ? 'عقارات مشابهة' : 'Similar Properties'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProperties.map((p) => (
                  <PropertyCard key={p.id} property={{ ...p, images: p.images ?? [] }} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
