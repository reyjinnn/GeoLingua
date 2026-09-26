import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  async function signOut() { try { await logout() } finally { navigate('/') } }
  const navClass = ({ isActive }: { isActive: boolean }) => `inline-flex min-h-12 items-center px-3 font-medium ${isActive ? 'text-brand' : 'text-slate-600 hover:text-ink'}`
  return <div className="min-h-screen">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2">
      <Link to={user ? '/dashboard' : '/'} className="text-xl font-bold tracking-tight text-brand">GeoLingua</Link>
      <nav aria-label="Navigasi utama" className="flex flex-wrap items-center gap-1">
        {user ? <><NavLink to="/dashboard" className={navClass}>Dasbor</NavLink><NavLink to="/modules" className={navClass}>Modul</NavLink><NavLink to="/progress" className={navClass}>Progress</NavLink>{user.role === 'admin' && <NavLink to="/admin/dashboard" className={navClass}>Admin</NavLink>}<button onClick={signOut} className="min-h-12 px-3 font-medium text-slate-600">Keluar</button></> : <><NavLink to="/login" className={navClass}>Masuk</NavLink><Link to="/register" className="inline-flex min-h-12 items-center rounded-lg bg-brand px-4 font-semibold text-white">Daftar gratis</Link></>}
      </nav></div></header>
    <main className="mx-auto max-w-6xl px-4 py-8"><Outlet /></main>
    <footer className="mx-auto max-w-6xl border-t border-slate-200 px-4 py-6 text-sm text-slate-500">© {new Date().getFullYear()} GeoLingua · Belajar bahasa gratis</footer>
  </div>
}
