'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLocale } from '@/contexts/LocaleContext'
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
import {
  Phone,
  MessageCircle,
  Mail,
  Send,
  Loader2,
  CheckCircle2,
} from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(3, 'الاسم مطلوب'),
  phone: z.string().min(9, 'رقم الهاتف غير صحيح'),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  inquiryType: z.enum(['general', 'callback', 'question', 'visit_request']),
  message: z.string().min(10, 'الرسالة يجب أن تكون 10 أحرف على الأقل'),
})

type ContactFormData = z.infer<typeof contactSchema>

interface PropertyContactFormProps {
  propertyId: string
  propertyNumber: string
  contactNumber?: string
}

export function PropertyContactForm({
  propertyId,
  propertyNumber,
  contactNumber,
}: PropertyContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { locale } = useLocale()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      inquiryType: 'general',
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          propertyId,
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card>
        <CardContent className="pt-6 text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-success" />
          </div>
          <h3 className="text-lg font-semibold">
            {locale === 'ar' ? 'تم إرسال رسالتك بنجاح' : 'Message Sent Successfully'}
          </h3>
          <p className="text-muted-foreground">
            {locale === 'ar'
              ? 'سنتواصل معك في أقرب وقت ممكن'
              : "We'll get back to you as soon as possible"}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Contact Buttons */}
        <div className="flex gap-2">
          {contactNumber && (
            <>
              <Button
                variant="outline"
                className="flex-1"
                asChild
              >
                <a href={`tel:${contactNumber}`}>
                  <Phone className="h-4 w-4 me-2" />
                  {locale === 'ar' ? 'اتصال' : 'Call'}
                </a>
              </Button>
              <Button
                variant="default"
                className="flex-1 bg-green-600 hover:bg-green-700"
                asChild
              >
                <a
                  href={`https://wa.me/${contactNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                    locale === 'ar'
                      ? `مرحباً، أنا مهتم بالعقار رقم ${propertyNumber}`
                      : `Hi, I'm interested in property ${propertyNumber}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4 me-2" />
                  WhatsApp
                </a>
              </Button>
            </>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              {locale === 'ar' ? 'أو أرسل رسالة' : 'or send a message'}
            </span>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{locale === 'ar' ? 'الاسم' : 'Name'} *</Label>
            <Input
              id="name"
              {...register('name')}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{locale === 'ar' ? 'رقم الهاتف' : 'Phone'} *</Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              className={errors.phone ? 'border-destructive' : ''}
              placeholder="07XXXXXXXX"
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{locale === 'ar' ? 'نوع الاستفسار' : 'Inquiry Type'}</Label>
            <Select
              onValueChange={(value) => setValue('inquiryType', value as ContactFormData['inquiryType'])}
              defaultValue="general"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">
                  {locale === 'ar' ? 'استفسار عام' : 'General Inquiry'}
                </SelectItem>
                <SelectItem value="callback">
                  {locale === 'ar' ? 'طلب مكالمة' : 'Callback Request'}
                </SelectItem>
                <SelectItem value="visit_request">
                  {locale === 'ar' ? 'طلب زيارة' : 'Visit Request'}
                </SelectItem>
                <SelectItem value="question">
                  {locale === 'ar' ? 'سؤال' : 'Question'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{locale === 'ar' ? 'الرسالة' : 'Message'} *</Label>
            <Textarea
              id="message"
              rows={4}
              {...register('message')}
              className={errors.message ? 'border-destructive' : ''}
              placeholder={
                locale === 'ar'
                  ? 'اكتب رسالتك هنا...'
                  : 'Write your message here...'
              }
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 me-2 animate-spin" />
                {locale === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 me-2" />
                {locale === 'ar' ? 'إرسال' : 'Send Message'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
