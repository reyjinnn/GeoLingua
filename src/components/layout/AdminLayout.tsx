import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/modules', label: 'Modul', icon: '📚' },
]

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function signOut() {
    try {
      await logout()
    } finally {
      navigate('/')
    }
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex min-h-12 items-center gap-3 rounded-lg px-4 font-medium transition ${
      isActive ? 'bg-brand text-white' : 'text-slate-700 hover:bg-slate-100'
    }`

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/admin/dashboard" className="text-xl font-bold text-brand">
            GeoLingua <span className="text-sm font-normal text-slate-500">Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:block">{user?.full_name}</span>
            <button
              onClick={signOut}
              className="min-h-10 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <aside className="hidden w-56 shrink-0 sm:block">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}