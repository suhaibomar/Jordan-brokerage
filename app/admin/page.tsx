'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useLocale } from '@/contexts/LocaleContext'
import { AdminLayout } from '@/components/admin/AdminLayout'
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
  Plus,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const { isAdmin } = useAuth()
  const { locale } = useLocale()
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
    const fetchStats = async () => {
      try {
        const { count: totalProperties } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true })

        const { count: availableProperties } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'available')

        const { count: soldProperties } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'sold')

        const { count: rentedProperties } = await supabase
          .from('properties')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'rented')

        const { count: totalOwners } = await supabase
          .from('owners')
          .select('*', { count: 'exact', head: true })

        const { count: totalCustomers } = await supabase
          .from('customers')
          .select('*', { count: 'exact', head: true })

        const { count: pendingAppointments } = await supabase
          .from('appointments')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')

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
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">{locale === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</h1>
            <p className="text-muted-foreground mt-1">
              {locale === 'ar' ? 'مرحباً بك في لوحة التحكم' : 'Welcome to your dashboard'}
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/admin/properties/new">
              <Plus className="me-2 h-4 w-4" />
              {locale === 'ar' ? 'إضافة عقار' : 'Add Property'}
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            {statCards.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs lg:text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-2xl lg:text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`p-2 lg:p-3 rounded-lg ${stat.bg}`}>
                      <stat.icon className={`h-5 w-5 lg:h-6 lg:w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{locale === 'ar' ? 'إدارة العقارات' : 'Property Management'}</CardTitle>
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
              <CardTitle className="text-lg">{locale === 'ar' ? 'إدارة الملاك' : 'Owner Management'}</CardTitle>
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
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{locale === 'ar' ? 'المواعيد' : 'Appointments'}</CardTitle>
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
              <CardTitle className="text-lg">{locale === 'ar' ? 'الاستفسارات' : 'Inquiries'}</CardTitle>
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
    </AdminLayout>
  )
}
