'use client'

import React, { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { loginAction, signupAction } from './actions'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (formData: FormData) => {
    setError('')
    startTransition(async () => {
      const action = mode === 'login' ? loginAction : signupAction
      const result = await action(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #F9F9F7 0%, #EDF2ED 40%, #DFE8DD 70%, #B9CDBE 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'var(--font-inter), sans-serif',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: '100%',
          maxWidth: '420px',
        }}
      >
        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            style={{
              width: '88px',
              height: '88px',
              margin: '0 auto 20px',
              position: 'relative',
            }}
          >
            <Image
              src="/logo-nobg.png"
              alt="FitFeed Logo"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </motion.div>
          <h1 style={{
            fontFamily: 'var(--font-playfair), serif',
            fontSize: '32px',
            color: '#334533',
            margin: '0 0 8px',
            fontWeight: 500,
            fontStyle: 'italic',
          }}>
            FitFeed
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7B6B', margin: 0 }}>
            Track your nourishment with care
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '32px 28px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
          border: '1px solid rgba(255,255,255,0.6)',
        }}>
          {/* Mode Toggle */}
          <div style={{
            display: 'flex',
            background: '#F0F4EE',
            borderRadius: '14px',
            padding: '4px',
            marginBottom: '28px',
          }}>
            {(['login', 'signup'] as const).map(m => (
              <motion.button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '11px',
                  border: 'none',
                  background: mode === m ? '#FFFFFF' : 'transparent',
                  color: mode === m ? '#334533' : '#9BA39B',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  boxShadow: mode === m ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  fontFamily: 'var(--font-inter)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                {m === 'login' ? 'Log In' : 'Sign Up'}
              </motion.button>
            ))}
          </div>

          {/* Form */}
          <form action={handleSubmit}>
            <div style={{ marginBottom: '16px', position: 'relative' }}>
              <Mail size={18} color="#9BA39B" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                name="email"
                type="email"
                placeholder="Email address"
                required
                autoComplete="email"
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 46px',
                  border: '2px solid #E8EDE6',
                  borderRadius: '14px',
                  fontSize: '15px',
                  fontFamily: 'var(--font-inter)',
                  color: '#334533',
                  background: 'rgba(255,255,255,0.6)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#4C6544'}
                onBlur={e => e.currentTarget.style.borderColor = '#E8EDE6'}
              />
            </div>

            <div style={{ marginBottom: '24px', position: 'relative' }}>
              <Lock size={18} color="#9BA39B" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                minLength={6}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 46px',
                  border: '2px solid #E8EDE6',
                  borderRadius: '14px',
                  fontSize: '15px',
                  fontFamily: 'var(--font-inter)',
                  color: '#334533',
                  background: 'rgba(255,255,255,0.6)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#4C6544'}
                onBlur={e => e.currentTarget.style.borderColor = '#E8EDE6'}
              />
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    background: 'rgba(155,93,57,0.08)',
                    border: '1px solid rgba(155,93,57,0.2)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    marginBottom: '16px',
                    fontSize: '13px',
                    color: '#9B5D39',
                  }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isPending}
              whileTap={!isPending ? { scale: 0.97 } : {}}
              whileHover={!isPending ? { scale: 1.01 } : {}}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '14px',
                border: 'none',
                background: isPending
                  ? '#B9CDBE'
                  : 'linear-gradient(135deg, #4C6544 0%, #6B8C5E 100%)',
                color: '#FFF',
                fontSize: '16px',
                fontWeight: 600,
                cursor: isPending ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: isPending ? 'none' : '0 4px 16px rgba(76,101,68,0.3)',
                fontFamily: 'var(--font-inter)',
                transition: 'all 0.3s',
              }}
            >
              {isPending ? (
                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  {mode === 'login' ? 'Log In' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Bottom text */}
        <p style={{
          textAlign: 'center',
          fontSize: '12px',
          color: '#9BA39B',
          marginTop: '24px',
        }}>
          {mode === 'login'
            ? "Don't have an account? Switch to Sign Up above."
            : 'Already have an account? Switch to Log In above.'
          }
        </p>
      </motion.div>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
