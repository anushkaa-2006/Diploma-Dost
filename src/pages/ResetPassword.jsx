import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [validLink, setValidLink] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const rawRedirect = searchParams.get('redirect')
  const safeRedirect = rawRedirect && rawRedirect.startsWith('/') ? rawRedirect : '/'

  useEffect(() => {
    let mounted = true

    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!mounted) return
      if (session) {
        setValidLink(true)
        setChecking(false)
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return
      if (event === 'PASSWORD_RECOVERY' || session) {
        setValidLink(true)
        setChecking(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    const { error: updateError } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setMessage('Password updated successfully. Redirecting…')
    setTimeout(() => navigate(safeRedirect), 2000)
  }

  if (checking) {
    return (
      <section className="max-w-[720px] mx-auto px-6 py-20">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-10 text-center text-[var(--text-muted)]">
          Verifying reset link…
        </div>
      </section>
    )
  }

  if (!validLink) {
    return (
      <section className="max-w-[720px] mx-auto px-6 py-20">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-10">
          <h1 className="font-['Clash_Display'] text-[var(--text)] text-2xl font-semibold mb-4">
            Invalid or expired link
          </h1>
          <p className="font-['General_Sans'] text-[var(--text-muted)] mb-6">
            Request a new password reset from the login page.
          </p>
          <Link to="/login" className="text-[var(--accent)] hover:text-[var(--text)]">
            Back to login
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-[720px] mx-auto px-6 py-20">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-10 shadow-[0_0_40px_rgba(0,0,0,0.15)]">
        <p className="font-['JetBrains_Mono'] text-[0.65rem] uppercase tracking-[0.14em] text-[var(--accent)] mb-3 font-bold">
          Reset password
        </p>

        <h1 className="font-['Clash_Display'] text-[var(--text)] text-[clamp(2rem,4vw,3rem)] font-semibold mb-4">
          Set a new password
        </h1>

        <p className="font-['General_Sans'] text-[var(--text-muted)] leading-relaxed mb-8">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm text-[var(--text)]">
            New password
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
            />
          </label>

          <label className="block text-sm text-[var(--text)]">
            Confirm password
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="btn-primary w-full px-5 py-3 rounded-lg text-sm"
          >
            {loading ? 'Updating…' : 'Update password'}
          </button>

          {error && <p role="alert" className="text-sm text-[var(--accent)]">{error}</p>}
          {message && <p role="status" className="text-sm" style={{ color: 'var(--accent-lime)' }}>{message}</p>}
        </form>
      </div>
    </section>
  )
}
