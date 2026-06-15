'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale } from '@/contexts/LocaleContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card } from '@/components/ui/card'
import { Search, SlidersHorizontal, X } from 'lucide-react'

const governorates = [
  { value: 'amman', labelAr: 'عمّان', labelEn: 'Amman' },
  { value: 'irbid', labelAr: 'إربد', labelEn: 'Irbid' },
  { value: 'zarqa', labelAr: 'الزرقاء', labelEn: 'Zarqa' },
  { value: 'balqa', labelAr: 'البلقاء', labelEn: 'Al-Balqa' },
  { value: 'karak', labelAr: 'الكرك', labelEn: 'Karak' },
  { value: 'maan', labelAr: 'معان', labelEn: "Ma'an" },
  { value: 'madaba', labelAr: 'مادبا', labelEn: 'Madaba' },
  { value: 'jerash', labelAr: 'جرش', labelEn: 'Jerash' },
  { value: 'mafraq', labelAr: 'المفرق', labelEn: 'Mafraq' },
  { value: 'tafilah', labelAr: 'الطفيلة', labelEn: 'Tafilah' },
  { value: 'aqaba', labelAr: 'العقبة', labelEn: 'Aqaba' },
  { value: 'ajloun', labelAr: 'عجلون', labelEn: 'Ajloun' },
]

interface PropertySearchProps {
  variant?: 'hero' | 'inline'
}

export function PropertySearch({ variant = 'inline' }: PropertySearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { locale } = useLocale()

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')
  const [propertyType, setPropertyType] = useState(searchParams.get('type') || '')
  const [governorate, setGovernorate] = useState(searchParams.get('governorate') || '')
  const [listingType, setListingType] = useState(searchParams.get('listing') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('q', searchTerm)
    if (propertyType) params.set('type', propertyType)
    if (governorate) params.set('governorate', governorate)
    if (listingType) params.set('listing', listingType)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)

    const basePath = locale === 'ar' ? '/properties' : '/en/properties'
    router.push(`${basePath}?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setPropertyType('')
    setGovernorate('')
    setListingType('')
    setMinPrice('')
    setMaxPrice('')
    router.push(locale === 'ar' ? '/properties' : '/en/properties')
  }

  const hasActiveFilters = searchTerm || propertyType || governorate || listingType || minPrice || maxPrice

  if (variant === 'hero') {
    return (
      <Card className="w-full max-w-4xl mx-auto p-6 bg-background/80 backdrop-blur-lg border-0 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="md:col-span-4">
            <div className="relative">
              <Search className={`absolute ${locale === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground`} />
              <Input
                type="text"
                placeholder={locale === 'ar' ? 'ابحث عن عقار في أي مكان...' : 'Search for property anywhere...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${locale === 'ar' ? 'pr-10' : 'pl-10'} h-12 text-lg`}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>

          {/* Property Type */}
          <div>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder={locale === 'ar' ? 'نوع العقار' : 'Property Type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">{locale === 'ar' ? 'شقة' : 'Apartment'}</SelectItem>
                <SelectItem value="land">{locale === 'ar' ? 'أرض' : 'Land'}</SelectItem>
                <SelectItem value="building">{locale === 'ar' ? 'مبنى' : 'Building'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Governorate */}
          <div>
            <Select value={governorate} onValueChange={setGovernorate}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder={locale === 'ar' ? 'المحافظة' : 'Governorate'} />
              </SelectTrigger>
              <SelectContent>
                {governorates.map((gov) => (
                  <SelectItem key={gov.value} value={gov.value}>
                    {locale === 'ar' ? gov.labelAr : gov.labelEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Listing Type */}
          <div>
            <Select value={listingType} onValueChange={setListingType}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder={locale === 'ar' ? 'نوع العرض' : 'Listing Type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">{locale === 'ar' ? 'للبيع' : 'For Sale'}</SelectItem>
                <SelectItem value="rent">{locale === 'ar' ? 'للإيجار' : 'For Rent'}</SelectItem>
                <SelectItem value="both">{locale === 'ar' ? 'كلاهما' : 'Both'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <div>
            <Button
              onClick={handleSearch}
              className="w-full h-11 bg-primary hover:bg-primary/90"
            >
              <Search className="h-5 w-5 me-2" />
              {locale === 'ar' ? 'بحث' : 'Search'}
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className={`absolute ${locale === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
          <Input
            type="text"
            placeholder={locale === 'ar' ? 'ابحث عن عقار...' : 'Search properties...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={locale === 'ar' ? 'pr-10' : 'pl-10'}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4 me-2" />
          {locale === 'ar' ? 'بحث' : 'Search'}
        </Button>
      </div>

      {/* Advanced Filters */}
      <Accordion type="single" collapsible>
        <AccordionItem value="filters" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span>{locale === 'ar' ? 'فلاتر متقدمة' : 'Advanced Filters'}</span>
              {hasActiveFilters && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                  {locale === 'ar' ? 'مفعلة' : 'Active'}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              {/* Property Type */}
              <div className="space-y-2">
                <Label>{locale === 'ar' ? 'نوع العقار' : 'Property Type'}</Label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder={locale === 'ar' ? 'الكل' : 'All'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{locale === 'ar' ? 'الكل' : 'All'}</SelectItem>
                    <SelectItem value="apartment">{locale === 'ar' ? 'شقة' : 'Apartment'}</SelectItem>
                    <SelectItem value="land">{locale === 'ar' ? 'أرض' : 'Land'}</SelectItem>
                    <SelectItem value="building">{locale === 'ar' ? 'مبنى' : 'Building'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Governorate */}
              <div className="space-y-2">
                <Label>{locale === 'ar' ? 'المحافظة' : 'Governorate'}</Label>
                <Select value={governorate} onValueChange={setGovernorate}>
                  <SelectTrigger>
                    <SelectValue placeholder={locale === 'ar' ? 'الكل' : 'All'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{locale === 'ar' ? 'الكل' : 'All'}</SelectItem>
                    {governorates.map((gov) => (
                      <SelectItem key={gov.value} value={gov.value}>
                        {locale === 'ar' ? gov.labelAr : gov.labelEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Listing Type */}
              <div className="space-y-2">
                <Label>{locale === 'ar' ? 'نوع العرض' : 'Listing Type'}</Label>
                <Select value={listingType} onValueChange={setListingType}>
                  <SelectTrigger>
                    <SelectValue placeholder={locale === 'ar' ? 'الكل' : 'All'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{locale === 'ar' ? 'الكل' : 'All'}</SelectItem>
                    <SelectItem value="sale">{locale === 'ar' ? 'للبيع' : 'For Sale'}</SelectItem>
                    <SelectItem value="rent">{locale === 'ar' ? 'للإيجار' : 'For Rent'}</SelectItem>
                    <SelectItem value="both">{locale === 'ar' ? 'كلاهما' : 'Both'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label>{locale === 'ar' ? 'نطاق السعر' : 'Price Range'}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder={locale === 'ar' ? 'من' : 'Min'}
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full"
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    placeholder={locale === 'ar' ? 'إلى' : 'Max'}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  <X className="h-4 w-4 me-2" />
                  {locale === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
                </Button>
              )}
              <Button onClick={handleSearch}>
                {locale === 'ar' ? 'تطبيق' : 'Apply Filters'}
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
