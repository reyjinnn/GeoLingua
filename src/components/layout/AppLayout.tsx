import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname)
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    setMobileMenuOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname, location.search])

  async function signOut() {
    try {
      await logout()
    } finally {
      navigate('/')
    }
  }

  function scrollToSection(sectionId: string) {
    setMobileMenuOpen(false)
    if (!isHomePage) {
      navigate('/')
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="site">
      <header id="topbar" className={`topbar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className={`top-inner ${isPublicPage ? 'public-nav' : 'learner-nav'}`}>
          {/* Logo */}
          <Link
            className="logo"
            to={user ? '/dashboard' : '/'}
            aria-label="GeoLingua, beranda"
          >
            <span className="brand-mark" aria-hidden="true"></span>
            <span className="brand-word">
              <strong>GeoLingua</strong>
            </span>
          </Link>

          {/* 1. PUBLIC HEADER NAVIGATION */}
          {isPublicPage && (
            <>
              <div className="public-links" id="public-links">
                <button type="button" onClick={() => scrollToSection('program')}>
                  Pilihan belajar
                </button>
                <button type="button" onClick={() => scrollToSection('metode')}>
                  Cara belajar
                </button>
                <button type="button" onClick={() => scrollToSection('faq')}>
                  Tanya jawab
                </button>
                <button
                  type="button"
                  className="mobile-only"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    navigate('/login')
                  }}
                >
                  Masuk ke akun
                </button>
              </div>

              <nav className="nav" aria-label="Navigasi publik">
                <Link to="/login">Masuk</Link>
                <Link className="signup" to="/register">
                  Mulai belajar ↗
                </Link>
              </nav>

              <button
                className="menu-toggle"
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="public-links"
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            </>
          )}

          {/* 2. LEARNER HEADER NAVIGATION */}
          {!isPublicPage && (
            <>
              <nav className="nav" aria-label="Navigasi siswa">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  Dasbor
                </NavLink>
                <NavLink
                  to="/modules/1"
                  className={({ isActive }) =>
                    isActive || location.pathname.startsWith('/modules') ? 'active' : ''
                  }
                >
                  Modul
                </NavLink>
                <NavLink
                  to="/progress"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  Progres
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                >
                  Profil
                </NavLink>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="admin-switch-link"
                    title="Beralih ke panel kurikulum admin"
                  >
                    Panel Admin ⚙
                  </Link>
                )}
                <button type="button" onClick={signOut}>
                  Keluar
                </button>
              </nav>
            </>
          )}
        </div>
      </header>

      <main id="view" className={`main ${isHomePage ? 'home-page' : ''}`}>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-row">
          <div>
            <div className="footer-brand">GeoLingua</div>
            <p>Satu bahasa baru. Dunia yang lebih luas.</p>
          </div>
          <div className="footer-links">
            <Link to="/">Beranda</Link>
            <Link to="/lessons/1">Contoh pelajaran</Link>
            <Link to="/register">Mulai belajar</Link>
          </div>
          <p>
            © {new Date().getFullYear()} GeoLingua
            <br />
            Prototipe interaktif · Data contoh
          </p>
        </div>
      </footer>
    </div>
  )
}
