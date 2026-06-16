'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLocale } from '@/contexts/LocaleContext'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MessageSquare, Phone, Building, Mail, Check, Eye } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Inquiry } from '@/lib/types/database'

export default function AdminInquiriesPage() {
  const { isAdmin, isLoading: authLoading } = useAuth()
  const { locale } = useLocale()
  const router = useRouter()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (!authLoading && !isAdmin) router.push('/')
  }, [authLoading, isAdmin, router])

  useEffect(() => {
    if (isAdmin) {
      supabase.from('inquiries').select('*').order('created_at', { ascending: false })
        .then(({ data }) => { if (data) setInquiries(data); setLoading(false) })
    }
  }, [isAdmin])

  const handleStatusChange = async (id: string, status: Inquiry['status']) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('inquiries').update({ status }).eq('id', id)
    if (!error) setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, status: status } : i))
  }

  const statusLabels = {
    new: { ar: 'جديد', en: 'New', color: 'bg-blue-100 text-blue-800' },
    read: { ar: 'تمت القراءة', en: 'Read', color: 'bg-gray-100 text-gray-800' },
    responded: { ar: 'تم الرد', en: 'Responded', color: 'bg-green-100 text-green-800' },
    closed: { ar: 'مغلق', en: 'Closed', color: 'bg-muted text-muted-foreground' },
  }

  const typeLabels = {
    general: { ar: 'استفسار عام', en: 'General' },
    callback: { ar: 'طلب مكالمة', en: 'Callback' },
    question: { ar: 'سؤال', en: 'Question' },
    visit_request: { ar: 'طلب زيارة', en: 'Visit Request' },
  }

  const filteredInquiries = statusFilter && statusFilter !== 'all' ? inquiries.filter((i) => i.status === statusFilter) : inquiries

  if (authLoading || !isAdmin) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>

  return (
    <div className="min-h-screen bg-muted/30">
      <aside className="fixed top-0 start-0 z-40 w-64 h-screen bg-card border-e">
        <div className="p-4 border-b"><Link href="/" className="flex items-center gap-2"><Building className="h-6 w-6 text-primary" /><span className="font-bold">{locale === 'ar' ? 'عقارات الأردن' : 'Jordan RE'}</span></Link></div>
        <div className="p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted">{locale === 'ar' ? 'نظرة عامة' : 'Overview'}</Link>
          <Link href="/admin/properties" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted">{locale === 'ar' ? 'العقارات' : 'Properties'}</Link>
          <Link href="/admin/owners" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted">{locale === 'ar' ? 'الملاك' : 'Owners'}</Link>
          <Link href="/admin/customers" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted">{locale === 'ar' ? 'العملاء' : 'Customers'}</Link>
          <Link href="/admin/appointments" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted">{locale === 'ar' ? 'المواعيد' : 'Appointments'}</Link>
          <Link href="/admin/inquiries" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground">{locale === 'ar' ? 'الاستفسارات' : 'Inquiries'}</Link>
        </div>
      </aside>

      <main className="ms-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">{locale === 'ar' ? 'إدارة الاستفسارات' : 'Inquiry Management'}</h1>
              <p className="text-muted-foreground mt-1">{locale === 'ar' ? `${inquiries.filter((i) => i.status === 'new').length} استفسار جديد` : `${inquiries.filter((i) => i.status === 'new').length} new inquiries`}</p>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder={locale === 'ar' ? 'الحالة' : 'Status'} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{locale === 'ar' ? 'الكل' : 'All'}</SelectItem>
                <SelectItem value="new">{locale === 'ar' ? 'جديد' : 'New'}</SelectItem>
                <SelectItem value="read">{locale === 'ar' ? 'تمت القراءة' : 'Read'}</SelectItem>
                <SelectItem value="responded">{locale === 'ar' ? 'تم الرد' : 'Responded'}</SelectItem>
                <SelectItem value="closed">{locale === 'ar' ? 'مغلق' : 'Closed'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div> :
              filteredInquiries.length === 0 ? <div className="p-12 text-center"><MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" /><p className="text-muted-foreground">{locale === 'ar' ? 'لا توجد استفسارات' : 'No inquiries'}</p></div> :
              <Table>
                <TableHeader><TableRow>
                  <TableHead>{locale === 'ar' ? 'المُرسل' : 'Sender'}</TableHead>
                  <TableHead>{locale === 'ar' ? 'النوع' : 'Type'}</TableHead>
                  <TableHead>{locale === 'ar' ? 'الرسالة' : 'Message'}</TableHead>
                  <TableHead>{locale === 'ar' ? 'التاريخ' : 'Date'}</TableHead>
                  <TableHead>{locale === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                  <TableHead></TableHead>
                </TableRow></TableHeader>
                <TableBody>{filteredInquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell>
                      <div><p className="font-medium">{inquiry.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <a href={`tel:${inquiry.phone}`} className="hover:text-primary"><Phone className="h-3 w-3 inline me-1" />{inquiry.phone}</a>
                          {inquiry.email && <a href={`mailto:${inquiry.email}`} className="hover:text-primary"><Mail className="h-3 w-3 inline me-1" />{inquiry.email}</a>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline">{locale === 'ar' ? typeLabels[inquiry.inquiry_type].ar : typeLabels[inquiry.inquiry_type].en}</Badge></TableCell>
                    <TableCell className="max-w-xs truncate">{inquiry.message}</TableCell>
                    <TableCell>{new Date(inquiry.created_at).toLocaleDateString(locale === 'ar' ? 'ar-JO' : 'en-US')}</TableCell>
                    <TableCell><Badge className={statusLabels[inquiry.status].color}>{locale === 'ar' ? statusLabels[inquiry.status].ar : statusLabels[inquiry.status].en}</Badge></TableCell>
                    <TableCell>
                      {inquiry.status === 'new' && (
                        <Button size="sm" variant="ghost" onClick={() => handleStatusChange(inquiry.id, 'read')}><Eye className="h-4 w-4" /></Button>
                      )}
                    </TableCell>
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
