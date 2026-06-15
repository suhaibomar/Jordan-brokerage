'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLocale } from '@/contexts/LocaleContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Phone, Mail, MapPin, Clock, Send, Loader2, CheckCircle2 } from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(3),
  phone: z.string().min(9),
  email: z.string().email().optional().or(z.literal('')),
  inquiryType: z.enum(['general', 'callback', 'question', 'visit_request']),
  message: z.string().min(10),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactPage() {
  const { locale } = useLocale()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { inquiryType: 'general' },
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (response.ok) setIsSuccess(true)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 py-12">
        <div className="container px-4 mx-auto max-w-6xl">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{locale === 'ar' ? 'اتصل بنا' : 'Contact Us'}</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {locale === 'ar' ? 'نحن هنا لمساعدتك. تواصل معنا بأي طريقة تناسبك.' : "We're here to help. Contact us in any way that suits you."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{locale === 'ar' ? 'الهاتف' : 'Phone'}</h3>
                        <a href="tel:+962791234567" className="text-muted-foreground hover:text-primary">+962 79 123 4567</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</h3>
                        <a href="mailto:info@jordan-realestate.com" className="text-muted-foreground hover:text-primary">info@jordan-realestate.com</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{locale === 'ar' ? 'العنوان' : 'Address'}</h3>
                        <p className="text-muted-foreground">{locale === 'ar' ? 'عمّان، الأردن - شارع الملكة رانيا' : 'Amman, Jordan - Queen Rania Street'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{locale === 'ar' ? 'ساعات العمل' : 'Working Hours'}</h3>
                        <p className="text-muted-foreground">{locale === 'ar' ? 'السبت - الخميس: 9 ص - 7 م' : 'Sat - Thu: 9 AM - 7 PM'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* WhatsApp CTA */}
              <Card className="bg-green-600 text-white border-0">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">{locale === 'ar' ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}</h3>
                  <p className="opacity-90 mb-4">{locale === 'ar' ? 'رد سريع خلال دقائق!' : 'Quick response within minutes!'}</p>
                  <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-white/90" asChild>
                    <a href="https://wa.me/962791234567" target="_blank" rel="noopener noreferrer">
                      <svg className="me-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>{locale === 'ar' ? 'أرسل رسالة' : 'Send a Message'}</CardTitle>
              </CardHeader>
              <CardContent>
                {isSuccess ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{locale === 'ar' ? 'تم الإرسال بنجاح!' : 'Message Sent!'}</h3>
                    <p className="text-muted-foreground">{locale === 'ar' ? 'سنتواصل معك قريباً' : "We'll get back to you soon"}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{locale === 'ar' ? 'الاسم' : 'Name'} *</Label>
                        <Input {...register('name')} className={errors.name ? 'border-destructive' : ''} />
                      </div>
                      <div className="space-y-2">
                        <Label>{locale === 'ar' ? 'الهاتف' : 'Phone'} *</Label>
                        <Input {...register('phone')} className={errors.phone ? 'border-destructive' : ''} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
                      <Input type="email" {...register('email')} />
                    </div>
                    <div className="space-y-2">
                      <Label>{locale === 'ar' ? 'نوع الاستفسار' : 'Inquiry Type'}</Label>
                      <Select onValueChange={(v) => setValue('inquiryType', v as ContactFormData['inquiryType'])} defaultValue="general">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">{locale === 'ar' ? 'استفسار عام' : 'General'}</SelectItem>
                          <SelectItem value="visit_request">{locale === 'ar' ? 'طلب زيارة' : 'Visit Request'}</SelectItem>
                          <SelectItem value="callback">{locale === 'ar' ? 'طلب مكالمة' : 'Callback'}</SelectItem>
                          <SelectItem value="question">{locale === 'ar' ? 'سؤال' : 'Question'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{locale === 'ar' ? 'الرسالة' : 'Message'} *</Label>
                      <Textarea rows={5} {...register('message')} className={errors.message ? 'border-destructive' : ''} />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? <><Loader2 className="me-2 h-4 w-4 animate-spin" />{locale === 'ar' ? 'جاري الإرسال...' : 'Sending...'}</> : <><Send className="me-2 h-4 w-4" />{locale === 'ar' ? 'إرسال' : 'Send Message'}</>}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
