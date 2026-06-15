import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()

    // Create Supabase client with anon key (works for signup)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Check if any admin already exists using anon client
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .limit(1)

    if (existingProfiles && existingProfiles.length > 0) {
      return NextResponse.json(
        { error: 'Admin already exists. Use SQL to create additional admins.' },
        { status: 400 }
      )
    }

    // Sign up the user - this creates auth.users and triggers profile creation
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'admin' // This will be stored in user metadata
        }
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    // Now we need to update the profile to be admin
    // We need service role for this, but let's try a different approach
    // Use the service role key if available
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (serviceKey) {
      const adminClient = createClient(supabaseUrl, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      })

      // Update the profile
      const { error: updateError } = await adminClient
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', authData.user.id)

      if (updateError) {
        console.error('Profile update error:', updateError)
        // Still return success - user can manually update via SQL
        return NextResponse.json({
          success: true,
          message: 'User created. Run this SQL in Supabase to make admin:',
          sql: `UPDATE profiles SET role = 'admin' WHERE id = '${authData.user.id}';`,
          userId: authData.user.id
        })
      }
    } else {
      // No service key - provide SQL command
      return NextResponse.json({
        success: true,
        message: 'User created successfully! To make them admin, run this SQL in Supabase Dashboard > SQL Editor:',
        sql: `UPDATE profiles SET role = 'admin' WHERE email = '${email}';`,
        userId: authData.user.id,
        note: 'Add SUPABASE_SERVICE_ROLE_KEY to your environment variables for automatic admin creation.'
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Admin account created successfully!',
      user: { id: authData.user.id, email: authData.user.email }
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // Check if admin exists
  const { data: admins } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'admin')
    .limit(1)

  return NextResponse.json({
    hasAdmin: admins && admins.length > 0,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
  })
}
