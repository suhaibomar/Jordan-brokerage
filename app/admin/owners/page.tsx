'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLocale } from '@/contexts/LocaleContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Search, Phone, Building, User, MoreHorizontal, Pencil, Trash, Eye } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Owner } from '@/lib/types/database'

export default function AdminOwnersPage() {
  const { isAdmin, isLoading: authLoading } = useAuth()
  const { locale } = useLocale()
  const router = useRouter()
  const [owners, setOwners] = useState<(Owner & { property_count?: number })[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    alternative_phone: '',
    email: '',
    address: '',
    notes: '',
  })

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/')
    }
  }, [authLoading, isAdmin, router])

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
          .from('owners')
          .select('*')
          .order('created_at', { ascending: false })

        if (!error && data) {
          // Get property count for each owner
          const ownersWithCount = await Promise.all(
            data.map(async (owner: Owner) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const { count } = await (supabase as any)
                .from('properties')
                .select('*', { count: 'exact', head: true })
                .eq('owner_id', owner.id)
              return { ...owner, property_count: count || 0 }
            })
          )
          setOwners(ownersWithCount)
        }
      } catch (error) {
        console.error('Error fetching owners:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isAdmin) {
      fetchOwners()
    }
  }, [isAdmin])

  const handleAddOwner = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from('owners').insert([formData])
      if (!error) {
        setIsAddDialogOpen(false)
        setFormData({ name: '', phone: '', alternative_phone: '', email: '', address: '', notes: '' })
        // Refresh list
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data } = await (supabase as any).from('owners').select('*').order('created_at', { ascending: false })
        if (data) setOwners(data)
      }
    } catch (error) {
      console.error('Error adding owner:', error)
    }
  }

  const handleDelete = async (ownerId: string) => {
    if (confirm(locale === 'ar' ? 'هل أنت متأكد من حذف هذا المالك؟' : 'Delete this owner?')) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from('owners').delete().eq('id', ownerId)
      if (!error) {
        setOwners((prev) => prev.filter((o) => o.id !== ownerId))
      }
    }
  }

  const filteredOwners = owners.filter((owner) =>
    owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    owner.phone.includes(searchQuery)
  )

  if (authLoading || !isAdmin) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>
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
          <Link href="/admin/properties" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted">{locale === 'ar' ? 'العقارات' : 'Properties'}</Link>
          <Link href="/admin/owners" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground">{locale === 'ar' ? 'الملاك' : 'Owners'}</Link>
          <Link href="/admin/customers" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted">{locale === 'ar' ? 'العملاء' : 'Customers'}</Link>
        </div>
      </aside>

      <main className="ms-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">{locale === 'ar' ? 'إدارة الملاك' : 'Owner Management'}</h1>
              <p className="text-muted-foreground mt-1">{locale === 'ar' ? 'قائمة ملاك العقارات' : 'Property owners list'}</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="me-2 h-4 w-4" />
                  {locale === 'ar' ? 'إضافة مالك' : 'Add Owner'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{locale === 'ar' ? 'إضافة مالك جديد' : 'Add New Owner'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>{locale === 'ar' ? 'الاسم' : 'Name'} *</Label>
                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>{locale === 'ar' ? 'رقم الهاتف' : 'Phone'} *</Label>
                    <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>{locale === 'ar' ? 'رقم هاتف بديل' : 'Alternative Phone'}</Label>
                    <Input value={formData.alternative_phone} onChange={(e) => setFormData({ ...formData, alternative_phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
                    <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>{locale === 'ar' ? 'العنوان' : 'Address'}</Label>
                    <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                  </div>
                  <Button onClick={handleAddOwner} className="w-full" disabled={!formData.name || !formData.phone}>
                    {locale === 'ar' ? 'إضافة' : 'Add Owner'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={locale === 'ar' ? 'بحث عن مالك...' : 'Search owners...'} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pr-10" />
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div>
              ) : filteredOwners.length === 0 ? (
                <div className="p-12 text-center">
                  <User className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground">{locale === 'ar' ? 'لا يوجد ملاك' : 'No owners found'}</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{locale === 'ar' ? 'الاسم' : 'Name'}</TableHead>
                      <TableHead>{locale === 'ar' ? 'الهاتف' : 'Phone'}</TableHead>
                      <TableHead>{locale === 'ar' ? 'البريد' : 'Email'}</TableHead>
                      <TableHead>{locale === 'ar' ? 'العقارات' : 'Properties'}</TableHead>
                      <TableHead>{locale === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOwners.map((owner) => (
                      <TableRow key={owner.id}>
                        <TableCell className="font-medium">{owner.name}</TableCell>
                        <TableCell>
                          <a href={`tel:${owner.phone}`} className="flex items-center gap-1 hover:text-primary">
                            <Phone className="h-4 w-4" />
                            {owner.phone}
                          </a>
                        </TableCell>
                        <TableCell>{owner.email || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{owner.property_count} {locale === 'ar' ? 'عقار' : 'properties'}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={owner.status === 'active' ? 'bg-success text-white' : 'bg-muted'}>{owner.status === 'active' ? (locale === 'ar' ? 'نشط' : 'Active') : (locale === 'ar' ? 'غير نشط' : 'Inactive')}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(owner.id)}>
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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
