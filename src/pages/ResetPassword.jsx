import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [validLink, setValidLink] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

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

    setMessage('Password updated successfully. Redirecting to login…')
    setTimeout(() => navigate('/login?redirect=/resources'), 2000)
  }

  if (checking) {
    return (
      <section className="max-w-[720px] mx-auto px-6 py-20">
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-3xl p-10 text-center text-[#888]">
          Verifying reset link…
        </div>
      </section>
    )
  }

  if (!validLink) {
    return (
      <section className="max-w-[720px] mx-auto px-6 py-20">
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-3xl p-10">
          <h1 className="font-['Clash_Display'] text-[#f0ede6] text-2xl font-semibold mb-4">
            Invalid or expired link
          </h1>
          <p className="font-['General_Sans'] text-[#888] mb-6">
            Request a new password reset from the login page.
          </p>
          <Link to="/login" className="text-[#e8453c] hover:text-[#f0ede6]">
            Back to login
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-[720px] mx-auto px-6 py-20">
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-3xl p-10 shadow-[0_0_40px_rgba(0,0,0,0.15)]">
        <p className="font-['JetBrains_Mono'] text-[0.65rem] uppercase tracking-[0.14em] text-[#e8453c] mb-3 font-bold">
          Reset password
        </p>

        <h1 className="font-['Clash_Display'] text-[#f0ede6] text-[clamp(2rem,4vw,3rem)] font-semibold mb-4">
          Set a new password
        </h1>

        <p className="font-['General_Sans'] text-[#888] leading-relaxed mb-8">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm text-[#f0ede6]">
            New password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-2 w-full rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-3 text-sm text-[#f0ede6] outline-none focus:border-[#e8453c]"
            />
          </label>

          <label className="block text-sm text-[#f0ede6]">
            Confirm password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="mt-2 w-full rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-3 text-sm text-[#f0ede6] outline-none focus:border-[#e8453c]"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full px-5 py-3 rounded-lg text-sm"
          >
            {loading ? 'Updating…' : 'Update password'}
          </button>

          {error && <p className="text-sm text-[#e8453c]">{error}</p>}
          {message && <p className="text-sm text-green-400">{message}</p>}
        </form>
      </div>
    </section>
  )
}