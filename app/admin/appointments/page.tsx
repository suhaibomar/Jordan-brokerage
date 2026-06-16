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
import { Calendar, Building, Phone, Check, X, Clock, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Appointment, Property } from '@/lib/types/database'

export default function AdminAppointmentsPage() {
  const { isAdmin, isLoading: authLoading } = useAuth()
  const { locale } = useLocale()
  const router = useRouter()
  const [appointments, setAppointments] = useState<(Appointment & { property?: Property })[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (!authLoading && !isAdmin) router.push('/')
  }, [authLoading, isAdmin, router])

  useEffect(() => {
    if (isAdmin) {
      supabase.from('appointments').select('*, property:properties(*)').order('created_at', { ascending: false })
        .then(({ data }) => { if (data) setAppointments(data); setLoading(false) })
    }
  }, [isAdmin])

  const handleStatusChange = async (id: string, status: Appointment['status']) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('appointments').update({ status }).eq('id', id)
    if (!error) setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: status } : a))
  }

  const statusLabels: Record<string, { ar: string; en: string; color: string }> = {
    pending: { ar: 'معلق', en: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    approved: { ar: 'تمت الموافقة', en: 'Approved', color: 'bg-green-100 text-green-800' },
    rejected: { ar: 'مرفوض', en: 'Rejected', color: 'bg-red-100 text-red-800' },
    rescheduled: { ar: 'إعادة جدولة', en: 'Rescheduled', color: 'bg-purple-100 text-purple-800' },
    completed: { ar: 'مكتمل', en: 'Completed', color: 'bg-blue-100 text-blue-800' },
    cancelled: { ar: 'ملغي', en: 'Cancelled', color: 'bg-gray-100 text-gray-800' },
  }

  const filteredAppointments = statusFilter && statusFilter !== 'all' ? appointments.filter((a) => a.status === statusFilter) : appointments

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
          <Link href="/admin/appointments" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground">{locale === 'ar' ? 'المواعيد' : 'Appointments'}</Link>
        </div>
      </aside>

      <main className="ms-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">{locale === 'ar' ? 'إدارة المواعيد' : 'Appointment Management'}</h1>
              <p className="text-muted-foreground mt-1">{locale === 'ar' ? `${appointments.length} موعد` : `${appointments.length} appointments`}</p>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder={locale === 'ar' ? 'الحالة' : 'Status'} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{locale === 'ar' ? 'الكل' : 'All'}</SelectItem>
                <SelectItem value="pending">{locale === 'ar' ? 'معلق' : 'Pending'}</SelectItem>
                <SelectItem value="approved">{locale === 'ar' ? 'تمت الموافقة' : 'Approved'}</SelectItem>
                <SelectItem value="completed">{locale === 'ar' ? 'مكتمل' : 'Completed'}</SelectItem>
                <SelectItem value="rejected">{locale === 'ar' ? 'مرفوض' : 'Rejected'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></div> :
              filteredAppointments.length === 0 ? <div className="p-12 text-center"><Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" /><p className="text-muted-foreground">{locale === 'ar' ? 'لا توجد مواعيد' : 'No appointments'}</p></div> :
              <Table>
                <TableHeader><TableRow>
                  <TableHead>{locale === 'ar' ? 'العقار' : 'Property'}</TableHead>
                  <TableHead>{locale === 'ar' ? 'العميل' : 'Customer'}</TableHead>
                  <TableHead>{locale === 'ar' ? 'التاريخ' : 'Date'}</TableHead>
                  <TableHead>{locale === 'ar' ? 'الوقت' : 'Time'}</TableHead>
                  <TableHead>{locale === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                  <TableHead></TableHead>
                </TableRow></TableHeader>
                <TableBody>{filteredAppointments.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell>{apt.property?.property_number || '-'}</TableCell>
                    <TableCell>
                      <div><p className="font-medium">{apt.customer_name}</p>
                        <a href={`tel:${apt.customer_phone}`} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"><Phone className="h-3 w-3" />{apt.customer_phone}</a>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(apt.preferred_date).toLocaleDateString(locale === 'ar' ? 'ar-JO' : 'en-US')}</TableCell>
                    <TableCell>{apt.preferred_time}</TableCell>
                    <TableCell><Badge className={statusLabels[apt.status].color}>{locale === 'ar' ? statusLabels[apt.status].ar : statusLabels[apt.status].en}</Badge></TableCell>
                    <TableCell>
                      {apt.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => handleStatusChange(apt.id, 'approved')}><Check className="h-4 w-4 text-success" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => handleStatusChange(apt.id, 'rejected')}><X className="h-4 w-4 text-destructive" /></Button>
                        </div>
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
