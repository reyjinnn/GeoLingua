import { Link, useLocation, Navigate, useParams } from 'react-router-dom'
import type { QuizResult } from '../../types/learning.types'
import { useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'

export function QuizResultPage() {
  const { id } = useParams()
  const location = useLocation()
  const state = location.state as { result?: QuizResult; quizTitle?: string } | null
  const { refreshUser } = useAuth()

  useEffect(() => {
    // Refresh user state to fetch latest progress (courses, completed modules count)
    refreshUser()
  }, [refreshUser])

  if (!state?.result) {
    return <Navigate to={`/modules/${id}/quiz`} replace />
  }

  const { result, quizTitle } = state

  return <section className="mx-auto max-w-2xl text-center">
    <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full ${result.is_passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
      <span className="text-4xl font-bold">{result.is_passed ? '✓' : '✗'}</span>
    </div>
    
    <h1 className="mt-6 text-3xl font-bold">{result.is_passed ? 'Selamat! Anda Lulus.' : 'Belum Lulus'}</h1>
    <p className="mt-2 text-slate-600">{quizTitle || 'Kuis Modul'}</p>
    
    <div className="mt-8 flex justify-center gap-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Skor Anda</p>
        <p className={`mt-2 text-4xl font-bold ${result.is_passed ? 'text-green-600' : 'text-red-600'}`}>{result.score}</p>
      </div>
      <div className="w-px bg-slate-200"></div>
      <div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Batas Lulus</p>
        <p className="mt-2 text-4xl font-bold text-slate-800">{result.passing_score}</p>
      </div>
    </div>
    
    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
      {!result.is_passed ? (
        <>
          <Link to={`/modules/${id}`} className="min-h-12 w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 font-semibold text-slate-700 hover:bg-slate-50">Pelajari ulang modul</Link>
          <Link to={`/modules/${id}/quiz`} className="min-h-12 w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-brand px-6 font-semibold text-white hover:bg-blue-700">Coba kuis lagi</Link>
        </>
      ) : (
        <>
          <Link to={`/dashboard`} className="min-h-12 w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 font-semibold text-slate-700 hover:bg-slate-50">Kembali ke dasbor</Link>
          {result.next_module_unlocked && result.unlocked_module_id && (
            <Link to={`/modules/${result.unlocked_module_id}`} className="min-h-12 w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-brand px-6 font-semibold text-white hover:bg-blue-700">Lanjut ke Modul Berikutnya →</Link>
          )}
        </>
      )}
    </div>
  </section>
}
