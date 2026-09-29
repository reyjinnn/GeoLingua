import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { progressApi } from '../../api/progressApi'
import { useAuth } from '../../hooks/useAuth'
import type { ProgressSummary } from '../../types/progress.types'

const defaultAttempts = [
  {
    id: 1,
    date: '26 Sep 2026, 14.30',
    title: 'Perkenalan sehari-hari',
    code: 'EN-A1-M1',
    score: 80,
    result: 'Lulus',
    moduleId: 1,
  },
  {
    id: 2,
    date: '24 Sep 2026, 10.15',
    title: 'Perkenalan sehari-hari',
    code: 'EN-A1-M1',
    score: 60,
    result: 'Belum lulus',
    moduleId: 1,
  },
]

export function ProgressPage() {
  const { user } = useAuth()
  const [summary, setSummary] = useState<ProgressSummary | null>(null)

  useEffect(() => {
    let active = true
    progressApi
      .summary()
      .then((data) => {
        if (active && data) setSummary(data)
      })
      .catch(() => {
        // Fallback to default mock data
      })
    return () => {
      active = false
    }
  }, [])

  const vocabCount = summary ? summary.vocabulary_from_completed_modules || 24 : 24
  const completedMods = summary ? summary.completed_modules ?? 1 : 1
  const avgQuizScore =
    summary && summary.average_quiz_score !== null
      ? `${summary.average_quiz_score}/100`
      : '70/100'

  const attempts =
    summary && summary.quiz_attempts && summary.quiz_attempts.length > 0
      ? summary.quiz_attempts.map((a) => ({
          id: a.id,
          date: a.attempted_at,
          title: a.module_title,
          code: a.module_code,
          score: a.score,
          result: a.is_passed ? 'Lulus' : 'Belum lulus',
          moduleId: a.module_id,
        }))
      : defaultAttempts

  const chartScores = attempts.map((a) => a.score).slice(-6)

  return (
    <>
      <header className="mb8">
        <div className="section-index">Atlas / learning log</div>
        <h1 className="mt3">Perjalanan belajarmu</h1>
        <p className="mt2 muted">
          Ringkasan rute, checkpoint, dan kata yang sudah masuk ke memori aktif.
        </p>
      </header>

      {/* Stats Cards */}
      <section className="grid3">
        <div className="card">
          <span className="tiny gray uppercase">Kosakata aktif</span>
          <p className="mt3 teal bold" style={{ fontSize: '34px', letterSpacing: '-0.04em' }}>
            {vocabCount}
          </p>
        </div>
        <div className="card">
          <span className="tiny gray uppercase">Modul dituntaskan</span>
          <p className="mt3 teal bold" style={{ fontSize: '34px', letterSpacing: '-0.04em' }}>
            {completedMods}
          </p>
        </div>
        <div className="card">
          <span className="tiny gray uppercase">Rata-rata kuis</span>
          <p className="mt3 teal bold" style={{ fontSize: '34px', letterSpacing: '-0.04em' }}>
            {avgQuizScore}
          </p>
        </div>
      </section>

      {/* Route Map Card */}
      <section className="card card-xl mt8">
        <div className="row">
          <div>
            <div className="section-index">Route map</div>
            <h3>{user?.active_course?.target_language || 'English'} A1</h3>
            <p className="small muted mt1">3 modul · titik saat ini di EN-A1-M1</p>
          </div>
          <span className="tag-code">20%</span>
        </div>

        <div className="progress-map mt7">
          <div className="row" style={{ alignItems: 'flex-start', gap: '20px' }}>
            {[
              ['01', 'Perkenalan', 'done'],
              ['02', 'Aktivitas', 'current'],
              ['03', 'Keluarga', 'locked'],
            ].map(([n, t, c]) => (
              <div key={n} className={`progress-stop ${c}`}>
                <div className="dot">{n}</div>
                <p>{t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz Trend Chart */}
      <section className="card mt8">
        <div className="row">
          <div>
            <div className="section-index">Checkpoint log</div>
            <h3>Nilai kuis terbaru</h3>
          </div>
          <span className="small gray">{chartScores.length} attempts</span>
        </div>

        <div className="quiz-chart mt6">
          {chartScores.map((score, idx) => (
            <div key={idx} className="chart-col">
              <span className="small semi">{score}</span>
              <div className="chart-track">
                <div
                  className="chart-fill"
                  style={{
                    height: `${Math.max(10, Math.min(100, score))}%`,
                    background: idx % 2 === 1 ? '#68c9ba' : '#28785e',
                  }}
                ></div>
              </div>
              <span className="tiny gray">M1</span>
            </div>
          ))}
        </div>
      </section>

      {/* Quiz History Table */}
      <section className="mt8">
        <div className="section-index">Learning log</div>
        <h2>Riwayat kuis</h2>
        <div className="table-wrap mt5">
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Modul</th>
                <th>Nilai</th>
                <th>Hasil</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt) => (
                <tr key={attempt.id}>
                  <td className="small muted">{attempt.date}</td>
                  <td>
                    <Link className="link" to={`/modules/${attempt.moduleId}`}>
                      {attempt.title}
                    </Link>
                    <span className="small gray" style={{ display: 'block' }}>
                      {attempt.code}
                    </span>
                  </td>
                  <td className="semi">{attempt.score}/100</td>
                  <td>
                    <span
                      className={`badge ${
                        attempt.result === 'Lulus' ? 'badge-green' : 'badge-amber'
                      }`}
                    >
                      {attempt.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
