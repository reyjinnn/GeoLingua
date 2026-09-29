import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi, type AdminModuleItem } from '../../api/adminApi'

interface LearnerActivity {
  id: string
  name: string
  action: string
  target: string
  score?: string
  timeAgo: string
  badgeColor: string
}

const mockActivities: LearnerActivity[] = [
  {
    id: 'act-1',
    name: 'Budi Santoso',
    action: 'Menyelesaikan Kuis Modul 1',
    target: 'Perkenalan Sehari-hari',
    score: '100% (10/10)',
    timeAgo: '4 menit lalu',
    badgeColor: 'badge-green',
  },
  {
    id: 'act-2',
    name: 'Siti Rahma',
    action: 'Menyelesaikan Latihan Writing',
    target: 'Pelajaran: Salam dan Sapaan',
    score: 'Benchmark Terpenuhi',
    timeAgo: '18 menit lalu',
    badgeColor: 'badge-blue',
  },
  {
    id: 'act-3',
    name: 'Ahmad Dani',
    action: 'Menuntaskan Sesi Drill Kosakata',
    target: '12 kata diingat lancar',
    score: 'Streak 5 Hari',
    timeAgo: '45 menit lalu',
    badgeColor: 'badge-teal',
  },
  {
    id: 'act-4',
    name: 'Dewi Lestari',
    action: 'Mendaftar Akun Baru & Onboarding',
    target: 'Target: Percakapan Santai',
    score: 'Rute Aktif',
    timeAgo: '2 jam lalu',
    badgeColor: 'badge-amber',
  },
]

