import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetCooldown, setResetCooldown] = useState(0)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const redirectTo = searchParams.get('redirect') || '/resources'

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession()
      if (data?.session) {
        navigate(redirectTo, { replace: true })
      }
    }
    checkSession()
  }, [navigate, redirectTo])

  useEffect(() => {
    if (resetCooldown <= 0) return
    const timer = setTimeout(() => setResetCooldown((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [resetCooldown])

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) throw error

      if (data?.session) {
        navigate(redirectTo)
      }
    } catch (err) {
      const msg = (err.message || '').toLowerCase()
      if (msg.includes('invalid login') || msg.includes('invalid credentials') || msg.includes('wrong password')) {
        setError('Incorrect email or password.')
      } else if (msg.includes('email not confirmed')) {
        setError('Please verify your email before logging in.')
      } else if (msg.includes('too many') || msg.includes('rate limit')) {
        setError('Too many attempts. Please wait a few minutes and try again.')
      } else if (msg.includes('network') || msg.includes('fetch')) {
        setError('Network error. Check your connection and try again.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setError('Enter your email first.')
      return
    }

    if (resetCooldown > 0) {
      setError(`Please wait ${resetCooldown}s before requesting again.`)
      return
    }

    setResetLoading(true)
    setError('')
    setMessage('')

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/#/reset-password`,
    })

    setResetLoading(false)

    if (error) {
      const msg = error.message.toLowerCase()
      if (msg.includes('rate limit') || msg.includes('email limit')) {
        setError('Too many attempts. Please wait a few minutes and try again.')
      } else {
        setError('Could not send reset link. Please try again.')
      }
      return
    }

    setMessage('Password reset link sent. Check your inbox and spam folder.')
    setResetCooldown(60)
  }

  return (
    <section className="max-w-[720px] mx-auto px-6 py-20">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-10 shadow-[0_0_40px_rgba(0,0,0,0.15)]">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--accent)] mb-3 font-bold">
          Member Login
        </p>

        <h1 className="font-display text-[var(--text)] text-[clamp(2rem,4vw,3rem)] font-semibold mb-4">
          Welcome Back
        </h1>

        <p className="font-body text-[var(--text-muted)] leading-relaxed mb-8">
          Login to upload notes, manuals and access community contributions.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label htmlFor="email" className="block text-sm text-[var(--text)]">
            Email Address
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
            />
          </label>

          <label htmlFor="password" className="block text-sm text-[var(--text)]">
            Password
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="btn-primary w-full px-5 py-3 rounded-lg text-sm"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={resetLoading || resetCooldown > 0}
            className="w-full text-sm text-[var(--accent)] hover:text-[var(--text)] disabled:opacity-50"
          >
            {resetLoading
              ? 'Sending reset link…'
              : resetCooldown > 0
                ? `Try again in ${resetCooldown}s`
                : 'Forgot Password?'}
          </button>

          {error && <p role="alert" className="text-sm text-[var(--accent)]">{error}</p>}
          {message && <p role="status" className="text-sm text-accent-lime">{message}</p>}
        </form>

        <p className="mt-6 text-sm text-[var(--text-muted)]">
          Don't have an account?{' '}
          <Link
            to={`/signup?redirect=${encodeURIComponent(redirectTo)}`}
            className="text-[var(--accent)] hover:text-[var(--text)]"
          >
            Create account
          </Link>
        </p>
      </div>
    </section>
  )
}
