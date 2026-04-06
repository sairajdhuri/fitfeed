'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { calculateTDEE, distributeTargetMacros } from './tdee-calculator'
import type { UserMetrics } from './tdee-calculator'

export interface OnboardingData {
  name: string
  gender: string
  age: number
  heightCm: number
  weightKg: number
  activityLevel: 'sedentary' | 'lightly' | 'moderately' | 'very' | 'extra'
  goal: 'lose' | 'maintain' | 'gain'
  deficit: number
}

/**
 * Server Action: Create user profile from onboarding data
 */
export async function createUserProfile(data: OnboardingData) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Get the authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'Not authenticated' }
  }

  const metrics: UserMetrics = {
    age: data.age,
    gender: data.gender,
    weight_kg: data.weightKg,
    height_cm: data.heightCm,
    activity_level: data.activityLevel,
    goal: data.goal,
  }

  const tdee = calculateTDEE(metrics)
  const dailyCalorieTarget = data.goal === 'maintain'
    ? tdee
    : data.goal === 'lose'
      ? tdee - data.deficit
      : tdee + data.deficit
  const macros = distributeTargetMacros(dailyCalorieTarget)

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .upsert({
      id: user.id,
      email: user.email!,
      name: data.name,
      age: data.age,
      gender: data.gender,
      height_cm: data.heightCm,
      weight_kg: data.weightKg,
      activity_level: data.activityLevel,
      goal: data.goal,
      deficit: data.deficit,
      tdee,
      daily_calorie_target: dailyCalorieTarget,
      protein_g: macros.protein_g,
      carbs_g: macros.carbs_g,
      fat_g: macros.fat_g,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to save profile:', error)
    return { success: false, error: error.message }
  }

  // Set cookie for middleware redirect logic
  cookieStore.set('onboarding_complete', 'true', {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: false,
    sameSite: 'lax',
  })

  revalidatePath('/dashboard')
  return {
    success: true,
    profile: {
      id: profile.id,
      tdee,
      dailyCalorieTarget,
      ...macros,
    },
  }
}

/**
 * Server Action: Log a food item
 */
export async function logMealAction(userId: string, date: Date, foodItems: any[]) {
  revalidatePath('/dashboard')
  return { success: true }
}

/**
 * Server Action: Update user profile
 */
export async function updateUserProfileAction(userId: string, profileData: any) {
  revalidatePath('/dashboard')
  return { success: true }
}
