import { useState, useEffect, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LandingPage } from './LandingPage'

export function AuthPage({ mode: initialMode }: { mode: 'login' | 'register' }) {
  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Form values state so demo click or toggle preserves fields
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Sync mode if route prop changes
  useEffect(() => {
    setMode(initialMode)
    setError('')
  }, [initialMode, location.pathname])

  // Prevent background scrolling while modal is open & handle Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [])

  const isLogin = mode === 'login'
  const isAdminLogin = location.pathname.includes('/admin')

  if (user) {
    return (
      <Navigate
        to={
          user.role === 'admin'
            ? '/admin/dashboard'
            : user.active_course
            ? '/dashboard'
            : '/onboarding'
        }
        replace
      />
    )
  }

  function handleClose() {
    if (location.state?.from) {
      navigate('/')
    } else if (window.history.length > 2) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const cleanEmail = email.trim()

    if (!isLogin) {
      const cleanName = fullName.trim()
      if (cleanName.length < 3) {
        setError('Nama lengkap minimal 3 karakter.')
        return
      }
      if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        setError('Kata sandi minimal 8 karakter dan harus berisi huruf serta angka.')
        return
      }
      if (password !== confirmPassword) {
        setError('Konfirmasi kata sandi belum sama.')
        return
      }
    }

    setBusy(true)
    try {
      if (!isLogin) {
        await register({
          full_name: fullName.trim(),
          email: cleanEmail,
          password,
        })
        navigate('/onboarding', { replace: true })
      } else {
        const profile = await login({ email: cleanEmail, password })
        const target = location.state?.from?.pathname
        const fallback =
          profile.role === 'admin'
            ? '/admin/dashboard'
            : profile.active_course
            ? '/dashboard'
            : '/onboarding'
        navigate(typeof target === 'string' ? target : fallback, { replace: true })
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Permintaan gagal. Silakan coba lagi.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-overlay-container">
      {/* Background Page Content (blurred under the modal toast) */}
      <div className="auth-blurred-background" aria-hidden="true">
        <LandingPage />
      </div>

      {/* Backdrop with optical blur */}
      <div
        className="auth-modal-backdrop"
        onClick={handleClose}
        aria-label="Tutup jendela masuk"
      />

      {/* Floating Glassmorphism Toast / Modal Dialog */}
      <div className="auth-toast-dialog" role="dialog" aria-modal="true">
        {/* Top Header with Brand & Close Button */}
        <div className="auth-toast-header">
          <div className="auth-toast-brand">
            <span className="brand-mark admin-mark" style={{ width: '28px', height: '28px' }} aria-hidden="true" />
            <span className="auth-toast-title">
              <strong>GeoLingua</strong>
              {isAdminLogin && <span className="auth-admin-chip">ADMIN ACCESS</span>}
            </span>
          </div>

          <button
            type="button"
            className="auth-toast-close"
            onClick={handleClose}
            title="Tutup (Esc)"
            aria-label="Tutup jendela"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Head Copy */}
        <div className="auth-toast-heading mt4">
          <h2>{isLogin ? 'Selamat Datang' : 'Mulai Belajar'}</h2>
          <p>
            {isLogin
              ? 'Masuk untuk melanjutkan rute latihan bahasa Anda.'
              : 'Buat akun gratis dan eksplorasi kurikulum A1.'}
          </p>
        </div>

        {error && (
          <div role="alert" className="auth-toast-alert mt4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={submit} className="auth-toast-form mt4">
          {!isLogin && (
            <div className="auth-field">
              <label htmlFor="auth-full-name">Nama lengkap</label>
              <input
                id="auth-full-name"
                className="auth-glass-input"
                name="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                minLength={3}
                autoComplete="name"
                placeholder="Contoh: Budi Pratama"
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              className="auth-glass-input"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="nama@email.com"
            />
          </div>

          <div className="auth-field">
            <div className="auth-field-header">
              <label htmlFor="auth-password">Kata sandi</label>
              <button
                type="button"
                className="auth-toggle-visibility"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? 'Sembunyikan' : 'Lihat'}
              </button>
            </div>
            <div className="auth-password-wrapper">
              <input
                id="auth-password"
                className="auth-glass-input"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={isLogin ? 1 : 8}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                placeholder={isLogin ? 'Masukkan kata sandi' : 'Minimal 8 karakter (huruf & angka)'}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="auth-field">
              <label htmlFor="auth-confirm-password">Konfirmasi kata sandi</label>
              <input
                id="auth-confirm-password"
                className="auth-glass-input"
                name="confirm_password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Ulangi kata sandi"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="auth-glass-btn mt3"
          >
            {busy ? (
              <span className="auth-btn-loader">Memproses...</span>
            ) : isLogin ? (
              'Masuk ke GeoLingua →'
            ) : (
              'Buat Akun Sekarang →'
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="auth-toast-footer mt4">
          <p>
            {isLogin ? 'Belum memiliki akun? ' : 'Sudah memiliki akun? '}
            <button
              type="button"
              className="auth-link-btn"
              onClick={() => {
                setMode(isLogin ? 'register' : 'login')
                setError('')
              }}
            >
              {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
