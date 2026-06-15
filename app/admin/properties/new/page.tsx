'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLocale } from '@/contexts/LocaleContext'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, ArrowRight, Save, Loader2, MapPin, ExternalLink } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

const jordanGovernorates = [
  'عمان', 'إربد', 'الزرقاء', 'الكرك', 'معان', 'العقبة', 'جرش', 'المفرق', 'البلقاء', 'مادبا', 'الطفيلة', 'عجلون'
]

export default function NewPropertyPage() {
  const { isAdmin } = useAuth()
  const { locale } = useLocale()
  const router = useRouter()
  const [propertyType, setPropertyType] = useState<'apartment' | 'land' | 'building'>('apartment')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title_ar: '',
    title_en: '',
    description_ar: '',
    description_en: '',
    governorate: '',
    city: '',
    district: '',
    full_address: '',
    google_maps_url: '',
    latitude: '',
    longitude: '',
    price: '',
    price_type: 'total',
    negotiable: false,
    listing_type: 'sale' as 'sale' | 'rent' | 'both',
    owner_id: '',
    public_contact_number: '',
    internal_notes: '',
    featured: false,
  })

  const [apartmentData, setApartmentData] = useState({
    area: '',
    building_age: '',
    building_floors: '',
    apartment_floor: '',
    bedrooms: '',
    bathrooms: '',
    kitchens: '',
    living_rooms: '',
    balconies: '',
    has_elevator: false,
    has_parking: false,
    has_storage: false,
    has_solar_system: false,
    has_water_well: false,
    is_furnished: false,
    has_air_conditioning: false,
    has_central_heating: false,
    monthly_service_fees: '',
  })

  const [landData, setLandData] = useState({
    area_dunum: '',
    is_residential: false,
    is_commercial: false,
    is_agricultural: false,
    is_industrial: false,
    has_water: false,
    has_electricity: false,
    has_sewer: false,
    has_road_access: false,
  })

  const [buildingData, setBuildingData] = useState({
    land_area: '',
    building_area: '',
    building_age: '',
    total_floors: '',
    has_roof: false,
    has_yard: false,
    has_parking: false,
    has_separate_storage: false,
  })

  const validateGoogleMapsUrl = (url: string): boolean => {
    if (!url) return true
    const patterns = [
      /^https?:\/\/(www\.)?google\.com\/maps\/.+/,
      /^https?:\/\/maps\.google\.com\/.+/,
      /^https?:\/\/goo\.gl\/maps\/.+/,
      /^https?:\/\/(www\.)?google\.[a-z]+\/maps\/.+/,
    ]
    return patterns.some(p => p.test(url))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.google_maps_url && !validateGoogleMapsUrl(formData.google_maps_url)) {
      toast.error(locale === 'ar' ? 'رابط خرائط جوجل غير صحيح' : 'Invalid Google Maps URL')
      return
    }

    setIsSubmitting(true)

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: property, error: propError } = await (supabase as any)
        .from('properties')
        .insert([{
          property_type: propertyType,
          title_ar: formData.title_ar,
          title_en: formData.title_en || null,
          description_ar: formData.description_ar || null,
          description_en: formData.description_en || null,
          governorate: formData.governorate,
          city: formData.city,
          district: formData.district || null,
          full_address: formData.full_address || null,
          google_maps_link: formData.google_maps_url || null,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          price: parseFloat(formData.price),
          price_type: formData.price_type,
          negotiable: formData.negotiable,
          listing_type: formData.listing_type,
          owner_id: formData.owner_id || null,
          public_contact_number: formData.public_contact_number || null,
          internal_notes: formData.internal_notes || null,
          featured: formData.featured,
          status: 'available',
        }])
        .select()
        .single()

      if (propError) throw propError

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const supabaseAny = supabase as any
      if (propertyType === 'apartment' && property) {
        await supabaseAny.from('apartments').insert([{
          property_id: property.id,
          area: parseFloat(apartmentData.area),
          building_age: apartmentData.building_age ? parseInt(apartmentData.building_age) : null,
          building_floors: apartmentData.building_floors ? parseInt(apartmentData.building_floors) : null,
          apartment_floor: apartmentData.apartment_floor ? parseInt(apartmentData.apartment_floor) : null,
          bedrooms: parseInt(apartmentData.bedrooms) || 0,
          bathrooms: parseInt(apartmentData.bathrooms) || 0,
          kitchens: parseInt(apartmentData.kitchens) || 1,
          living_rooms: parseInt(apartmentData.living_rooms) || 1,
          balconies: parseInt(apartmentData.balconies) || 0,
          has_elevator: apartmentData.has_elevator,
          has_parking: apartmentData.has_parking,
          has_storage: apartmentData.has_storage,
          has_solar_system: apartmentData.has_solar_system,
          has_water_well: apartmentData.has_water_well,
          is_furnished: apartmentData.is_furnished,
          has_air_conditioning: apartmentData.has_air_conditioning,
          has_central_heating: apartmentData.has_central_heating,
          monthly_service_fees: apartmentData.monthly_service_fees ? parseFloat(apartmentData.monthly_service_fees) : null,
        }])
      } else if (propertyType === 'land' && property) {
        await supabaseAny.from('lands').insert([{
          property_id: property.id,
          area_dunum: parseFloat(landData.area_dunum),
          is_residential: landData.is_residential,
          is_commercial: landData.is_commercial,
          is_agricultural: landData.is_agricultural,
          is_industrial: landData.is_industrial,
          has_water: landData.has_water,
          has_electricity: landData.has_electricity,
          has_sewer: landData.has_sewer,
          has_road_access: landData.has_road_access,
        }])
      } else if (propertyType === 'building' && property) {
        await supabaseAny.from('buildings').insert([{
          property_id: property.id,
          land_area: buildingData.land_area ? parseFloat(buildingData.land_area) : null,
          building_area: parseFloat(buildingData.building_area),
          building_age: buildingData.building_age ? parseInt(buildingData.building_age) : null,
          total_floors: parseInt(buildingData.total_floors),
          has_roof: buildingData.has_roof,
          has_yard: buildingData.has_yard,
          has_parking: buildingData.has_parking,
          has_separate_storage: buildingData.has_separate_storage,
        }])
      }

      toast.success(locale === 'ar' ? 'تم إضافة العقار بنجاح' : 'Property added successfully')
      router.push('/admin/properties')
    } catch (error: unknown) {
      console.error('Error adding property:', error)
      toast.error(locale === 'ar' ? 'حدث خطأ' : 'Error adding property')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/properties">
              {locale === 'ar' ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">{locale === 'ar' ? 'إضافة عقار جديد' : 'Add New Property'}</h1>
            <p className="text-muted-foreground mt-1">{locale === 'ar' ? 'أدخل بيانات العقار' : 'Enter property details'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Property Type Selection */}
          <Card className="mb-6">
            <CardHeader><CardTitle className="text-lg">{locale === 'ar' ? 'نوع العقار' : 'Property Type'}</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 lg:gap-4">
                {(['apartment', 'land', 'building'] as const).map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={propertyType === type ? 'default' : 'outline'}
                    onClick={() => setPropertyType(type)}
                    className="text-sm lg:text-base"
                  >
                    {type === 'apartment' && (locale === 'ar' ? 'شقة' : 'Apartment')}
                    {type === 'land' && (locale === 'ar' ? 'أرض' : 'Land')}
                    {type === 'building' && (locale === 'ar' ? 'مبنى' : 'Building')}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tabs for sections */}
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="w-full grid grid-cols-4 h-auto">
              <TabsTrigger value="basic" className="text-xs lg:text-sm">{locale === 'ar' ? 'معلومات أساسية' : 'Basic'}</TabsTrigger>
              <TabsTrigger value="location" className="text-xs lg:text-sm">{locale === 'ar' ? 'الموقع' : 'Location'}</TabsTrigger>
              <TabsTrigger value="details" className="text-xs lg:text-sm">{locale === 'ar' ? 'التفاصيل' : 'Details'}</TabsTrigger>
              <TabsTrigger value="media" className="text-xs lg:text-sm">{locale === 'ar' ? 'الصور' : 'Media'}</TabsTrigger>
            </TabsList>

            {/* Basic Info */}
            <TabsContent value="basic">
              <Card>
                <CardContent className="p-4 lg:p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{locale === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'} *</Label>
                      <Input value={formData.title_ar} onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>{locale === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Label>
                      <Input value={formData.title_en} onChange={(e) => setFormData({ ...formData, title_en: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{locale === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}</Label>
                      <Textarea rows={3} value={formData.description_ar} onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>{locale === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}</Label>
                      <Textarea rows={3} value={formData.description_en} onChange={(e) => setFormData({ ...formData, description_en: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>{locale === 'ar' ? 'السعر' : 'Price'} *</Label>
                      <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>{locale === 'ar' ? 'نوع السعر' : 'Price Type'}</Label>
                      <Select value={formData.price_type} onValueChange={(v) => setFormData({ ...formData, price_type: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="total">{locale === 'ar' ? 'الإجمالي' : 'Total'}</SelectItem>
                          <SelectItem value="per_meter">{locale === 'ar' ? 'للمتر' : '/ m2'}</SelectItem>
                          <SelectItem value="per_dunum">{locale === 'ar' ? 'للدونم' : '/ Dunum'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 col-span-2 lg:col-span-1">
                      <Label>{locale === 'ar' ? 'نوع العرض' : 'Listing Type'}</Label>
                      <Select value={formData.listing_type} onValueChange={(v) => setFormData({ ...formData, listing_type: v as typeof formData.listing_type })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sale">{locale === 'ar' ? 'للبيع' : 'For Sale'}</SelectItem>
                          <SelectItem value="rent">{locale === 'ar' ? 'للإيجار' : 'For Rent'}</SelectItem>
                          <SelectItem value="both">{locale === 'ar' ? 'كلاهما' : 'Both'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox id="negotiable" checked={formData.negotiable} onCheckedChange={(c) => setFormData({ ...formData, negotiable: !!c })} />
                      <Label htmlFor="negotiable" className="text-sm">{locale === 'ar' ? 'قابل للتفاوض' : 'Negotiable'}</Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox id="featured" checked={formData.featured} onCheckedChange={(c) => setFormData({ ...formData, featured: !!c })} />
                      <Label htmlFor="featured" className="text-sm">{locale === 'ar' ? 'مميز' : 'Featured'}</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Location */}
            <TabsContent value="location">
              <Card>
                <CardContent className="p-4 lg:p-6 space-y-4">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>{locale === 'ar' ? 'المحافظة' : 'Governorate'} *</Label>
                      <Select value={formData.governorate} onValueChange={(v) => setFormData({ ...formData, governorate: v })}>
                        <SelectTrigger><SelectValue placeholder={locale === 'ar' ? 'اختر...' : 'Select...'} /></SelectTrigger>
                        <SelectContent>
                          {jordanGovernorates.map((g) => (
                            <SelectItem key={g} value={g}>{g}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{locale === 'ar' ? 'المدينة' : 'City'} *</Label>
                      <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label>{locale === 'ar' ? 'المنطقة' : 'District'}</Label>
                      <Input value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{locale === 'ar' ? 'العنوان الكامل' : 'Full Address'}</Label>
                    <Input value={formData.full_address} onChange={(e) => setFormData({ ...formData, full_address: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {locale === 'ar' ? 'رابط خرائط جوجل' : 'Google Maps URL'}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.google_maps_url}
                        onChange={(e) => setFormData({ ...formData, google_maps_url: e.target.value })}
                        placeholder="https://maps.google.com/..."
                        className="flex-1"
                      />
                      {formData.google_maps_url && (
                        <Button type="button" variant="outline" size="icon" asChild>
                          <a href={formData.google_maps_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {locale === 'ar'
                        ? 'انسخ رابط الموقع من خرائط جوجل وألصقه هنا'
                        : 'Paste the Google Maps location link here'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{locale === 'ar' ? 'خط العرض' : 'Latitude'}</Label>
                      <Input type="number" step="0.00000001" value={formData.latitude} onChange={(e) => setFormData({ ...formData, latitude: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>{locale === 'ar' ? 'خط الطول' : 'Longitude'}</Label>
                      <Input type="number" step="0.00000001" value={formData.longitude} onChange={(e) => setFormData({ ...formData, longitude: e.target.value })} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Details */}
            <TabsContent value="details">
              <Card>
                <CardContent className="p-4 lg:p-6">
                  {propertyType === 'apartment' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2"><Label>{locale === 'ar' ? 'المساحة (م²)' : 'Area (m²)'} *</Label><Input type="number" value={apartmentData.area} onChange={(e) => setApartmentData({ ...apartmentData, area: e.target.value })} required /></div>
                        <div className="space-y-2"><Label>{locale === 'ar' ? 'غرف نوم' : 'Bedrooms'}</Label><Input type="number" value={apartmentData.bedrooms} onChange={(e) => setApartmentData({ ...apartmentData, bedrooms: e.target.value })} /></div>
                        <div className="space-y-2"><Label>{locale === 'ar' ? 'حمامات' : 'Bathrooms'}</Label><Input type="number" value={apartmentData.bathrooms} onChange={(e) => setApartmentData({ ...apartmentData, bathrooms: e.target.value })} /></div>
                        <div className="space-y-2"><Label>{locale === 'ar' ? 'الطابق' : 'Floor'}</Label><Input type="number" value={apartmentData.apartment_floor} onChange={(e) => setApartmentData({ ...apartmentData, apartment_floor: e.target.value })} /></div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t">
                        {[{ key: 'has_elevator', ar: 'مصعد' }, { key: 'has_parking', ar: 'موقف' }, { key: 'has_storage', ar: 'مخزن' }, { key: 'has_solar_system', ar: 'طاقة شمسية' }, { key: 'is_furnished', ar: 'مفروش' }, { key: 'has_air_conditioning', ar: 'تكييف' }].map((f) => (
                          <div key={f.key} className="flex items-center space-x-2 space-x-reverse">
                            <Checkbox id={f.key} checked={apartmentData[f.key as keyof typeof apartmentData] as boolean} onCheckedChange={(c) => setApartmentData({ ...apartmentData, [f.key]: !!c })} />
                            <Label htmlFor={f.key} className="text-sm">{locale === 'ar' ? f.ar : f.key.replace(/_/g, ' ')}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {propertyType === 'land' && (
                    <div className="space-y-4">
                      <div className="space-y-2"><Label>{locale === 'ar' ? 'المساحة (دونم)' : 'Area (Dunum)'} *</Label><Input type="number" step="0.01" value={landData.area_dunum} onChange={(e) => setLandData({ ...landData, area_dunum: e.target.value })} required /></div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t">
                        {[{ key: 'is_residential', ar: 'سكني' }, { key: 'is_commercial', ar: 'تجاري' }, { key: 'is_agricultural', ar: 'زراعي' }, { key: 'has_water', ar: 'ماء' }, { key: 'has_electricity', ar: 'كهرباء' }, { key: 'has_road_access', ar: 'طريق' }].map((f) => (
                          <div key={f.key} className="flex items-center space-x-2 space-x-reverse">
                            <Checkbox id={f.key} checked={landData[f.key as keyof typeof landData] as boolean} onCheckedChange={(c) => setLandData({ ...landData, [f.key]: !!c })} />
                            <Label htmlFor={f.key} className="text-sm">{locale === 'ar' ? f.ar : f.key.replace(/_/g, ' ')}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {propertyType === 'building' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2"><Label>{locale === 'ar' ? 'مساحة البناء' : 'Build Area'} *</Label><Input type="number" value={buildingData.building_area} onChange={(e) => setBuildingData({ ...buildingData, building_area: e.target.value })} required /></div>
                        <div className="space-y-2"><Label>{locale === 'ar' ? 'مساحة الأرض' : 'Land Area'}</Label><Input type="number" value={buildingData.land_area} onChange={(e) => setBuildingData({ ...buildingData, land_area: e.target.value })} /></div>
                        <div className="space-y-2"><Label>{locale === 'ar' ? 'عدد الطوابق' : 'Floors'} *</Label><Input type="number" value={buildingData.total_floors} onChange={(e) => setBuildingData({ ...buildingData, total_floors: e.target.value })} required /></div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t">
                        {[{ key: 'has_roof', ar: 'سطح' }, { key: 'has_yard', ar: 'حوش' }, { key: 'has_parking', ar: 'موقف' }].map((f) => (
                          <div key={f.key} className="flex items-center space-x-2 space-x-reverse">
                            <Checkbox id={f.key} checked={buildingData[f.key as keyof typeof buildingData] as boolean} onCheckedChange={(c) => setBuildingData({ ...buildingData, [f.key]: !!c })} />
                            <Label htmlFor={f.key} className="text-sm">{locale === 'ar' ? f.ar : f.key.replace(/_/g, ' ')}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Media */}
            <TabsContent value="media">
              <Card>
                <CardContent className="p-4 lg:p-6">
                  <div className="text-center py-8 text-muted-foreground">
                    <p>{locale === 'ar' ? 'يمكنك إضافة الصور بعد حفظ العقار' : 'You can add images after saving the property'}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => router.push('/admin/properties')} className="w-full sm:w-auto">
              {locale === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.title_ar || !formData.governorate || !formData.city || !formData.price} className="w-full sm:w-auto">
              {isSubmitting ? <><Loader2 className="me-2 h-4 w-4 animate-spin" />{locale === 'ar' ? 'جاري الحفظ...' : 'Saving...'}</> : <><Save className="me-2 h-4 w-4" />{locale === 'ar' ? 'حفظ العقار' : 'Save Property'}</>}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
