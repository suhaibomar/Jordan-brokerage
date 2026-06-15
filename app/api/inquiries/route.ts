import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, inquiryType, message, propertyId } = body

    const supabase = createServerClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any

    const { error } = await db.from('inquiries').insert([{
      name,
      phone,
      email: email || null,
      inquiry_type: inquiryType,
      message,
      property_id: propertyId || null,
      status: 'new',
    }])

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Create notification for admin
    await db.from('notifications').insert([{
      type: 'inquiry',
      title_ar: `استفسار جديد من ${name}`,
      title_en: `New inquiry from ${name}`,
      message_ar: message,
      message_en: message,
    }])

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
