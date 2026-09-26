import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../components/common/Button'
import { useAuth } from '../../hooks/useAuth'

export function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  if (user) return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : user.active_course ? '/dashboard' : '/onboarding'} replace />

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('')
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email')).trim()
    const password = String(data.get('password'))
    if (mode === 'register') {
      const full_name = String(data.get('full_name')).trim()
      if (full_name.length < 3) { setError('Nama lengkap minimal 3 karakter.'); return }
      if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) { setError('Kata sandi minimal 8 karakter dan harus berisi huruf serta angka.'); return }
      if (password !== data.get('confirm_password')) { setError('Konfirmasi kata sandi belum cocok.'); return }
    }
    setBusy(true)
    try {
      if (mode === 'register') { await register({ full_name: String(data.get('full_name')).trim(), email, password }); navigate('/onboarding', { replace: true }) }
      else {
        const profile = await login({ email, password })
        const target = location.state?.from?.pathname
        const fallback = profile.role === 'admin' ? '/admin/dashboard' : profile.active_course ? '/dashboard' : '/onboarding'
        navigate(typeof target === 'string' ? target : fallback, { replace: true })
      }
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Permintaan gagal. Silakan coba lagi.') }
    finally { setBusy(false) }
  }

  return <section className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"><p className="text-sm font-semibold text-secondary">GeoLingua</p><h1 className="mt-2 text-3xl font-bold">{mode === 'login' ? 'Masuk ke akun' : 'Buat akun gratis'}</h1><p className="mt-2 text-slate-600">{mode === 'login' ? 'Lanjutkan perjalanan belajar Anda.' : 'Mulai belajar tanpa biaya langganan.'}</p>
    {error && <div role="alert" className="mt-5 rounded-lg bg-red-50 p-4 text-danger">{error}</div>}
    <form onSubmit={submit} className="mt-6 space-y-4">{mode === 'register' && <label className="block text-sm font-medium">Nama lengkap<input name="full_name" required minLength={3} autoComplete="name" className="mt-1 min-h-12 w-full rounded-lg border border-slate-300 px-3" /></label>}
      <label className="block text-sm font-medium">Email<input name="email" type="email" required autoComplete="email" className="mt-1 min-h-12 w-full rounded-lg border border-slate-300 px-3" /></label>
      <label className="block text-sm font-medium">Kata sandi<span className="mt-1 flex rounded-lg border border-slate-300"><input name="password" type={showPassword ? 'text' : 'password'} required minLength={mode === 'register' ? 8 : undefined} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} className="min-h-12 min-w-0 flex-1 rounded-lg px-3" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="min-h-12 px-3 text-brand">{showPassword ? 'Sembunyikan' : 'Lihat'}</button></span></label>
      {mode === 'register' && <label className="block text-sm font-medium">Konfirmasi kata sandi<input name="confirm_password" type="password" required autoComplete="new-password" className="mt-1 min-h-12 w-full rounded-lg border border-slate-300 px-3" /></label>}
      <Button disabled={busy} className="w-full">{busy ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Buat akun gratis'}</Button>
    </form><p className="mt-5 text-center text-sm text-slate-600">{mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'} <Link className="font-semibold text-brand" to={mode === 'login' ? '/register' : '/login'}>{mode === 'login' ? 'Daftar' : 'Masuk'}</Link></p></section>
}