export function AdminDashboardPage() {
  const [modules, setModules] = useState<AdminModuleItem[]>([
    {
      id: 1,
      course_id: 1,
      level_id: 1,
      module_code: 'EN-A1-M1',
      title: 'Perkenalan sehari-hari',
      topic: 'Daily Introductions',
      status: 'published',
      order_index: 1,
      lesson_count: 3,
    },
    {
      id: 2,
      course_id: 1,
      level_id: 1,
      module_code: 'EN-A1-M2',
      title: 'Aktivitas harian',
      topic: 'Daily Activities',
      status: 'draft',
      order_index: 2,
      lesson_count: 3,
    },
  ])

  useEffect(() => {
    adminApi
      .listModules()
      .then((res) => {
        if (res && res.modules && res.modules.length > 0) {
          setModules(res.modules)
        }
      })
      .catch(() => {
        // Fallback default modules
      })
  }, [])

  return (
    <section className="wrap-lg">
      {/* Admin Executive Hero */}
      <div className="admin-hero">
        <div className="flex-wrap" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="tag-code dark">GEO / COMMAND</span>
          <span className="tag-code dark">EXECUTIVE OVERVIEW</span>
        </div>
        <h1 className="mt5" style={{ color: '#fff', fontSize: '38px', letterSpacing: '-0.03em' }}>
          Dasbor Kontrol GeoLingua
        </h1>
        <p className="mt2" style={{ color: '#c4cfdf', maxWidth: '720px', lineHeight: 1.6 }}>
          Pusat pemantauan kurikulum, statistik pembelajar, performa materi latihan, dan status
          penerbitan modul kurikulum GeoLingua.
        </p>

        <div className="flex-wrap mt6" style={{ display: 'flex', gap: '10px' }}>
          <Link
            to="/admin/modules?tab=modules"
            className="btn"
            style={{ minHeight: '38px', fontSize: '13px', padding: '8px 16px' }}
          >
            + Buat Modul Baru
          </Link>
          <Link
            to="/admin/modules?tab=lessons"
            className="btn-outline"
            style={{
              minHeight: '38px',
              fontSize: '13px',
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.1)',
              borderColor: 'rgba(255,255,255,0.25)',
              color: '#fff',
            }}
          >
            + Tambah Pelajaran
          </Link>
          <Link
            to="/admin/modules?tab=vocabularies"
            className="btn-outline"
            style={{
              minHeight: '38px',
              fontSize: '13px',
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.1)',
              borderColor: 'rgba(255,255,255,0.25)',
              color: '#fff',
            }}
          >
            + Tambah Kosakata
          </Link>
          <Link
            to="/admin/modules?tab=drills"
            className="btn-outline"
            style={{
              minHeight: '38px',
              fontSize: '13px',
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.1)',
              borderColor: 'rgba(255,255,255,0.25)',
              color: '#fff',
            }}
          >
            + Buat Drill
          </Link>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid4 mt7 mb8">
        <div className="card">
          <div className="row">
            <span className="tag-code">LEARNERS</span>
            <span className="badge badge-green">+14.2%</span>
          </div>
          <div className="mt4">
            <h2 style={{ fontSize: '32px', fontWeight: 850, color: 'var(--ink)' }}>1.428</h2>
            <p className="small muted mt1">Pembelajar aktif terdaftar</p>
          </div>
          <div className="bar mt4 bar-sm">
            <span style={{ width: '74%' }}></span>
          </div>
        </div>

        <div className="card">
          <div className="row">
            <span className="tag-code">CURRICULUM</span>
            <span className="badge badge-blue">A1 Level</span>
          </div>
          <div className="mt4">
            <h2 style={{ fontSize: '32px', fontWeight: 850, color: 'var(--ink)' }}>
              {modules.length} Modul
            </h2>
            <p className="small muted mt1">
              {modules.reduce((acc, m) => acc + (m.lesson_count || 3), 0)} Pelajaran tersusun
            </p>
          </div>
          <div className="bar mt4 bar-sm">
            <span style={{ width: '85%' }}></span>
          </div>
        </div>

        <div className="card">
          <div className="row">
            <span className="tag-code">QUIZ MASTERY</span>
            <span className="badge badge-green">88.2%</span>
          </div>
          <div className="mt4">
            <h2 style={{ fontSize: '32px', fontWeight: 850, color: 'var(--ink)' }}>86.5/100</h2>
            <p className="small muted mt1">Rata-rata skor evaluasi modul</p>
          </div>
          <div className="bar mt4 bar-sm">
            <span style={{ width: '88%' }}></span>
          </div>
        </div>

        <div className="card">
          <div className="row">
            <span className="tag-code">VOCABULARY</span>
            <span className="badge badge-teal">Verified</span>
          </div>
          <div className="mt4">
            <h2 style={{ fontSize: '32px', fontWeight: 850, color: 'var(--ink)' }}>384</h2>
            <p className="small muted mt1">Specimen kata dengan IPA & contoh</p>
          </div>
          <div className="bar mt4 bar-sm">
            <span style={{ width: '68%' }}></span>
          </div>
        </div>
      </div>

      {/* Main Grid: Modules & Recent Learner Activity */}
      <div className="grid2" style={{ gap: '24px', alignItems: 'start' }}>
        {/* Module Health Overview */}
        <div className="card card-xl">
          <div className="row">
            <div>
              <div className="section-index">Curriculum status</div>
              <h3>Peta Kurikulum & Penerbitan</h3>
            </div>
            <Link to="/admin/modules?tab=modules" className="link small">
              Kelola di CMS →
            </Link>
          </div>

          <p className="small muted mt2">
            Status kesiapan modul sebelum dibuka untuk alur belajar learner.
          </p>

          <div className="table-wrap mt5">
            <table>
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Judul Modul</th>
                  <th>Pelajaran</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {modules.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <span className="tag-code">{m.module_code}</span>
                    </td>
                    <td>
                      <strong style={{ display: 'block', fontSize: '14px' }}>{m.title}</strong>
                      <span className="small muted">{m.topic}</span>
                    </td>
                    <td>{m.lesson_count || 3} unit</td>
                    <td>
                      <span
                        className={`badge ${
                          m.status === 'published' ? 'badge-green' : 'badge-amber'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td>
                      <Link className="link" to={`/admin/modules/${m.id}/edit`}>
                        Editor →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card-soft mt5" style={{ background: '#f8fafc' }}>
            <div className="row">
              <div>
                <strong>Standar Publikasi Modul</strong>
                <p className="small muted mt1">
                  Setiap modul wajib memiliki minimal 1 pelajaran dengan kosakata, latihan drill,
                  prompt writing, dan kuis 10 pertanyaan valid.
                </p>
              </div>
              <Link to="/admin/modules/1/edit" className="btn-outline-blue small">
                Buka Validator
              </Link>
            </div>
          </div>
        </div>

        {/* Live Learner Activity */}
        <div className="card card-xl">
          <div className="row">
            <div>
              <div className="section-index">Live Stream</div>
              <h3>Aktivitas Pembelajar Terkini</h3>
            </div>
            <span className="tag-code">REALTIME</span>
          </div>

          <p className="small muted mt2">
            Pemantauan langsung interaksi siswa dengan modul dan latihan.
          </p>

          <div className="field-stack mt5">
            {mockActivities.map((act) => (
              <div
                key={act.id}
                className="card-soft"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#fff',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'var(--brand-soft)',
                        color: 'var(--brand)',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '12px',
                        fontWeight: 750,
                      }}
                    >
                      {act.name.charAt(0)}
                    </span>
                    <strong>{act.name}</strong>
                  </div>
                  <p className="small mt1" style={{ color: 'var(--ink)' }}>
                    {act.action} · <span className="muted">{act.target}</span>
                  </p>
                  <small className="muted">{act.timeAgo}</small>
                </div>
                {act.score && <span className={`badge ${act.badgeColor}`}>{act.score}</span>}
              </div>
            ))}
          </div>

          {/* Quick CMS Access Links */}
          <div className="mt6 pt5" style={{ borderTop: '1px solid var(--line)' }}>
            <div className="section-index">Direct Shortcuts</div>
            <div className="flex-wrap mt3" style={{ display: 'flex', gap: '8px' }}>
              <Link to="/admin/modules?tab=modules" className="pill">
                Kelola Modul
              </Link>
              <Link to="/admin/modules?tab=lessons" className="pill">
                Form Pelajaran
              </Link>
              <Link to="/admin/modules?tab=vocabularies" className="pill">
                Specimen Kosakata
              </Link>
              <Link to="/admin/modules?tab=drills" className="pill">
                Bank Soal Drill
              </Link>
              <Link to="/admin/modules/1/edit" className="pill">
                Editor Modul #1
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
