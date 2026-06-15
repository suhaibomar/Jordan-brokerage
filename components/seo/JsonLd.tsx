import Script from 'next/script'

interface PropertyJsonLdProps {
  property: {
    property_number: string
    title_ar: string
    title_en?: string | null
    description_ar?: string | null
    description_en?: string | null
    price: number
    governorate: string
    city: string
    district?: string | null
    full_address?: string | null
    property_type: 'apartment' | 'land' | 'building'
    listing_type: 'sale' | 'rent' | 'both'
    created_at: string
    images: { url: string; is_primary: boolean }[]
  }
}

export function PropertyJsonLd({ property }: PropertyJsonLdProps) {
  const primaryImage = property.images.find(img => img.is_primary) || property.images[0]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    '@id': `#property-${property.property_number}`,
    name: property.title_ar,
    description: property.description_ar,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'JOD',
      availability: 'https://schema.org/InStock',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'JO',
      addressRegion: property.governorate,
      addressLocality: property.city,
      streetAddress: property.district || property.city,
    },
    image: primaryImage?.url,
    datePosted: property.created_at,
    housingApplication: ['apartment', 'building'].includes(property.property_type) ? {
      '@type': 'Apartment',
      numberOfRooms: property.property_type === 'apartment' ? 3 : undefined,
    } : undefined,
  }

  return (
    <Script
      id={`property-schema-${property.property_number}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface OrganizationJsonLdProps {
  locale: 'ar' | 'en'
}

export function OrganizationJsonLd({ locale }: OrganizationJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: locale === 'ar' ? 'عقارات الأردن' : 'Jordan Real Estate',
    description: locale === 'ar' ? 'منصة عقارية رائدة في الأردن' : 'Leading real estate platform in Jordan',
    url: 'https://jordan-realestate.com',
    logo: 'https://jordan-realestate.com/logo.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Queen Rania Street',
      addressLocality: 'Amman',
      addressCountry: 'JO',
    },
    telephone: '+962791234567',
    email: 'info@jordan-realestate.com',
    areaServed: {
      '@type': 'Country',
      name: 'Jordan',
    },
    sameAs: [
      'https://facebook.com/jordanrealestate',
      'https://instagram.com/jordanrealestate',
    ],
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

interface WebsiteJsonLdProps {
  locale: 'ar' | 'en'
}

export function WebsiteJsonLd({ locale }: WebsiteJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: locale === 'ar' ? 'عقارات الأردن' : 'Jordan Real Estate',
    url: 'https://jordan-realestate.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://jordan-realestate.com/properties?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
