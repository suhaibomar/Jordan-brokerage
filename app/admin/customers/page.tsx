'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLocale } from '@/contexts/LocaleContext'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Plus, Search, Phone, Building, User, Trash, Mail } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Customer } from '@/lib/types/database'

export default function AdminCustomersPage() {
  const { isAdmin, isLoading: authLoading } = useAuth()
  const { locale } = useLocale()
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', notes: '' })

  useEffect(() => {
    if (!authLoading && !isAdmin) router.push('/')
  }, [authLoading, isAdmin, router])

  useEffect(() => {
    if (isAdmin) {
      supabase.from('customers').select('*').order('created_at', { ascending: false })
        .then(({ data }) => { if (data) setCustomers(data); setLoading(false) })
    }
  }, [isAdmin])

  const handleAddCustomer = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('customers').insert([formData])
    if (!error) {
      setIsAddDialogOpen(false)
      setFormData({ name: '', phone: '', email: '', notes: '' })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any).from('customers').select('*').order('created_at', { ascending: false })
      if (data) setCustomers(data)
    }
  }

  const filteredCustomers = customers.filter((c) => c.name.includes(searchQuery) || c.phone.includes(searchQuery))

  if (authLoading || !isAdmin) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>

  const statusLabels = {
    new: locale === 'ar' ? 'جديد' : 'New',
    contacted: locale === 'ar' ? 'تم التواصل' : 'Contacted',
    interested: locale === 'ar' ? 'مهتم' : 'Interested',
    not_interested: locale === 'ar' ? 'غير مهتم' : 'Not Interested',
    converted: locale === 'ar' ? 'تم التحويل' : 'Converted',
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed top-0 start-0 z-40 w-64 h-screen bg-card border-e">
        <div className="p-4 border-b"><Link href="/" className="flex items-center gap-2"><Building className="h-6 w-6 text-primary" /><span className="font-bold">{locale === 'ar' ? 'عقارات الأردن' : 'Jordan RE'}</span></Link></div>
        <div className="p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted">{locale === 'ar' ? 'نظرة عامة' : 'Overview'}</Link>
          <Link href="/admin/properties" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted">{locale === 'ar' ? 'العقارات' : 'Properties'}</Link>
          <Link href="/admin/owners" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted">{locale === 'ar' ? 'الملاك' : 'Owners'}</Link>
          <Link href="/admin/customers" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground">{locale === 'ar' ? 'العملاء' : 'Customers'}</Link>
        </div>
      </aside>

      <main className="ms-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">{locale === 'ar' ? 'إدارة العملاء' : 'Customer Management'}</h1>
              <p className="text-muted-foreground mt-1">{locale === 'ar' ? 'قائمة العملاء المسجلين' : 'Registered customers list'}</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild><Button><Plus className="me-2 h-4 w-4" />{locale === 'ar' ? 'إضافة عميل' : 'Add Customer'}</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>{locale === 'ar' ? 'إضافة عميل جديد' : 'Add New Customer'}</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2"><Label>{locale === 'ar' ? 'الاسم' : 'Name'} *</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
                  <div className="space-y-2"><Label>{locale === 'ar' ? 'الهاتف' : 'Phone'} *</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
                  <div className="space-y-2"><Label>{locale === 'ar' ? 'البريد' : 'Email'}</Label><Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
                  <div className="space-y-2"><Label>{locale === 'ar' ? 'ملاحظات' : 'Notes'}</Label><Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} /></div>
                  <Button onClick={handleAddCustomer} className="w-full" disabled={!formData.name || !formData.phone}>{locale === 'ar' ? 'إضافة' : 'Add Customer'}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={locale === 'ar' ? 'بحث عن عميل...' : 'Search customers...'} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pr-10" />
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div> :
              filteredCustomers.length === 0 ? <div className="p-12 text-center"><User className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" /><p className="text-muted-foreground">{locale === 'ar' ? 'لا يوجد عملاء' : 'No customers found'}</p></div> :
              <Table>
                <TableHeader><TableRow>
                  <TableHead>{locale === 'ar' ? 'الاسم' : 'Name'}</TableHead>
                  <TableHead>{locale === 'ar' ? 'الهاتف' : 'Phone'}</TableHead>
                  <TableHead>{locale === 'ar' ? 'البريد' : 'Email'}</TableHead>
                  <TableHead>{locale === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow></TableHeader>
                <TableBody>{filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell><a href={`tel:${customer.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone className="h-4 w-4" />{customer.phone}</a></TableCell>
                    <TableCell>{customer.email || '-'}</TableCell>
                    <TableCell><Badge>{statusLabels[customer.follow_up_status]}</Badge></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))}</TableBody>
              </Table>}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
