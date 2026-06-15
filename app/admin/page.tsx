'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLocale } from '@/contexts/LocaleContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Building2,
  Home,
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  Eye,
  FileText,
  Plus,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

// Admin sidebar navigation
const navItems = [
  { icon: TrendingUp, labelAr: 'نظرة عامة', labelEn: 'Overview', href: '/admin' },
  { icon: Building2, labelAr: 'العقارات', labelEn: 'Properties', href: '/admin/properties' },
  { icon: Users, labelAr: 'الملاك', labelEn: 'Owners', href: '/admin/owners' },
  { icon: Users, labelAr: 'العملاء', labelEn: 'Customers', href: '/admin/customers' },
  { icon: Calendar, labelAr: 'المواعيد', labelEn: 'Appointments', href: '/admin/appointments' },
  { icon: MessageSquare, labelAr: 'الاستفسارات', labelEn: 'Inquiries', href: '/admin/inquiries' },
]

export default function AdminDashboard() {
  const { isAdmin, isLoading: authLoading } = useAuth()
  const { locale } = useLocale()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    soldProperties: 0,
    rentedProperties: 0,
    totalOwners: 0,
    totalCustomers: 0,
    pendingAppointments: 0,
    newInquiries: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/')
    }
  }, [authLoading, isAdmin, router])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Total properties
        const { count: totalProperties } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true })

        // Available properties
        const { count: availableProperties } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'available')

        // Sold properties
        const { count: soldProperties } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'sold')

        // Rented properties
        const { count: rentedProperties } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'rented')

        // Total owners
        const { count: totalOwners } = await supabase
          .from('owners')
          .select('*', { count: 'exact', head: true })

        // Total customers
        const { count: totalCustomers } = await supabase
          .from('customers')
          .select('*', { count: 'exact', head: true })

        // Pending appointments
        const { count: pendingAppointments } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')

        // New inquiries
        const { count: newInquiries } = await supabase
          .from('inquiries')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'new')

        setStats({
          totalProperties: totalProperties || 0,
          availableProperties: availableProperties || 0,
          soldProperties: soldProperties || 0,
          rentedProperties: rentedProperties || 0,
          totalOwners: totalOwners || 0,
          totalCustomers: totalCustomers || 0,
          pendingAppointments: pendingAppointments || 0,
          newInquiries: newInquiries || 0,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isAdmin) {
      fetchStats()
    }
  }, [isAdmin])

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const statCards = [
    {
      title: locale === 'ar' ? 'إجمالي العقارات' : 'Total Properties',
      value: stats.totalProperties,
      icon: Home,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: locale === 'ar' ? 'العقارات المتاحة' : 'Available',
      value: stats.availableProperties,
      icon: Building2,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      title: locale === 'ar' ? 'العقارات المباعة' : 'Sold',
      value: stats.soldProperties,
      icon: TrendingUp,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
    {
      title: locale === 'ar' ? 'العقارات المؤجرة' : 'Rented',
      value: stats.rentedProperties,
      icon: Building2,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
    },
    {
      title: locale === 'ar' ? 'الملاك' : 'Owners',
      value: stats.totalOwners,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      title: locale === 'ar' ? 'العملاء' : 'Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'text-orange-600',
      bg: 'bg-orange-100',
    },
    {
      title: locale === 'ar' ? 'المواعيد المعلقة' : 'Pending Appointments',
      value: stats.pendingAppointments,
      icon: Calendar,
      color: 'text-indigo-600',
      bg: 'bg-indigo-100',
    },
    {
      title: locale === 'ar' ? 'الاستفسارات الجديدة' : 'New Inquiries',
      value: stats.newInquiries,
      icon: MessageSquare,
      color: 'text-pink-600',
      bg: 'bg-pink-100',
    },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="fixed top-0 start-0 z-40 w-64 h-screen pt-16 bg-card border-e">
        <div className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
            >
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <span>{locale === 'ar' ? item.labelAr : item.labelEn}</span>
            </Link>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="ms-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">{locale === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</h1>
              <p className="text-muted-foreground mt-1">
                {locale === 'ar' ? 'مرحباً بك في لوحة التحكم' : 'Welcome to your dashboard'}
              </p>
            </div>
            <Button asChild>
              <Link href="/admin/properties/new">
                <Plus className="me-2 h-4 w-4" />
                {locale === 'ar' ? 'إضافة عقار' : 'Add Property'}
              </Link>
            </Button>
          </div>

          {/* Stats Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat) => (
                <Card key={stat.title}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.bg}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{locale === 'ar' ? 'إدارة العقارات' : 'Property Management'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/admin/properties">
                      <Building2 className="me-2 h-4 w-4" />
                      {locale === 'ar' ? 'عرض جميع العقارات' : 'View All Properties'}
                      {locale === 'ar' ? <ArrowLeft className="ms-auto h-4 w-4" /> : <ArrowRight className="ms-auto h-4 w-4" />}
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/admin/properties/new">
                      <Plus className="me-2 h-4 w-4" />
                      {locale === 'ar' ? 'إضافة عقار جديد' : 'Add New Property'}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{locale === 'ar' ? 'إدارة الملاك' : 'Owner Management'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/admin/owners">
                      <Users className="me-2 h-4 w-4" />
                      {locale === 'ar' ? 'عرض جميع الملاك' : 'View All Owners'}
                      {locale === 'ar' ? <ArrowLeft className="ms-auto h-4 w-4" /> : <ArrowRight className="ms-auto h-4 w-4" />}
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/admin/owners/new">
                      <Plus className="me-2 h-4 w-4" />
                      {locale === 'ar' ? 'إضافة مالك جديد' : 'Add New Owner'}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{locale === 'ar' ? 'المواعيد' : 'Appointments'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/appointments">
                    <Calendar className="me-2 h-4 w-4" />
                    {locale === 'ar' ? `${stats.pendingAppointments} مواعيد معلقة` : `${stats.pendingAppointments} pending appointments`}
                    <Badge variant="destructive" className="ms-auto">{stats.pendingAppointments}</Badge>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{locale === 'ar' ? 'الاستفسارات' : 'Inquiries'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/admin/inquiries">
                    <MessageSquare className="me-2 h-4 w-4" />
                    {locale === 'ar' ? `${stats.newInquiries} استفسارات جديدة` : `${stats.newInquiries} new inquiries`}
                    <Badge variant="destructive" className="ms-auto">{stats.newInquiries}</Badge>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
