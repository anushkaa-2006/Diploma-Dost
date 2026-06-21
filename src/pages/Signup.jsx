import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Signup() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const redirectTo = searchParams.get('redirect') || '/resources'

  useEffect(() => {
    let mounted = true

    async function checkSession() {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      if (data?.session) {
        navigate(redirectTo, { replace: true })
      }
    }

    checkSession()

    return () => {
      mounted = false
    }
  }, [navigate, redirectTo])

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (!username.trim()) {
      setError('Username is required.')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            username: username.trim(),
          },
        },
      })

      if (error) {
        throw error
      }

      // The profile row is created automatically by the
      // handle_new_user() trigger on auth.users — the client never
      // touches the profiles table.
      const session = data?.session

      // Confirmation ON  → no session yet (trigger still made the profile)
      if (!session) {
        setMessage('Signup successful. Please check your email to confirm your account.')
        return
      }

      // Confirmation OFF → live session immediately, go straight in
      navigate(redirectTo)
    } catch (err) {
      setError(err?.message || 'Unable to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-[720px] mx-auto px-6 py-20">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-10 shadow-[0_0_40px_rgba(0,0,0,0.15)]">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-[var(--accent)] mb-3 font-bold">
          Create account
        </p>
        <h1 className="font-display text-[var(--text)] text-[clamp(2rem,4vw,3rem)] font-semibold mb-4">
          Join Diploma Dost
        </h1>
        <p className="font-body text-[var(--text-muted)] leading-relaxed mb-8">
          Sign up to upload notes, manuals, and community resources. Your account will keep uploads organized and trusted.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label htmlFor="username" className="block text-sm text-[var(--text)]">
            Username
            <input
              id="username"
              type="text"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)]"
            />
          </label>

          <label htmlFor="email" className="block text-sm text-[var(--text)]">
            Email address
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
              autoComplete="new-password"
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
            {loading ? 'Creating account…' : 'Sign up'}
          </button>

          {error && <p role="alert" className="text-sm text-[var(--accent)]">{error}</p>}
          {message && <p role="status" className="text-sm text-accent-lime">{message}</p>}
        </form>

        <p className="mt-6 text-sm text-[var(--text-muted)]">
          Already have an account?{' '}
          <Link to={`/login?redirect=${encodeURIComponent(redirectTo)}`} className="text-[var(--accent)] hover:text-[var(--text)]">
            Sign in.
          </Link>
        </p>
      </div>
    </section>
  )
}