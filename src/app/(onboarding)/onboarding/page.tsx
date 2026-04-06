'use client'

import React, { useState, useMemo, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Sofa, TreePine, Bike, Flame, Trophy,
  Target, Scale, Dumbbell,
  User, Zap, Wheat, Droplets
} from 'lucide-react'
import { createUserProfile } from '@/lib/actions'
import {
  calculateBMR, calculateTDEE, distributeTargetMacros
} from '@/lib/tdee-calculator'

/* ───────── constants ───────── */

const TOTAL_STEPS = 5

const GENDERS = ['Male', 'Female', 'Prefer not to say'] as const

const ACTIVITY_LEVELS = [
  { key: 'sedentary' as const, label: 'Sedentary', desc: 'Little or no exercise', mult: 1.2, icon: Sofa },
  { key: 'lightly' as const, label: 'Lightly Active', desc: 'Light exercise 1-3 days/week', mult: 1.375, icon: TreePine },
  { key: 'moderately' as const, label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week', mult: 1.55, icon: Bike },
  { key: 'very' as const, label: 'Very Active', desc: 'Hard exercise 6-7 days/week', mult: 1.725, icon: Flame },
  { key: 'extra' as const, label: 'Athlete', desc: 'Intense training twice daily', mult: 1.9, icon: Trophy },
]

const GOALS = [
  { key: 'lose' as const, label: 'Lose Weight', desc: 'Caloric deficit for fat loss', icon: Target },
  { key: 'maintain' as const, label: 'Maintain', desc: 'Stay at current weight', icon: Scale },
  { key: 'gain' as const, label: 'Gain Muscle', desc: 'Caloric surplus for growth', icon: Dumbbell },
]

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

/* ───────── helpers ───────── */

function calcAge(day: number, month: number, year: number): number {
  const today = new Date()
  let age = today.getFullYear() - year
  const m = today.getMonth() + 1
  if (m < month || (m === month && today.getDate() < day)) age--
  return age
}

function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54
  return { feet: Math.floor(totalInches / 12), inches: Math.round(totalInches % 12) }
}

function feetInchesToCm(feet: number, inches: number): number {
  return Math.round((feet * 12 + inches) * 2.54 * 10) / 10
}

function kgToLbs(kg: number): number { return Math.round(kg * 2.20462 * 10) / 10 }
function lbsToKg(lbs: number): number { return Math.round(lbs / 2.20462 * 10) / 10 }

/* ───────── animation variants ───────── */

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 400 : -400, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -400 : 400, opacity: 0 }),
}

