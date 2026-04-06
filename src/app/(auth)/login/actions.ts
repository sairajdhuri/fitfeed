'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  // Check if user has a profile (completed onboarding)
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (profile) {
      cookieStore.set('onboarding_complete', 'true', {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        httpOnly: false,
        sameSite: 'lax',
      })
      revalidatePath('/', 'layout')
      redirect('/dashboard')
    }
  }

  revalidatePath('/', 'layout')
  redirect('/onboarding')
}

export async function signupAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/onboarding')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  await supabase.auth.signOut()
  cookieStore.delete('onboarding_complete')

  revalidatePath('/', 'layout')
  redirect('/login')
}
