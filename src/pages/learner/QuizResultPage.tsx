import { Link, useLocation, useParams } from 'react-router-dom'
import { PageState } from '../../components/common/PageState'
import type { QuizResult } from '../../types/learning.types'

interface LocationState {
  result?: QuizResult
  quizId?: number
}

export function QuizResultPage() {
  const { id } = useParams()
  const location = useLocation()
  const state = (location.state ?? {}) as LocationState
  const result = state.result

  if (!result) {
    return (
      <PageState
        title="Hasil kuis tidak ditemukan"
        message="Silakan kerjakan kuis terlebih dahulu dari halaman modul."
      />
    )
  }

  const isPassed = result.is_passed

  return (
    <section className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold">Hasil Kuis</h1>

      <div
        className={`mt-6 rounded-lg border-2 p-6 ${
          isPassed ? 'border-green-300 bg-green-50' : 'border-amber-300 bg-amber-50'
        }`}
      >
        <p className="text-lg font-semibold">Skor Kamu</p>
        <p className="mt-2 text-5xl font-bold">{result.score}/100</p>
        <p className="mt-3">
          Passing score: <strong>{result.passing_score}</strong>
        </p>
        <p className={`mt-3 text-lg font-bold ${isPassed ? 'text-green-800' : 'text-amber-800'}`}>
          {isPassed ? '🎉 Selamat! Kamu Lulus Modul Ini' : '⚠ Belum Memenuhi Syarat Kelulusan'}
        </p>
        <p className="mt-2 text-sm text-slate-600">
          {isPassed
            ? 'Modul ini selesai. Lanjut ke modul berikutnya!'
            : 'Pelajari ulang materi modul ini lalu coba lagi.'}
        </p>
      </div>

      {isPassed && result.next_module_unlocked && (
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-5">
          <p className="font-semibold text-brand">🔓 Modul berikutnya terbuka!</p>
          <p className="mt-1 text-sm text-slate-700">
            {result.unlocked_module_id !== null
              ? `Modul ID ${result.unlocked_module_id} sudah bisa diakses di dasbor.`
              : 'Modul berikutnya sudah bisa diakses di dasbor.'}
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        {isPassed ? (
          <Link
            to="/dashboard"
            className="inline-flex min-h-12 items-center rounded-lg bg-brand px-6 font-semibold text-white hover:bg-brand-hover"
          >
            Lanjut ke Modul Berikutnya →
          </Link>
        ) : (
          <Link
            to={`/modules/${id}`}
            className="inline-flex min-h-12 items-center rounded-lg bg-brand px-6 font-semibold text-white hover:bg-brand-hover"
          >
            Pelajari Ulang Materi
          </Link>
        )}
        <Link
          to="/dashboard"
          className="inline-flex min-h-12 items-center rounded-lg border border-slate-300 px-6 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Kembali ke Dasbor
        </Link>
      </div>
    </section>
  )
}