/* ───────── styles ───────── */

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #F9F9F7 0%, #EDF2ED 50%, #DFE8DD 100%)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '0',
    fontFamily: 'var(--font-inter), sans-serif',
  },
  container: {
    width: '100%',
    maxWidth: '480px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    position: 'relative' as const,
  },
  header: {
    padding: '20px 24px 0',
    position: 'sticky' as const,
    top: 0,
    zIndex: 10,
    background: 'linear-gradient(180deg, rgba(249,249,247,0.98) 0%, rgba(249,249,247,0) 100%)',
    backdropFilter: 'blur(12px)',
  },
  progressBar: {
    height: '4px',
    background: 'rgba(76, 101, 68, 0.12)',
    borderRadius: '100px',
    overflow: 'hidden' as const,
    marginBottom: '16px',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #4C6544, #6B8C5E)',
    borderRadius: '100px',
    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  dots: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    paddingBottom: '20px',
  },
  content: {
    flex: 1,
    padding: '8px 24px 120px',
    overflow: 'hidden' as const,
    position: 'relative' as const,
  },
  stepTitle: {
    fontFamily: 'var(--font-playfair), serif',
    fontSize: '28px',
    color: '#334533',
    margin: '0 0 8px 0',
    fontWeight: 500 as const,
    fontStyle: 'italic' as const,
  },
  stepSubtitle: {
    fontSize: '14px',
    color: '#6B7B6B',
    margin: '0 0 32px 0',
    lineHeight: 1.5,
  },
  input: {
    width: '100%',
    padding: '16px 20px',
    border: '2px solid #DFE8DD',
    borderRadius: '16px',
    fontSize: '18px',
    fontFamily: 'var(--font-inter), sans-serif',
    color: '#334533',
    background: 'rgba(255,255,255,0.8)',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box' as const,
  },
  pillGroup: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  pill: (active: boolean) => ({
    flex: 1,
    minWidth: '100px',
    padding: '14px 16px',
    borderRadius: '100px',
    border: active ? '2px solid #4C6544' : '2px solid #DFE8DD',
    background: active ? 'linear-gradient(135deg, #4C6544, #6B8C5E)' : 'rgba(255,255,255,0.8)',
    color: active ? '#FFFFFF' : '#6B7B6B',
    fontSize: '14px',
    fontWeight: 600 as const,
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    textAlign: 'center' as const,
  }),
  selectCard: (active: boolean) => ({
    padding: '20px',
    borderRadius: '20px',
    border: active ? '2px solid #4C6544' : '2px solid rgba(223,232,221,0.6)',
    background: active
      ? 'linear-gradient(135deg, rgba(76,101,68,0.08), rgba(107,140,94,0.04))'
      : 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    backdropFilter: 'blur(8px)',
    boxShadow: active ? '0 4px 20px rgba(76,101,68,0.12)' : '0 2px 8px rgba(0,0,0,0.03)',
  }),
  iconCircle: (active: boolean) => ({
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    background: active
      ? 'linear-gradient(135deg, #4C6544, #6B8C5E)'
      : 'linear-gradient(135deg, #DFE8DD, #B9CDBE)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.25s',
  }),
  footer: {
    position: 'fixed' as const,
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '480px',
    padding: '16px 24px 32px',
    background: 'linear-gradient(0deg, rgba(249,249,247,1) 60%, rgba(249,249,247,0) 100%)',
    display: 'flex',
    gap: '12px',
    zIndex: 10,
  },
  btnPrimary: (disabled: boolean) => ({
    flex: 1,
    padding: '18px',
    borderRadius: '16px',
    border: 'none',
    background: disabled
      ? '#B9CDBE'
      : 'linear-gradient(135deg, #4C6544 0%, #6B8C5E 100%)',
    color: '#FFFFFF',
    fontSize: '16px',
    fontWeight: 600 as const,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s',
    boxShadow: disabled ? 'none' : '0 4px 16px rgba(76,101,68,0.3)',
    fontFamily: 'var(--font-inter), sans-serif',
  }),
  btnSecondary: {
    padding: '18px 24px',
    borderRadius: '16px',
    border: '2px solid #DFE8DD',
    background: 'rgba(255,255,255,0.8)',
    color: '#6B7B6B',
    fontSize: '16px',
    fontWeight: 500 as const,
    cursor: 'pointer',
    fontFamily: 'var(--font-inter), sans-serif',
  },
  statCard: {
    padding: '24px',
    borderRadius: '20px',
    background: 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(223,232,221,0.6)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
    textAlign: 'center' as const,
  },
  select: {
    padding: '14px 16px',
    borderRadius: '12px',
    border: '2px solid #DFE8DD',
    fontSize: '15px',
    fontFamily: 'var(--font-inter), sans-serif',
    color: '#334533',
    background: 'rgba(255,255,255,0.8)',
    outline: 'none',
    appearance: 'none' as const,
    cursor: 'pointer',
    flex: 1,
  },
  smallInput: {
    padding: '14px 16px',
    borderRadius: '12px',
    border: '2px solid #DFE8DD',
    fontSize: '16px',
    fontFamily: 'var(--font-inter), sans-serif',
    color: '#334533',
    background: 'rgba(255,255,255,0.8)',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
}

/* ═══════════════════════════════════════════ */
/*                 COMPONENT                   */
/* ═══════════════════════════════════════════ */

