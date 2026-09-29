import { Link, useLocation, useParams } from 'react-router-dom'
import type { QuizResult } from '../../types/learning.types'

export function QuizResultPage() {
  const { id } = useParams()
  const moduleId = id || '1'
  const location = useLocation()
  const state = location.state as { result?: QuizResult; quizTitle?: string } | null

  const isPassed = state?.result ? state.result.is_passed : true
  const score = state?.result ? state.result.score : 80
  const passingScore = state?.result?.passing_score || 70
  const title = state?.quizTitle || 'Perkenalan sehari-hari'

  return (
    <section className="completion-card wrap-sm">
      <div className={`completion-orbit ${isPassed ? 'success' : ''}`}>
        <span>{isPassed ? '✓' : '!'}</span>
      </div>
      <div className="brand-kicker mt4">Module checkpoint</div>
      <h1 className="mt4">{isPassed ? 'Rute terbuka.' : 'Rute perlu diulang.'}</h1>
      <p className="mt2 muted">Kuis Akhir Modul: {title}</p>

      <div className="score-card mt8">
        <div>
          <span className="tiny gray uppercase">Skor Anda</span>
          <strong style={{ color: isPassed ? '#164e42' : '#c24141' }}>{score}</strong>
        </div>
        <div className="score-divider"></div>
        <div>
          <span className="tiny gray uppercase">Batas lulus</span>
          <strong>{passingScore}</strong>
        </div>
      </div>

      <p className="small muted mt5">
        {isPassed
          ? 'Checkpoint selesai. Modul berikutnya dapat dibuka setelah rute saat ini dituntaskan.'
          : 'Ulangi modul dan coba checkpoint lagi untuk membuka rute berikutnya.'}
      </p>

      <div
        className="flex-wrap mt8"
        style={{ justifyContent: 'center', display: 'flex', gap: '14px' }}
      >
        <Link
          className="btn btn-outline"
          to={isPassed ? '/dashboard' : `/modules/${moduleId}`}
        >
          {isPassed ? 'Kembali ke dasbor' : 'Pelajari ulang modul'}
        </Link>
        {isPassed ? (
          <Link className="btn" to="/progress">
            Lihat progres belajar →
          </Link>
        ) : (
          <Link className="btn" to={`/modules/${moduleId}/quiz`}>
            Coba kuis lagi
          </Link>
        )}
      </div>
    </section>
  )
}
