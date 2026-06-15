import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jordan-realestate.com'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Fetch all properties for dynamic routes
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: properties } = await (supabase as any)
      .from('properties')
      .select('property_number, updated_at')
      .neq('status', 'archived')

    const propertyPages = (properties || []).map((property: { property_number: string; updated_at: string }) => ({
      url: `${baseUrl}/property/${property.property_number}`,
      lastModified: new Date(property.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [...staticPages, ...propertyPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
