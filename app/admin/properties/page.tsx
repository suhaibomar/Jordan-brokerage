'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLocale } from '@/contexts/LocaleContext'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash,
  Archive,
  DollarSign,
  KeyRound,
  Building,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Property, PropertyImage } from '@/lib/types/database'

export default function AdminPropertiesPage() {
  const { isAdmin, isLoading: authLoading } = useAuth()
  const { locale } = useLocale()
  const router = useRouter()
  const [properties, setProperties] = useState<(Property & { images: PropertyImage[] })[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/')
    }
  }, [authLoading, isAdmin, router])

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        let query = supabase
          .from('properties')
          .select('*, images:property_images(*)')
          .order('created_at', { ascending: false })

        if (statusFilter) {
          query = query.eq('status', statusFilter)
        }
        if (typeFilter) {
          query = query.eq('property_type', typeFilter)
        }
        if (searchQuery) {
          query = query.or(`property_number.ilike.%${searchQuery}%,title_ar.ilike.%${searchQuery}%,title_en.ilike.%${searchQuery}%`)
        }

        const { data, error } = await query
        if (!error && data) {
          setProperties(data)
        }
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isAdmin) {
      fetchProperties()
    }
  }, [isAdmin, statusFilter, typeFilter, searchQuery])

  const handleStatusChange = async (propertyId: string, newStatus: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('properties')
      .update({ status: newStatus })
      .eq('id', propertyId)

    if (!error) {
      setProperties((prev) =>
        prev.map((p) => (p.id === propertyId ? { ...p, status: newStatus as Property['status'] } : p))
      )
    }
  }

  const handleDelete = async (propertyId: string) => {
    if (confirm(locale === 'ar' ? 'هل أنت متأكد من حذف هذا العقار؟' : 'Are you sure you want to delete this property?')) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('properties')
        .delete()
        .eq('id', propertyId)

      if (!error) {
        setProperties((prev) => prev.filter((p) => p.id !== propertyId))
      }
    }
  }

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed top-0 start-0 z-40 w-64 h-screen bg-card border-e">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="font-bold">{locale === 'ar' ? 'عقارات الأردن' : 'Jordan RE'}</span>
          </Link>
        </div>
        <div className="p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted">{locale === 'ar' ? 'نظرة عامة' : 'Overview'}</Link>
          <Link href="/admin/properties" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground">{locale === 'ar' ? 'العقارات' : 'Properties'}</Link>
          <Link href="/admin/owners" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted">{locale === 'ar' ? 'الملاك' : 'Owners'}</Link>
          <Link href="/admin/customers" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted">{locale === 'ar' ? 'العملاء' : 'Customers'}</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ms-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">{locale === 'ar' ? 'إدارة العقارات' : 'Property Management'}</h1>
              <p className="text-muted-foreground mt-1">
                {locale === 'ar' ? `${properties.length} عقار` : `${properties.length} properties`}
              </p>
            </div>
            <Button asChild>
              <Link href="/admin/properties/new">
                <Plus className="me-2 h-4 w-4" />
                {locale === 'ar' ? 'إضافة عقار' : 'Add Property'}
              </Link>
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={locale === 'ar' ? 'بحث عن عقار...' : 'Search properties...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={locale === 'ar' ? 'الحالة' : 'Status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{locale === 'ar' ? 'الكل' : 'All'}</SelectItem>
                <SelectItem value="available">{locale === 'ar' ? 'متاح' : 'Available'}</SelectItem>
                <SelectItem value="sold">{locale === 'ar' ? 'مباع' : 'Sold'}</SelectItem>
                <SelectItem value="rented">{locale === 'ar' ? 'مؤجر' : 'Rented'}</SelectItem>
                <SelectItem value="archived">{locale === 'ar' ? 'مؤرشف' : 'Archived'}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={locale === 'ar' ? 'النوع' : 'Type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{locale === 'ar' ? 'الكل' : 'All'}</SelectItem>
                <SelectItem value="apartment">{locale === 'ar' ? 'شقة' : 'Apartment'}</SelectItem>
                <SelectItem value="land">{locale === 'ar' ? 'أرض' : 'Land'}</SelectItem>
                <SelectItem value="building">{locale === 'ar' ? 'مبنى' : 'Building'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Properties Table */}
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : properties.length === 0 ? (
                <div className="p-12 text-center">
                  <Building className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">
                    {locale === 'ar' ? 'لا توجد عقارات' : 'No properties found'}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{locale === 'ar' ? 'العقار' : 'Property'}</TableHead>
                      <TableHead>{locale === 'ar' ? 'النوع' : 'Type'}</TableHead>
                      <TableHead>{locale === 'ar' ? 'الموقع' : 'Location'}</TableHead>
                      <TableHead>{locale === 'ar' ? 'السعر' : 'Price'}</TableHead>
                      <TableHead>{locale === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {properties.map((property) => {
                      const primaryImage = property.images.find((img) => img.is_primary) || property.images[0]
                      return (
                        <TableRow key={property.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {primaryImage ? (
                                <div className="relative w-16 h-12 rounded overflow-hidden">
                                  <Image src={primaryImage.url} alt="" fill className="object-cover" />
                                </div>
                              ) : (
                                <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                                  <Building className="h-6 w-6 text-muted-foreground/30" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium line-clamp-1">{property.title_ar}</p>
                                <p className="text-sm text-muted-foreground">{property.property_number}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {property.property_type === 'apartment' && (locale === 'ar' ? 'شقة' : 'Apartment')}
                              {property.property_type === 'land' && (locale === 'ar' ? 'أرض' : 'Land')}
                              {property.property_type === 'building' && (locale === 'ar' ? 'مبنى' : 'Building')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {property.governorate}, {property.city}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">
                              {property.price.toLocaleString()} {locale === 'ar' ? 'د.أ' : 'JOD'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                property.status === 'available'
                                  ? 'bg-success text-white'
                                  : property.status === 'sold'
                                  ? 'bg-destructive text-white'
                                  : property.status === 'rented'
                                  ? 'bg-warning text-white'
                                  : ''
                              }
                            >
                              {property.status === 'available' && (locale === 'ar' ? 'متاح' : 'Available')}
                              {property.status === 'sold' && (locale === 'ar' ? 'مباع' : 'Sold')}
                              {property.status === 'rented' && (locale === 'ar' ? 'مؤجر' : 'Rented')}
                              {property.status === 'archived' && (locale === 'ar' ? 'مؤرشف' : 'Archived')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/property/${property.property_number}`} target="_blank">
                                    <Eye className="me-2 h-4 w-4" />
                                    {locale === 'ar' ? 'عرض' : 'View'}
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/properties/${property.id}/edit`}>
                                    <Pencil className="me-2 h-4 w-4" />
                                    {locale === 'ar' ? 'تعديل' : 'Edit'}
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleStatusChange(property.id, 'sold')}>
                                  <DollarSign className="me-2 h-4 w-4" />
                                  {locale === 'ar' ? 'تمييز كمباع' : 'Mark as Sold'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(property.id, 'rented')}>
                                  <KeyRound className="me-2 h-4 w-4" />
                                  {locale === 'ar' ? 'تمييز كمؤجر' : 'Mark as Rented'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(property.id, 'archived')}>
                                  <Archive className="me-2 h-4 w-4" />
                                  {locale === 'ar' ? 'أرشفة' : 'Archive'}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDelete(property.id)}
                                >
                                  <Trash className="me-2 h-4 w-4" />
                                  {locale === 'ar' ? 'حذف' : 'Delete'}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
