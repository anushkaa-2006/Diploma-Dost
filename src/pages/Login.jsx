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
      setError(err.message)
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
        setError('Too many emails sent. Wait about an hour after one hour again try!!.')
      } else {
        setError(error.message)
      }
      return
    }

    setMessage('Password reset link sent. Check your inbox and spam folder.')
    setResetCooldown(60)
  }

  return (
    <section className="max-w-[720px] mx-auto px-6 py-20">
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-3xl p-10 shadow-[0_0_40px_rgba(0,0,0,0.15)]">
        <p className="font-['JetBrains_Mono'] text-[0.65rem] uppercase tracking-[0.14em] text-[#e8453c] mb-3 font-bold">
          Member Login
        </p>

        <h1 className="font-['Clash_Display'] text-[#f0ede6] text-[clamp(2rem,4vw,3rem)] font-semibold mb-4">
          Welcome Back
        </h1>

        <p className="font-['General_Sans'] text-[#888] leading-relaxed mb-8">
          Login to upload notes, manuals and access community contributions.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm text-[#f0ede6]">
            Email Address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-3 text-sm text-[#f0ede6] outline-none focus:border-[#e8453c]"
            />
          </label>

          <label className="block text-sm text-[#f0ede6]">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-3 text-sm text-[#f0ede6] outline-none focus:border-[#e8453c]"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full px-5 py-3 rounded-lg text-sm"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={resetLoading || resetCooldown > 0}
            className="w-full text-sm text-[#e8453c] hover:text-[#f0ede6] disabled:opacity-50"
          >
            {resetLoading
              ? 'Sending reset link…'
              : resetCooldown > 0
                ? `Try again in ${resetCooldown}s`
                : 'Forgot Password?'}
          </button>

          {error && <p className="text-sm text-[#e8453c]">{error}</p>}
          {message && <p className="text-sm text-green-400">{message}</p>}
        </form>

        <p className="mt-6 text-sm text-[#888]">
          Don't have an account?{' '}
          <Link
            to={`/signup?redirect=${encodeURIComponent(redirectTo)}`}
            className="text-[#e8453c] hover:text-[#f0ede6]"
          >
            Create one here
          </Link>
        </p>
      </div>
    </section>
  )
}