import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/common/Button'

export function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  if (!user) {
    return (
      <section className="mx-auto max-w-xl text-center py-12">
        <p className="text-slate-600">Memuat data profil pengguna...</p>
      </section>
    )
  }

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
    <section className="mx-auto max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Profil Akun</h1>
        <p className="mt-1 text-slate-600">Informasi akun dan preferensi belajar GeoLingua Anda.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Info Akun */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-xl font-bold text-brand">
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{user.full_name}</h2>
              <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 capitalize">
                {user.role}
              </span>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <span className="block text-slate-500">Email</span>
              <span className="font-medium text-slate-800">{user.email}</span>
            </div>
            <div>
              <span className="block text-slate-500">ID Pengguna</span>
              <span className="font-mono text-xs text-slate-700">#{user.id}</span>
            </div>
          </div>
        </div>

        {/* Konteks Kursus Belajar Aktif */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-4">Jalur Belajar Aktif</h2>
            {user.active_course ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center rounded-lg bg-blue-50 p-4 border border-blue-100">
                  <div>
                    <span className="block text-xs font-semibold uppercase text-blue-600 tracking-wider">Bahasa Pembelajaran</span>
                    <p className="font-bold text-slate-800 text-base">
                      {user.active_course.target_language}
                    </p>
                    <span className="text-xs text-slate-500">
                      Pengantar: {user.active_course.base_language}
                    </span>
                  </div>
                  <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">
                    {user.active_course.current_level}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Progres materi dan latihan disesuaikan dengan level bahasa aktif ini.
                </p>
              </div>
            ) : (
              <div className="rounded-lg bg-amber-50 p-4 border border-amber-200 text-amber-800 text-sm">
                Belum ada kursus aktif. Selesaikan onboarding untuk memilih bahasa.
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link to="/onboarding">
              <Button className="w-full bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm">
                Ganti atau Pilih Kursus Baru
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tindakan Sesi */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-800">Sesi & Keamanan</h3>
          <p className="text-sm text-slate-500">Keluar dari akun GeoLingua pada perangkat ini.</p>
        </div>
        <Button
          onClick={handleLogout}
          disabled={loggingOut}
          className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
        >
          {loggingOut ? 'Keluar...' : 'Keluar Akun'}
        </Button>
      </div>
    </section>
  )
}
