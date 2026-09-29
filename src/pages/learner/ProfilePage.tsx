import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const userName = user?.full_name || 'Raihan'
  const userEmail = user?.email || 'raihan@example.com'
  const userId = user?.id || 12
  const initial = userName.charAt(0).toUpperCase()
  const targetLang = user?.active_course?.target_language || 'Bahasa Inggris'
  const baseLang = user?.active_course?.base_language || 'Bahasa Indonesia'
  const level = user?.active_course?.current_level || 'A1'

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await logout()
      navigate('/login')
    } catch {
      setLoggingOut(false)
    }
  }

  return (
    <section className="wrap">
      <div className="section-index">Identity / learner profile</div>
      <header className="mb8">
        <h1 className="mt3">Profil akun</h1>
        <p className="mt2 muted">Informasi akun dan preferensi belajar GeoLingua Anda.</p>
      </header>

      {/* Profile Hero Banner */}
      <div className="profile-hero">
        <div className="profile-avatar">{initial}</div>
        <div>
          <span className="tag-code dark">
            {user?.role ? user.role.toUpperCase() : 'LEARNER'} / #{userId}
          </span>
          <h2 className="mt4">{userName}</h2>
          <p className="mt1" style={{ color: '#b8c4d8' }}>
            {userEmail}
          </p>
        </div>
        <div className="profile-coordinate">
          {level}
          <br />
          <span>EN / ID</span>
        </div>
      </div>

      {/* Two Column Details */}
      <div className="grid2 mt7">
        <div className="card card-xl">
          <div className="section-index">Active route</div>
          <div className="card-pale mt4 row">
            <div>
              <p className="tiny semi uppercase blue">Bahasa Pembelajaran</p>
              <p className="semi mt1">{targetLang}</p>
              <p className="tiny gray">Pengantar: {baseLang}</p>
            </div>
            <span className="badge" style={{ background: '#28785e', color: 'white' }}>
              {level}
            </span>
          </div>
          <p className="tiny gray mt3">
            Progres materi dan latihan disesuaikan dengan level bahasa aktif ini.
          </p>
          <div className="mt6">
            <Link className="btn btn-soft" to="/onboarding">
              Ganti atau Pilih Kursus Baru
            </Link>
          </div>
        </div>

        <div className="card card-xl">
          <div className="section-index">Account details</div>
          <div className="space small mt4">
            <div>
              <span className="gray" style={{ display: 'block' }}>
                Nama
              </span>
              <span className="semi">{userName}</span>
            </div>
            <div>
              <span className="gray" style={{ display: 'block' }}>
                Email
              </span>
              <span className="semi">{userEmail}</span>
            </div>
            <div>
              <span className="gray" style={{ display: 'block' }}>
                ID Pengguna
              </span>
              <span className="tag-code mt2">#{userId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Row */}
      <div className="card card-xl row mt7">
        <div>
          <p className="semi">Sesi & keamanan</p>
          <p className="small gray">Keluar dari akun GeoLingua pada perangkat ini.</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="btn btn-red"
        >
          {loggingOut ? 'Keluar...' : 'Keluar Akun'}
        </button>
      </div>
    </section>
  )
}
