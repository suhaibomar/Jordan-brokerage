'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from '@/contexts/LocaleContext'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Heart,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Building,
  Share2,
} from 'lucide-react'
import type { Property, PropertyImage } from '@/lib/types/database'

interface PropertyCardProps {
  property: Property & { images: PropertyImage[] }
  showFavoriteButton?: boolean
}

export function PropertyCard({ property, showFavoriteButton = true }: PropertyCardProps) {
  const { locale, t } = useLocale()
  const { user } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageError, setImageError] = useState(false)

  const primaryImage = property.images.find(img => img.is_primary) || property.images[0]
  const title = locale === 'ar' ? property.title_ar : (property.title_en || property.title_ar)

  const statusColors = {
    available: 'bg-success text-white',
    sold: 'bg-destructive text-white',
    rented: 'bg-warning text-white',
    archived: 'bg-muted text-muted-foreground',
    pending: 'bg-primary text-white',
  }

  const propertyTypeLabels = {
    apartment: locale === 'ar' ? 'شقة' : 'Apartment',
    land: locale === 'ar' ? 'أرض' : 'Land',
    building: locale === 'ar' ? 'مبنى' : 'Building',
  }

  const listingLabels = {
    sale: locale === 'ar' ? 'للبيع' : 'For Sale',
    rent: locale === 'ar' ? 'للإيجار' : 'For Rent',
    both: locale === 'ar' ? 'للبيع والإيجار' : 'For Sale & Rent',
  }

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return locale === 'ar'
        ? `${(price / 1000000).toFixed(1)} مليون`
        : `${(price / 1000000).toFixed(1)}M`
    } else if (price >= 1000) {
      return locale === 'ar'
        ? `${(price / 1000).toFixed(0)} ألف`
        : `${(price / 1000).toFixed(0)}K`
    }
    return price.toLocaleString()
  }

  const propertyHref = locale === 'ar' ? `/property/${property.property_number}` : `/en/property/${property.property_number}`

  return (
    <Card className="group overflow-hidden property-card-hover">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={propertyHref}>
          {primaryImage && !imageError ? (
            <Image
              src={primaryImage.url}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Building className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}
        </Link>

        {/* Status Badge */}
        <Badge
          className={`absolute top-3 ${locale === 'ar' ? 'right-3' : 'left-3'} ${statusColors[property.status]}`}
        >
          {t.status[property.status]}
        </Badge>

        {/* Listing Type Badge */}
        <Badge
          variant="outline"
          className={`absolute top-3 ${locale === 'ar' ? 'left-3' : 'right-3'} bg-background/80 backdrop-blur-sm`}
        >
          {listingLabels[property.listing_type]}
        </Badge>

        {/* Favorite Button */}
        {showFavoriteButton && user && (
          <Button
            variant="ghost"
            size="icon"
            className={`absolute bottom-3 ${locale === 'ar' ? 'left-3' : 'right-3'} bg-background/80 backdrop-blur-sm hover:bg-background`}
            onClick={(e) => {
              e.preventDefault()
              setIsFavorite(!isFavorite)
            }}
          >
            <Heart
              className={`h-5 w-5 ${isFavorite ? 'fill-destructive text-destructive' : 'text-foreground'}`}
            />
          </Button>
        )}

        {/* Share Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute bottom-3 ${locale === 'ar' ? 'right-3' : 'left-3'} bg-background/80 backdrop-blur-sm hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity`}
          onClick={(e) => {
            e.preventDefault()
            if (navigator.share) {
              navigator.share({
                title,
                url: window.location.origin + propertyHref,
              })
            }
          }}
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Content Section */}
      <CardContent className="p-4">
        {/* Type Badge */}
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">{propertyTypeLabels[property.property_type]}</Badge>
        </div>

        {/* Title */}
        <Link href={propertyHref}>
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>

        {/* Location */}
        <div className="flex items-center text-muted-foreground text-sm mb-3">
          <MapPin className="h-4 w-4 me-1 flex-shrink-0" />
          <span className="line-clamp-1">
            {property.governorate}, {property.city}
            {property.district && ` - ${property.district}`}
          </span>
        </div>

        {/* Features - Only for apartments */}
        {property.property_type === 'apartment' && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              3
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              2
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <span className="text-xl font-bold text-primary">
              {formatPrice(property.price)}
            </span>
            <span className="text-sm text-muted-foreground ms-1">
              {locale === 'ar' ? 'د.أ' : 'JOD'}
            </span>
          </div>
          {property.negotiable && (
            <Badge variant="outline" className="text-xs">
              {locale === 'ar' ? 'قابل للتفاوض' : 'Negotiable'}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