export default function OnboardingPage() {
  const router = useRouter()

  // ─── hydration guard ───
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // ─── wizard state ───
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // ─── form state ───
  const [name, setName] = useState('')
  const [gender, setGender] = useState('')

  const [dobDay, setDobDay] = useState<number>(1)
  const [dobMonth, setDobMonth] = useState<number>(1)
  const [dobYear, setDobYear] = useState<number>(2000)
  const [heightCm, setHeightCm] = useState<number>(170)
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm')
  const [heightFeet, setHeightFeet] = useState<number>(5)
  const [heightInches, setHeightInches] = useState<number>(7)
  const [weightKg, setWeightKg] = useState<number>(70)
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg')
  const [weightLbs, setWeightLbs] = useState<number>(154)

  const [activityLevel, setActivityLevel] = useState('')
  const [goal, setGoal] = useState('')
  const [deficit, setDeficit] = useState(500)

  // ─── derived values ───
  const age = useMemo(() => calcAge(dobDay, dobMonth, dobYear), [dobDay, dobMonth, dobYear])

  const currentYear = new Date().getFullYear()

  const toggleHeightUnit = useCallback(() => {
    if (heightUnit === 'cm') {
      const { feet, inches } = cmToFeetInches(heightCm)
      setHeightFeet(feet)
      setHeightInches(inches)
      setHeightUnit('ft')
    } else {
      const cm = feetInchesToCm(heightFeet, heightInches)
      setHeightCm(cm)
      setHeightUnit('cm')
    }
  }, [heightUnit, heightCm, heightFeet, heightInches])

  const toggleWeightUnit = useCallback(() => {
    if (weightUnit === 'kg') {
      setWeightLbs(kgToLbs(weightKg))
      setWeightUnit('lbs')
    } else {
      setWeightKg(lbsToKg(weightLbs))
      setWeightUnit('kg')
    }
  }, [weightUnit, weightKg, weightLbs])

  // ─── computed summary values ───
  const summary = useMemo(() => {
    const genderNorm = gender.toLowerCase() === 'male' ? 'male' : 'female'
    const finalHeightCm = heightUnit === 'ft' ? feetInchesToCm(heightFeet, heightInches) : heightCm
    const finalWeightKg = weightUnit === 'lbs' ? lbsToKg(weightLbs) : weightKg

    const bmr = Math.round(10 * finalWeightKg + 6.25 * finalHeightCm - 5 * age + (genderNorm === 'male' ? 5 : -161))
    const actData = ACTIVITY_LEVELS.find(a => a.key === activityLevel)
    const mult = actData?.mult || 1.2
    const tdee = Math.round(bmr * mult)

    let dailyCal = tdee
    if (goal === 'lose') dailyCal = tdee - deficit
    else if (goal === 'gain') dailyCal = tdee + deficit

    const protein = Math.round((dailyCal * 0.3) / 4)
    const carbs = Math.round((dailyCal * 0.4) / 4)
    const fat = Math.round((dailyCal * 0.3) / 9)

    return { bmr, mult, tdee, dailyCal, protein, carbs, fat, finalHeightCm, finalWeightKg }
  }, [gender, heightUnit, heightCm, heightFeet, heightInches, weightUnit, weightKg, weightLbs, age, activityLevel, goal, deficit])

  // ─── step validation ───
  const canProceed = useMemo(() => {
    switch (step) {
      case 1: return name.trim().length > 0 && gender !== ''
      case 2: return age > 0 && age < 120
      case 3: return activityLevel !== ''
      case 4: return goal !== ''
      case 5: return true
      default: return false
    }
  }, [step, name, gender, age, activityLevel, goal])

  // ─── navigation ───
  const next = () => { setDirection(1); setStep(s => Math.min(s + 1, TOTAL_STEPS)) }
  const prev = () => { setDirection(-1); setStep(s => Math.max(s - 1, 1)) }

  const handleComplete = async () => {
    setSaving(true)
    setError('')
    try {
      const finalHeightCm = heightUnit === 'ft' ? feetInchesToCm(heightFeet, heightInches) : heightCm
      const finalWeightKg = weightUnit === 'lbs' ? lbsToKg(weightLbs) : weightKg

      const result = await createUserProfile({
        name,
        gender: gender.toLowerCase() === 'male' ? 'male' : gender.toLowerCase() === 'female' ? 'female' : 'other',
        age,
        heightCm: finalHeightCm,
        weightKg: finalWeightKg,
        activityLevel: activityLevel as any,
        goal: goal as any,
        deficit: goal === 'maintain' ? 0 : deficit,
      })

      if (!result.success) {
        setError(result.error || 'Failed to save profile. Please try again.')
        setSaving(false)
        return
      }

      router.push('/dashboard')
    } catch (err: any) {
      console.error('Failed to save profile:', err)
      setError(err?.message || 'An unexpected error occurred.')
      setSaving(false)
    }
  }

  /* ═══════════════════════════════ */
  /*         STEP RENDERERS         */
  /* ═══════════════════════════════ */

  const renderStep1 = () => (
    <div>
      <h1 style={styles.stepTitle}>Welcome to FitFeed</h1>
      <p style={styles.stepSubtitle}>Let&apos;s get to know you so we can personalize your experience.</p>

      <label style={{ fontSize: '13px', fontWeight: 600, color: '#6B7B6B', letterSpacing: '0.5px', textTransform: 'uppercase' as const, marginBottom: '8px', display: 'block' }}>
        What&apos;s your name?
      </label>
      <input
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChange={e => setName(e.target.value)}
        autoFocus
      />

      <div style={{ marginTop: '32px' }}>
        <label style={{ fontSize: '13px', fontWeight: 600, color: '#6B7B6B', letterSpacing: '0.5px', textTransform: 'uppercase' as const, marginBottom: '12px', display: 'block' }}>
          Gender
        </label>
        <div style={styles.pillGroup}>
          {GENDERS.map(g => (
            <motion.button
              key={g}
              style={styles.pill(gender === g)}
              onClick={() => setGender(g)}
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
            >
              {g}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div>
      <h1 style={styles.stepTitle}>Body Stats</h1>
      <p style={styles.stepSubtitle}>We&apos;ll use this to calculate your daily needs.</p>

      {/* Date of Birth */}
      <label style={{ fontSize: '13px', fontWeight: 600, color: '#6B7B6B', letterSpacing: '0.5px', textTransform: 'uppercase' as const, marginBottom: '10px', display: 'block' }}>
        Date of Birth
      </label>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <select style={styles.select} value={dobDay} onChange={e => setDobDay(+e.target.value)}>
          {Array.from({ length: 31 }, (_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
        <select style={{ ...styles.select, flex: 1.4 }} value={dobMonth} onChange={e => setDobMonth(+e.target.value)}>
          {MONTHS.map((m, i) => (
            <option key={i} value={i + 1}>{m}</option>
          ))}
        </select>
        <select style={styles.select} value={dobYear} onChange={e => setDobYear(+e.target.value)}>
          {Array.from({ length: 80 }, (_, i) => currentYear - 10 - i).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      {age > 0 && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '13px', color: '#4C6544', fontWeight: 600, margin: '4px 0 24px' }}
        >
          Age: {age} years
        </motion.p>
      )}

      {/* Height */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#6B7B6B', letterSpacing: '0.5px', textTransform: 'uppercase' as const }}>
            Height
          </label>
          <motion.button
            onClick={toggleHeightUnit}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '6px 14px', borderRadius: '100px', border: '2px solid #4C6544',
              background: 'transparent', color: '#4C6544', fontSize: '12px', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'var(--font-inter)',
            }}
          >
            {heightUnit === 'cm' ? 'Switch to ft' : 'Switch to cm'}
          </motion.button>
        </div>
        {heightUnit === 'cm' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="number"
              style={styles.smallInput}
              value={heightCm}
              onChange={e => setHeightCm(+e.target.value)}
            />
            <span style={{ fontSize: '14px', color: '#6B7B6B', fontWeight: 600, flexShrink: 0 }}>cm</span>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="number"
              style={styles.smallInput}
              value={heightFeet}
              onChange={e => setHeightFeet(+e.target.value)}
            />
            <span style={{ fontSize: '14px', color: '#6B7B6B', fontWeight: 600, flexShrink: 0 }}>ft</span>
            <input
              type="number"
              style={styles.smallInput}
              value={heightInches}
              onChange={e => setHeightInches(+e.target.value)}
            />
            <span style={{ fontSize: '14px', color: '#6B7B6B', fontWeight: 600, flexShrink: 0 }}>in</span>
          </div>
        )}
      </div>

      {/* Weight */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#6B7B6B', letterSpacing: '0.5px', textTransform: 'uppercase' as const }}>
            Weight
          </label>
          <motion.button
            onClick={toggleWeightUnit}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '6px 14px', borderRadius: '100px', border: '2px solid #4C6544',
              background: 'transparent', color: '#4C6544', fontSize: '12px', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'var(--font-inter)',
            }}
          >
            {weightUnit === 'kg' ? 'Switch to lbs' : 'Switch to kg'}
          </motion.button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="number"
            style={styles.smallInput}
            value={weightUnit === 'kg' ? weightKg : weightLbs}
            onChange={e => {
              if (weightUnit === 'kg') setWeightKg(+e.target.value)
              else setWeightLbs(+e.target.value)
            }}
          />
          <span style={{ fontSize: '14px', color: '#6B7B6B', fontWeight: 600, flexShrink: 0 }}>{weightUnit}</span>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div>
      <h1 style={styles.stepTitle}>Activity Level</h1>
      <p style={styles.stepSubtitle}>How active are you on a typical week?</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {ACTIVITY_LEVELS.map(a => {
          const Icon = a.icon
          const active = activityLevel === a.key
          return (
            <motion.button
              key={a.key}
              style={styles.selectCard(active)}
              onClick={() => setActivityLevel(a.key)}
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
              layout
            >
              <div style={styles.iconCircle(active)}>
                <Icon size={22} color={active ? '#FFF' : '#6B7B6B'} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: active ? '#334533' : '#6B7B6B', marginBottom: '2px' }}>
                  {a.label}
                </div>
                <div style={{ fontSize: '12px', color: '#9BA39B' }}>
                  {a.desc} &middot; ×{a.mult}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div>
      <h1 style={styles.stepTitle}>Your Goal</h1>
      <p style={styles.stepSubtitle}>What are you working towards?</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
        {GOALS.map(g => {
          const Icon = g.icon
          const active = goal === g.key
          return (
            <motion.button
              key={g.key}
              style={styles.selectCard(active)}
              onClick={() => setGoal(g.key)}
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
              layout
            >
              <div style={styles.iconCircle(active)}>
                <Icon size={22} color={active ? '#FFF' : '#6B7B6B'} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: active ? '#334533' : '#6B7B6B', marginBottom: '2px' }}>
                  {g.label}
                </div>
                <div style={{ fontSize: '12px', color: '#9BA39B' }}>
                  {g.desc}
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Deficit / Surplus slider */}
      <AnimatePresence>
        {(goal === 'lose' || goal === 'gain') && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#6B7B6B', letterSpacing: '0.5px', textTransform: 'uppercase' as const, marginBottom: '12px', display: 'block' }}>
              Daily {goal === 'lose' ? 'deficit' : 'surplus'}
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[250, 500].map(val => (
                <motion.button
                  key={val}
                  style={{
                    ...styles.pill(deficit === val),
                    flex: 1,
                  }}
                  onClick={() => setDeficit(val)}
                  whileTap={{ scale: 0.96 }}
                >
                  {val} kcal
                </motion.button>
              ))}
            </div>
            <p style={{ fontSize: '12px', color: '#9BA39B', marginTop: '8px', textAlign: 'center' }}>
              {deficit === 250 ? 'Gradual and sustainable pace' : 'Aggressive but effective pace'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  const renderStep5 = () => {
    const { bmr, mult, tdee, dailyCal, protein, carbs, fat } = summary
    const goalLabel = goal === 'lose' ? 'deficit' : goal === 'gain' ? 'surplus' : ''
    const deficitText = goal !== 'maintain' ? `, ${goal === 'lose' ? '−' : '+'}${deficit} ${goalLabel} = ${dailyCal.toLocaleString()} kcal` : ''

    return (
      <div>
        <h1 style={styles.stepTitle}>Your Daily Plan</h1>
        <p style={styles.stepSubtitle}>Here&apos;s what we recommend based on your profile.</p>

        {/* Stat cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          {[
            { icon: Zap, label: 'Calories', value: `${dailyCal.toLocaleString()}`, unit: 'kcal', color: '#9B5D39' },
            { icon: User, label: 'Protein', value: `${protein}`, unit: 'g', color: '#4C6544' },
            { icon: Wheat, label: 'Carbs', value: `${carbs}`, unit: 'g', color: '#7D6B5A' },
            { icon: Droplets, label: 'Fat', value: `${fat}`, unit: 'g', color: '#6B8C5E' },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                style={styles.statCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Icon size={24} color={stat.color} style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#334533', fontFamily: 'var(--font-playfair)' }}>
                  {stat.value}
                  <span style={{ fontSize: '14px', fontWeight: 400, color: '#9BA39B', marginLeft: '4px' }}>{stat.unit}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#6B7B6B', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginTop: '4px' }}>
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Math subtext */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            padding: '16px 20px',
            borderRadius: '16px',
            background: 'rgba(76,101,68,0.06)',
            border: '1px solid rgba(76,101,68,0.12)',
          }}
        >
          <p style={{ fontSize: '13px', color: '#6B7B6B', lineHeight: 1.6, margin: 0 }}>
            BMR <strong style={{ color: '#334533' }}>{bmr.toLocaleString()}</strong> × {mult} activity = <strong style={{ color: '#334533' }}>{tdee.toLocaleString()} kcal</strong>{deficitText}
          </p>
          <p style={{ fontSize: '11px', color: '#9BA39B', margin: '6px 0 0' }}>
            30% protein · 40% carbs · 30% fat
          </p>
        </motion.div>
      </div>
    )
  }

  /* ═══════════════════════════════ */
  /*             RENDER             */
  /* ═══════════════════════════════ */

  const stepRenderers = [renderStep1, renderStep2, renderStep3, renderStep4, renderStep5]

  if (!mounted) {
    return (
      <div style={{ ...styles.wrapper, alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid #DFE8DD', borderTopColor: '#4C6544', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* ── Header ── */}
        <div style={styles.header}>
          {/* Progress bar */}
          <div style={styles.progressBar}>
            <motion.div
              style={{ ...styles.progressFill, width: `${(step / TOTAL_STEPS) * 100}%` }}
              layout
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>

          {/* Step dots */}
          <div style={styles.dots}>
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: step === i + 1 ? 1 : 0.7,
                  backgroundColor: i + 1 <= step ? '#4C6544' : '#DFE8DD',
                }}
                transition={{ duration: 0.3 }}
                style={{
                  width: step === i + 1 ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '100px',
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        <div style={styles.content}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              {stepRenderers[step - 1]()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Footer nav ── */}
        <div style={styles.footer}>
          {step > 1 && (
            <motion.button
              style={styles.btnSecondary}
              onClick={prev}
              whileTap={{ scale: 0.96 }}
            >
              Back
            </motion.button>
          )}
          <motion.button
            style={styles.btnPrimary(!canProceed || saving)}
            onClick={step === TOTAL_STEPS ? handleComplete : next}
            disabled={!canProceed || saving}
            whileTap={canProceed ? { scale: 0.96 } : {}}
            whileHover={canProceed ? { scale: 1.01 } : {}}
          >
            {saving ? 'Saving...' : step === TOTAL_STEPS ? '✨ Start Tracking' : 'Continue'}
          </motion.button>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                position: 'absolute',
                bottom: '100%',
                left: '24px',
                right: '24px',
                marginBottom: '8px',
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(155,93,57,0.1)',
                border: '1px solid rgba(155,93,57,0.2)',
                fontSize: '13px',
                color: '#9B5D39',
              }}
            >
              {error}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
