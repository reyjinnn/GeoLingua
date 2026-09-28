import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { curriculumApi } from '../../api/curriculumApi'
import { useAuth } from '../../hooks/useAuth'
import type { ModuleSummary } from '../../types/curriculum.types'

const defaultModules: Array<{
  id: number
  code: string
  title: string
  topic: string
  status: 'Berjalan' | 'Terkunci' | 'Selesai'
  progress: number
}> = [
  {
    id: 1,
    code: 'EN-A1-M1',
    title: 'Perkenalan sehari-hari',
    topic: 'Daily Introductions',
    status: 'Berjalan',
    progress: 60,
  },
  {
    id: 2,
    code: 'EN-A1-M2',
    title: 'Aktivitas harian',
    topic: 'Daily Activities',
    status: 'Terkunci',
    progress: 0,
  },
  {
    id: 3,
    code: 'EN-A1-M3',
    title: 'Keluarga dan hubungan',
    topic: 'Family & Relationships',
    status: 'Terkunci',
    progress: 0,
  },
]

export function DashboardPage() {
  const { user } = useAuth()
  const [modules, setModules] = useState<ModuleSummary[]>([])

  useEffect(() => {
    let active = true
    curriculumApi
      .modules()
      .then((data) => {
        if (active && data && data.length > 0) setModules(data)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const userName = user?.full_name ? user.full_name.split(' ')[0] : 'Raihan'
  const targetLang = user?.active_course?.target_language || 'English'
  const levelName = user?.active_course?.current_level || 'A1'

  // Map API modules or use default sample modules
  const displayModules =
    modules.length > 0
      ? modules.map((m, idx) => {
          const isDone = m.is_completed || m.status === 'completed'
          const isLocked = m.status === 'locked' && !isDone
          const pct = isDone ? 100 : Number(m.progress_percentage) || 0
          const statusLabel: 'Berjalan' | 'Terkunci' | 'Selesai' = isDone
            ? 'Selesai'
            : isLocked
            ? 'Terkunci'
            : 'Berjalan'
          return {
            id: m.id,
            code: m.module_code || `EN-A1-M${idx + 1}`,
            title: m.title,
            topic: m.topic || 'General Topic',
            status: statusLabel,
            progress: pct,
          }
        })
      : defaultModules

  const activeModule = displayModules.find((m) => m.status === 'Berjalan') || displayModules[0]

  return (
    <>
      {/* Header */}
      <header className="mb8">
        <div className="dashboard-greeting">
          RUANG BELAJARMU · {targetLang.toUpperCase()} {levelName}
        </div>
        <div className="row" style={{ alignItems: 'flex-end' }}>
          <div>
            <h1>Halo, {userName}.</h1>
            <p className="mt3 muted">Satu rute aktif, satu percakapan lebih dekat.</p>
          </div>
          <span className="tag-code">
            {targetLang === 'English' ? 'EN' : targetLang} · {levelName}
          </span>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="dashboard-hero">
        <div>
          <span className="tag-code dark">CURRENT POSITION / 0{activeModule.id}</span>
          <h2 className="mt5">{activeModule.title}</h2>
          <p className="mt2">
            {targetLang} {levelName} · Modul 0{activeModule.id}
          </p>

          <div className="dashboard-route mt7">
            <div className="dashboard-route-line">
              <i className="done"></i>
              <i className="current"></i>
              <i></i>
              <i></i>
            </div>
            <div className="row">
              <span className="small">{activeModule.progress}% pelajaran dipelajari</span>
              <span className="small" style={{ color: '#b8c4d8' }}>
                18 / 30 kosakata
              </span>
            </div>
          </div>

          <div className="mt7">
            <Link className="btn" to={`/modules/${activeModule.id}`}>
              Lanjutkan belajar →
            </Link>
          </div>
        </div>

        <div className="dashboard-side">
          <div className="tiny uppercase" style={{ color: '#c2d6b4', letterSpacing: '1.5px' }}>
            Sedikit setiap hari
          </div>
          <h3 className="mt4" style={{ color: '#fff', fontSize: '23px' }}>
            Jaga ritme belajarmu.
          </h3>
          <div className="study-week">
            {['S', 'S', 'R', 'K', 'J', 'S', 'M'].map((d, i) => (
              <div
                key={i}
                className={`study-day ${i < 4 ? 'done' : i === 4 ? 'today' : ''}`}
              >
                {d}
                <b>{i < 4 ? '✓' : i + 1}</b>
              </div>
            ))}
          </div>
          <p className="dashboard-note">Contoh aktivitas mingguan · 4 hari belajar</p>
        </div>
      </section>

      {/* Module Map Section */}
      <section className="mt10">
        <div className="section-index">JALUR BELAJARMU</div>
        <div className="row">
          <div>
            <h2>Peta modul</h2>
            <p className="mt1 muted">Setiap modul adalah satu titik dalam rute {levelName}.</p>
          </div>
          <span className="tiny gray">01 — 0{displayModules.length}</span>
        </div>

        <div className="grid2 mt6">
          {displayModules.slice(0, 2).map((m, idx) => (
            <article
              key={m.id}
              className={`card module-card ${
                m.status === 'Selesai' ? 'complete' : m.status === 'Terkunci' ? 'locked' : ''
              }`}
            >
              <div className="row-start">
                <div className="flex-row" style={{ alignItems: 'flex-start' }}>
                  <span className="module-symbol">{String(idx + 1).padStart(2, '0')}</span>
                  <div>
                    <span className="module-index">{m.code}</span>
                    <h3 className="mt2">{m.title}</h3>
                    <p className="small muted mt1">{m.topic}</p>
                  </div>
                </div>
                <span
                  className={`badge ${
                    m.status === 'Terkunci'
                      ? 'badge-gray'
                      : m.status === 'Selesai'
                      ? 'badge-green'
                      : 'badge-blue'
                  }`}
                >
                  {m.status === 'Selesai' ? '✓ Selesai' : m.status}
                </span>
              </div>

              <div className="route-progress mt7">
                <i className="active"></i>
                <i
                  className={`${m.progress > 20 ? 'active' : ''} ${
                    m.progress > 20 && m.progress < 100 ? 'current' : ''
                  }`}
                ></i>
                <i className={`${m.progress >= 100 ? 'active' : ''}`}></i>
                <i></i>
                <i></i>
              </div>

              <div className="row mt5">
                <span className="small semi">{m.progress}% selesai</span>
                <span className="tiny gray">
                  Rute {String(idx + 1).padStart(2, '0')} / 03
                </span>
              </div>

              <div className="road-bottom">
                <div className="row">
                  <span className="tiny gray">
                    {m.status === 'Terkunci'
                      ? 'Selesaikan modul sebelumnya'
                      : m.status === 'Selesai'
                      ? 'Sudah masuk logbook'
                      : 'Rute aktif'}
                  </span>
                  {m.status === 'Terkunci' ? (
                    <span className="small muted">Terkunci</span>
                  ) : (
                    <Link
                      className="link"
                      to={`/modules/${m.id}`}
                    >
                      {m.status === 'Selesai' ? 'Lihat lagi →' : 'Lanjutkan →'}
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {displayModules.length > 2 && (
          <div className="mt4">
            {displayModules.slice(2).map((m, idx) => (
              <article
                key={m.id}
                className={`card module-card ${
                  m.status === 'Selesai' ? 'complete' : m.status === 'Terkunci' ? 'locked' : ''
                }`}
              >
                <div className="row-start">
                  <div className="flex-row" style={{ alignItems: 'flex-start' }}>
                    <span className="module-symbol">{String(idx + 3).padStart(2, '0')}</span>
                    <div>
                      <span className="module-index">{m.code}</span>
                      <h3 className="mt2">{m.title}</h3>
                      <p className="small muted mt1">{m.topic}</p>
                    </div>
                  </div>
                  <span
                    className={`badge ${
                      m.status === 'Terkunci'
                        ? 'badge-gray'
                        : m.status === 'Selesai'
                        ? 'badge-green'
                        : 'badge-blue'
                    }`}
                  >
                    {m.status === 'Selesai' ? '✓ Selesai' : m.status}
                  </span>
                </div>

                <div className="route-progress mt7">
                  <i className="active"></i>
                  <i className={`${m.progress > 20 ? 'active' : ''}`}></i>
                  <i className={`${m.progress >= 100 ? 'active' : ''}`}></i>
                  <i></i>
                  <i></i>
                </div>

                <div className="row mt5">
                  <span className="small semi">{m.progress}% selesai</span>
                  <span className="tiny gray">Rute 03 / 03</span>
                </div>

                <div className="road-bottom">
                  <div className="row">
                    <span className="tiny gray">
                      {m.status === 'Terkunci'
                        ? 'Selesaikan modul sebelumnya'
                        : m.status === 'Selesai'
                        ? 'Sudah masuk logbook'
                        : 'Rute aktif'}
                    </span>
                    {m.status === 'Terkunci' ? (
                      <span className="small muted">Terkunci</span>
                    ) : (
                      <Link className="link" to={`/modules/${m.id}`}>
                        {m.status === 'Selesai' ? 'Lihat lagi →' : 'Lanjutkan →'}
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Learning Notes Section */}
      <section className="mt10">
        <div className="section-index">CATATAN BELAJAR</div>
        <div className="grid3">
          <article className="card brand-stat">
            <span className="brand-stat-icon">A1</span>
            <div>
              <div className="small muted">Jalur aktif</div>
              <strong className="mt1" style={{ display: 'block' }}>
                {targetLang}
              </strong>
            </div>
          </article>
          <article className="card brand-stat">
            <span className="brand-stat-icon">↗</span>
            <div>
              <div className="small muted">Streak</div>
              <strong className="mt1" style={{ display: 'block' }}>
                4 hari
              </strong>
            </div>
          </article>
          <article className="card brand-stat">
            <span className="brand-stat-icon">◎</span>
            <div>
              <div className="small muted">Kuis berikutnya</div>
              <strong className="mt1" style={{ display: 'block' }}>
                {levelName} / M01
              </strong>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}
