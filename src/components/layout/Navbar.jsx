import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Search } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import SearchBar from '../SearchBar'

const navLinks = [
  { label: 'Resources', path: '/resources' },
  { label: 'Roadmaps', path: '/roadmaps' },
  { label: 'CAP Updates', path: '/admission-progress' },
  { label: 'Innovations', path: '/innovation-hub' },
  { label: 'DSA & CP', path: '/dsa' },
  { label: 'YouTube', path: '/youtube' },
  { label: 'Internships', path: '/internships' },
  { label: 'Community', path: '/community' },
  { label: 'About', path: '/about' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [mobileSearch, setMobileSearch] = useState(false)
  const [desktopSearch, setDesktopSearch] = useState(false)
  const [user, setUser] = useState(null)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isHome = pathname === '/'
  const navRef = useRef(null)

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  useEffect(() => {
    setOpen(false)
    setMobileSearch(false)
    setDesktopSearch(false)
  }, [pathname])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // close desktop panel on Escape
  useEffect(() => {
    if (!desktopSearch) return
    const handle = (e) => { if (e.key === 'Escape') setDesktopSearch(false) }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [desktopSearch])

  // close desktop panel on outside click
  useEffect(() => {
    if (!desktopSearch) return
    const handle = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setDesktopSearch(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [desktopSearch])

  return (
    <nav
      ref={navRef}
      style={{
        background: 'rgba(13, 14, 15, 0.85)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center h-16 gap-4">

        {/* ── Logo ── */}
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3"
          style={{ textDecoration: 'none' }}
        >
          <img
            src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/model/dd-logo.png`}
            alt="Diploma Dost"
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '8px',
              objectFit: 'cover',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1.2rem',
              color: 'var(--text)',
              letterSpacing: '-0.02em',
            }}>
              Diploma <span style={{ color: 'var(--accent)' }}>Dost</span>
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              letterSpacing: '0.12em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
            }}>
              MSBTE K-Scheme
            </span>
          </div>
        </Link>

        {/* ── Desktop nav links ── */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-1">
          {navLinks.map(link => {
            const isActive = pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                aria-current={isActive ? 'page' : undefined}
                className={`font-ui text-sm px-2 py-2 rounded-lg transition-colors duration-200 outline-none ${isActive ? 'text-[#e8453c] bg-[#e8453c]/10' : 'text-[#888] hover:text-[#f0ede6] hover:bg-[#1a1a1a]'}`}
                onFocus={e => {
                  e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent)'
                }}
                onBlur={e => {
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* ── Desktop right: Search icon + CTA + Logout ── */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0 ml-auto">
          {!isHome && (
            <button
              className="p-2 rounded-lg transition-colors duration-200 outline-none"
              style={{ color: desktopSearch ? 'var(--accent)' : 'var(--text-muted)' }}
              onClick={() => setDesktopSearch(v => !v)}
              aria-label={desktopSearch ? 'Close search' : 'Open search'}
              aria-expanded={desktopSearch}
              onFocus={e => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent)' }}
              onBlur={e => { e.currentTarget.style.boxShadow = 'none' }}
            >
              {desktopSearch ? <X size={18} /> : <Search size={18} />}
            </button>
          )}
          <Link
            to="/predictor"
            className="btn-primary text-sm px-4 py-2 outline-none whitespace-nowrap"
            onFocus={e => {
              e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent)'
            }}
            onBlur={e => {
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            College Predictor
          </Link>
          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 text-sm rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition whitespace-nowrap"
            >
              Logout
            </button>
          )}
        </div>

        {/* ── Mobile right: search icon + hamburger ── */}
        <div className="md:hidden flex items-center gap-0.5 ml-auto">
          {!isHome && (
            <button
              className="p-2 rounded-lg transition-colors duration-200 outline-none"
              style={{ color: mobileSearch ? 'var(--accent)' : 'var(--text-muted)' }}
              onClick={() => { setMobileSearch(v => !v); setOpen(false); }}
              aria-label={mobileSearch ? 'Close search' : 'Open search'}
              onFocus={e => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent)' }}
              onBlur={e => { e.currentTarget.style.boxShadow = 'none' }}
            >
              {mobileSearch ? <X size={18} /> : <Search size={18} />}
            </button>
          )}
          <button
            className="p-2 rounded-lg text-[#888] hover:text-[#f0ede6] transition-colors duration-200 outline-none"
            onClick={() => { setOpen(!open); setMobileSearch(false); }}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onFocus={e => {
              e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent)'
              e.currentTarget.style.color = 'var(--text)'
            }}
            onBlur={e => {
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.color = 'var(--text-muted)'
            }}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Desktop search panel ── */}
      {!isHome && desktopSearch && (
        <div
          className="hidden md:block"
          style={{
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-3">
            <SearchBar autoFocus placeholder="Search pages, resources, playlists…" />
          </div>
        </div>
      )}

      {/* ── Mobile search panel ── */}
      {!isHome && mobileSearch && (
        <div
          className="md:hidden px-4 py-3"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <SearchBar placeholder="Search pages, resources…" />
        </div>
      )}

      {/* ── Mobile menu ── */}
      {open && (
        <div
          className="md:hidden px-4 pb-4 flex flex-col gap-1"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {navLinks.map(link => {
            const isActive = pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                aria-current={isActive ? 'page' : undefined}
                className={`font-ui text-base px-4 py-3 rounded-lg transition-colors duration-200 outline-none ${isActive ? 'text-[#e8453c] bg-[#e8453c]/10' : 'text-[#888] hover:text-[#f0ede6] hover:bg-[#1a1a1a]'}`}
                onFocus={e => {
                  e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent)'
                }}
                onBlur={e => {
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            to="/predictor"
            onClick={() => setOpen(false)}
            className="btn-primary text-sm px-4 py-3 outline-none text-center"
          >
            College Predictor
          </Link>
          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 text-sm rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  )
}