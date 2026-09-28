import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { progressApi } from '../../api/progressApi'
import { PageState } from '../../components/common/PageState'
import { useAuth } from '../../hooks/useAuth'
import type { ProgressSummary, QuizAttempt } from '../../types/progress.types'

const number = new Intl.NumberFormat('id-ID')

function attemptDate(value: string): string {
  const date = new Date(value.replace(' ', 'T'))
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function QuizHistory({ attempts }: { attempts: QuizAttempt[] }) {
  if (attempts.length === 0) {
    return <p className="rounded-lg border border-slate-200 bg-white p-6 text-slate-600">Belum ada kuis yang dikerjakan. Riwayat nilai akan muncul setelah kamu menyelesaikan kuis modul.</p>
  }

  return <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
    <table className="w-full min-w-[640px] text-left">
      <thead className="border-b border-slate-200 bg-slate-50 text-sm text-slate-600"><tr>
        <th scope="col" className="px-4 py-3 font-semibold">Tanggal</th>
        <th scope="col" className="px-4 py-3 font-semibold">Modul</th>
        <th scope="col" className="px-4 py-3 font-semibold">Nilai</th>
        <th scope="col" className="px-4 py-3 font-semibold">Hasil</th>
      </tr></thead>
      <tbody className="divide-y divide-slate-100">
        {attempts.map((attempt) => <tr key={attempt.id}>
          <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{attemptDate(attempt.attempted_at)}</td>
          <td className="px-4 py-4"><Link to={`/modules/${attempt.module_id}`} className="font-semibold text-brand hover:underline">{attempt.module_title}</Link><span className="block text-sm text-slate-500">{attempt.module_code}</span></td>
          <td className="px-4 py-4 font-semibold">{attempt.score}/100</td>
          <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-sm font-semibold ${attempt.is_passed ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{attempt.is_passed ? 'Lulus' : 'Belum lulus'}</span></td>
        </tr>)}
      </tbody>
    </table>
  </div>
}

export function ProgressPage() {
  const { user } = useAuth()
  const activeCourseId = user?.active_course?.id
  const [summary, setSummary] = useState<ProgressSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    if (!activeCourseId) return
    let active = true
    progressApi.summary()
      .then((data) => { if (active) setSummary(data) })
      .catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : 'Progres gagal dimuat.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [activeCourseId, reload])

  if (!activeCourseId) {
    return <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Mulai jalur belajarmu</h1>
      <p className="mt-2 text-slate-600">Pilih bahasa dan level lebih dulu untuk melihat progres.</p>
      <Link to="/onboarding" className="mt-5 inline-flex min-h-12 items-center rounded-lg bg-brand px-5 font-semibold text-white">Mulai onboarding</Link>
    </section>
  }

  return <>
    <header className="mb-8">
      <p className="font-semibold text-secondary">{user?.active_course?.current_level} · Progres belajar</p>
      <h1 className="mt-2 text-3xl font-bold">Perjalanan belajarmu</h1>
      <p className="mt-2 text-slate-600">Ringkasan modul dan kuis untuk jalur bahasa yang sedang aktif.</p>
    </header>

    {loading ? <p role="status">Memuat progres...</p> : error ? <PageState
      title="Progres belum dapat dimuat"
      message={error}
      retry={() => { setError(''); setLoading(true); setReload((value) => value + 1) }}
    /> : summary && <>
      <section aria-label="Ringkasan progres" className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-medium text-slate-600">Kosakata dari modul tuntas</p><p className="mt-2 text-3xl font-bold text-secondary">{number.format(summary.vocabulary_from_completed_modules)}</p></div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-medium text-slate-600">Modul dituntaskan</p><p className="mt-2 text-3xl font-bold text-secondary">{number.format(summary.completed_modules)}</p></div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-medium text-slate-600">Rata-rata nilai kuis</p><p className="mt-2 text-3xl font-bold text-secondary">{summary.average_quiz_score === null ? '—' : `${number.format(summary.average_quiz_score)}/100`}</p></div>
      </section>
      <p className="mt-3 text-sm text-slate-500">Kosakata dihitung satu kali dari modul yang sudah tuntas. Rata-rata mencakup seluruh percobaan kuis di jalur aktif.</p>

      {summary.quiz_attempts.length > 0 && <section aria-labelledby="quiz-trend-title" className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 id="quiz-trend-title" className="text-xl font-semibold">Nilai kuis terbaru</h2>
        <div className="mt-5 grid grid-cols-6 items-end gap-3" role="img" aria-label={`Nilai kuis terbaru: ${summary.quiz_attempts.slice(0, 6).reverse().map((attempt) => `${attempt.module_code} ${attempt.score}`).join(', ')}`}>
          {summary.quiz_attempts.slice(0, 6).reverse().map((attempt) => <div key={attempt.id} className="flex min-w-0 flex-col items-center gap-2">
            <span className="text-sm font-semibold">{attempt.score}</span>
            <div className="flex h-32 w-full items-end rounded bg-slate-100"><div className={`w-full rounded ${attempt.is_passed ? 'bg-secondary' : 'bg-amber-500'}`} style={{ height: `${Math.max(0, Math.min(100, attempt.score))}%` }} /></div>
            <span className="max-w-full truncate text-xs text-slate-600" title={attempt.module_code}>{attempt.module_code}</span>
          </div>)}
        </div>
      </section>}

      <section aria-labelledby="quiz-history-title" className="mt-8">
        <h2 id="quiz-history-title" className="mb-4 text-2xl font-semibold">Riwayat kuis</h2>
        <QuizHistory attempts={summary.quiz_attempts} />
      </section>
    </>}
  </>
}
