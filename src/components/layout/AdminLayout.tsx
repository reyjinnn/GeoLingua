import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const activeTab = searchParams.get('tab') || 'modules'

  // Close mobile drawer when route/tab changes
  useEffect(() => {
    setSidebarOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname, location.search])

  async function handleSignOut() {
    try {
      await logout()
    } finally {
      navigate('/login')
    }
  }

  // Determine breadcrumb label
  let breadcrumbSection = 'Dashboard'
  let breadcrumbDetail = 'Ikhtisar Sistem'

  if (location.pathname.startsWith('/admin/modules') || location.pathname.startsWith('/admin/curriculum')) {
    breadcrumbSection = 'Kurikulum'
    if (activeTab === 'modules') breadcrumbDetail = 'Daftar & Buat Modul'
    else if (activeTab === 'lessons') breadcrumbDetail = 'Pelajaran'
    else if (activeTab === 'vocabularies') breadcrumbDetail = 'Kosakata'
    else if (activeTab === 'drills') breadcrumbDetail = 'Bank Soal Active Recall'
  } else if (location.pathname.includes('/edit')) {
    breadcrumbSection = 'Kurikulum'
    breadcrumbDetail = 'Editor & Validator Modul'
  }

  const isModulesActive =
    (location.pathname === '/admin/modules' || location.pathname === '/admin/curriculum') &&
    (!searchParams.get('tab') || activeTab === 'modules')

  const isLessonsActive =
    (location.pathname === '/admin/modules' || location.pathname === '/admin/curriculum') &&
    activeTab === 'lessons'

  const isVocabActive =
    (location.pathname === '/admin/modules' || location.pathname === '/admin/curriculum') &&
    activeTab === 'vocabularies'

  const isDrillsActive =
    (location.pathname === '/admin/modules' || location.pathname === '/admin/curriculum') &&
    activeTab === 'drills'

  const isEditorActive =
    location.pathname.startsWith('/admin/modules/') && location.pathname.endsWith('/edit')

  const isDashboardActive =
    location.pathname === '/admin/dashboard' || location.pathname === '/admin'

  return (
    <div className={`admin-layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`admin-backdrop ${sidebarOpen ? 'show' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Admin Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`} aria-label="Navigasi CMS Admin">
        {/* Brand Header */}
        <div className="admin-sidebar-header">
          <Link to="/admin/dashboard" className="admin-brand-link" title="GeoLingua Admin Command">
            <span className="brand-mark admin-mark" aria-hidden="true" />
            <div className="admin-brand-text">
              <strong>GeoLingua</strong>
              <span className="admin-role-pill">ADMIN CMS</span>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            className="admin-mobile-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Tutup sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* User Card */}
        <div className="admin-user-card">
          <div className="admin-user-avatar">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="admin-user-info">
            <div className="admin-user-name" title={user?.full_name || 'Admin User'}>
              {user?.full_name || 'Administrator'}
            </div>
            <div className="admin-user-meta">
              <span className="admin-status-dot" aria-hidden="true" />
              <span className="admin-user-email" title={user?.email || 'admin@geolingua.id'}>
                {user?.email || 'admin@geolingua.id'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="admin-sidebar-nav">
          {/* Group 1: Ikhtisar */}
          <div className="admin-nav-group">
            <div className="admin-nav-group-title">IKHTISAR</div>
            <Link
              to="/admin/dashboard"
              className={`admin-nav-item ${isDashboardActive ? 'active' : ''}`}
              title="Dashboard Utama"
            >
              <span className="admin-nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="7" height="9" x="3" y="3" rx="1.5" />
                  <rect width="7" height="5" x="14" y="3" rx="1.5" />
                  <rect width="7" height="9" x="14" y="12" rx="1.5" />
                  <rect width="7" height="5" x="3" y="16" rx="1.5" />
                </svg>
              </span>
              <span className="admin-nav-label">Dashboard</span>
              <span className="admin-nav-badge live">Live</span>
            </Link>
          </div>

          {/* Group 2: Kurikulum & CMS */}
          <div className="admin-nav-group">
            <div className="admin-nav-group-title">MANAJEMEN KURIKULUM</div>
            <Link
              to="/admin/modules?tab=modules"
              className={`admin-nav-item ${isModulesActive ? 'active' : ''}`}
              title="Daftar & Kelola Modul"
            >
              <span className="admin-nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                </svg>
              </span>
              <span className="admin-nav-label">Modul</span>
              <span className="admin-nav-pill">A1</span>
            </Link>

            <Link
              to="/admin/modules?tab=lessons"
              className={`admin-nav-item ${isLessonsActive ? 'active' : ''}`}
              title="Kelola Pelajaran Tiap Modul"
            >
              <span className="admin-nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </span>
              <span className="admin-nav-label">Pelajaran</span>
            </Link>

            <Link
              to="/admin/modules?tab=vocabularies"
              className={`admin-nav-item ${isVocabActive ? 'active' : ''}`}
              title="Bank Kosakata & IPA"
            >
              <span className="admin-nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 8 6 6" />
                  <path d="m4 14 6-6 2-3" />
                  <path d="M2 5h12" />
                  <path d="M7 2h1" />
                  <path d="m22 22-5-10-5 10" />
                  <path d="M14 18h6" />
                </svg>
              </span>
              <span className="admin-nav-label">Kosakata</span>
            </Link>

            <Link
              to="/admin/modules?tab=drills"
              className={`admin-nav-item ${isDrillsActive ? 'active' : ''}`}
              title="Bank Soal Active Recall Drill"
            >
              <span className="admin-nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </span>
              <span className="admin-nav-label">Bank Soal Drill</span>
            </Link>

            <Link
              to="/admin/modules/1/edit"
              className={`admin-nav-item ${isEditorActive ? 'active' : ''}`}
              title="Editor & Validasi Publikasi Modul"
            >
              <span className="admin-nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </span>
              <span className="admin-nav-label">Editor Modul</span>
              <span className="admin-nav-badge validator">Validator</span>
            </Link>
          </div>

          {/* Group 3: Portal & Akun */}
          <div className="admin-nav-group">
            <div className="admin-nav-group-title">SISTEM & AKUN</div>
            <Link
              to="/dashboard"
              className="admin-nav-item student-mode"
              title="Beralih ke Tampilan Siswa / Learner"
            >
              <span className="admin-nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </span>
              <span className="admin-nav-label">Mode Siswa</span>
              <span className="admin-external-icon">↗</span>
            </Link>

            <Link
              to="/profile"
              className={`admin-nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
              title="Profil Pengguna"
            >
              <span className="admin-nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <span className="admin-nav-label">Profil Saya</span>
            </Link>

            <button
              type="button"
              className="admin-nav-item signout-btn"
              onClick={handleSignOut}
              title="Keluar dari Akun Admin"
            >
              <span className="admin-nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </span>
              <span className="admin-nav-label">Keluar</span>
            </button>
          </div>
        </nav>

        {/* Sidebar Footer with Collapse Toggle */}
        <div className="admin-sidebar-footer">
          <div className="admin-footer-meta">
            <span className="admin-system-label">GeoLingua CMS v1.2</span>
            <span className="admin-system-status">● Sistem Siap</span>
          </div>

          <button
            type="button"
            className="admin-collapse-toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Perluas Sidebar' : 'Perkecil Sidebar'}
            aria-label={collapsed ? 'Perluas Sidebar' : 'Perkecil Sidebar'}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: collapsed ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            >
              <polyline points="11 17 6 12 11 7" />
              <polyline points="18 17 13 12 18 7" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="admin-main-wrapper">
        {/* Top Header / Action Bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="admin-hamburger-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka menu sidebar"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </button>

            {/* Breadcrumb Navigation */}
            <div className="admin-breadcrumb">
              <span className="admin-breadcrumb-root">Admin</span>
              <span className="admin-breadcrumb-sep">/</span>
              <span className="admin-breadcrumb-section">{breadcrumbSection}</span>
              <span className="admin-breadcrumb-sep">/</span>
              <span className="admin-breadcrumb-current">{breadcrumbDetail}</span>
            </div>
          </div>

          <div className="admin-topbar-right">
            <Link
              to="/admin/modules?tab=modules"
              className="admin-quick-add-btn"
              title="Buat Modul Baru"
            >
              <span className="admin-add-plus">+</span>
              <span className="admin-add-text">Modul Baru</span>
            </Link>

            <Link
              to="/dashboard"
              className="admin-switch-badge-btn"
              title="Buka Dasbor Siswa"
            >
              <span>Mode Siswa</span>
              <span style={{ fontSize: '11px', opacity: 0.8 }}>↗</span>
            </Link>

            <div className="admin-topbar-profile" title={`Login sebagai: ${user?.email || 'admin'}`}>
              <div className="admin-topbar-avatar">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="admin-topbar-user">
                <span className="admin-topbar-name">{user?.full_name || 'Admin'}</span>
                <span className="admin-topbar-badge">STAFF CMS</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Admin Page Outlet */}
        <main className="admin-content-area" id="admin-view">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
