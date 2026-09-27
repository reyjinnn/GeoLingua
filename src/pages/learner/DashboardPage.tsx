import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { curriculumApi } from '../../api/curriculumApi'
import { PageState } from '../../components/common/PageState'
import { useAuth } from '../../hooks/useAuth'
import type { ModuleSummary } from '../../types/curriculum.types'
import { formatPercent } from '../../utils/formatting'

const isCompleted = (module: ModuleSummary) => module.is_completed || module.status === 'completed'
const isLocked = (module: ModuleSummary) => module.status === 'locked' && !isCompleted(module)
const progress = (value: number) => Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0

export function DashboardPage() {
  const { user } = useAuth()
  const [modules, setModules] = useState<ModuleSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let active = true
    curriculumApi.modules()
      .then((data) => { if (active) setModules(data) })
      .catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : 'Modul gagal dimuat.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [reload])

  const orderedModules = [...modules].sort((a, b) => a.order_index - b.order_index || a.id - b.id)
  const completedCount = orderedModules.filter(isCompleted).length
  const levelProgress = orderedModules.length
    ? Math.round(orderedModules.reduce((total, module) => total + (isCompleted(module) ? 100 : progress(module.progress_percentage)), 0) / orderedModules.length)
    : 0
  const resumeModule = orderedModules.find((module) => module.status === 'in_progress' && !isCompleted(module))
    ?? orderedModules.find((module) => !isLocked(module) && !isCompleted(module))

  return <>
    <header className="mb-8">
      <p className="font-semibold text-secondary">{user!.active_course!.current_level} · Jalur belajar</p>
      <h1 className="mt-2 text-3xl font-bold">Halo, {user!.full_name.split(' ')[0]}</h1>
      <p className="mt-2 text-slate-600">Lanjutkan perjalanan belajar Anda, satu modul dalam satu waktu.</p>
    </header>

    {loading ? <p role="status">Memuat peta modul...</p> : error ? <PageState
      title="Modul belum dapat dimuat"
      message={error}
      retry={() => { setError(''); setLoading(true); setReload((value) => value + 1) }}
    /> : orderedModules.length === 0 ? <PageState
      title="Materi sedang disiapkan"
      message="Modul untuk level ini sedang dipersiapkan oleh tim kurikulum."
    /> : <>
      <section aria-labelledby="level-progress-title" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="level-progress-title" className="text-xl font-semibold">Kemajuan level {user!.active_course!.current_level}</h2>
            <p className="mt-1 text-sm text-slate-600">{completedCount} dari {orderedModules.length} modul selesai</p>
          </div>
          <span className="text-2xl font-bold text-secondary">{levelProgress}%</span>
        </div>
        <div role="progressbar" aria-label={`Kemajuan level ${user!.active_course!.current_level}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={levelProgress} className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-secondary" style={{ width: `${levelProgress}%` }} />
        </div>
      </section>

      {resumeModule && <section aria-labelledby="resume-title" className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-5">
        <p className="text-sm font-bold text-brand">{resumeModule.status === 'in_progress' || progress(resumeModule.progress_percentage) > 0 ? 'LANJUTKAN BELAJAR' : 'MULAI BELAJAR'}</p>
        <h2 id="resume-title" className="mt-2 text-xl font-semibold">{resumeModule.title}</h2>
        <p className="mt-1 text-sm text-slate-600">{resumeModule.module_code} · {formatPercent(progress(resumeModule.progress_percentage))} selesai</p>
        <Link to={`/modules/${resumeModule.id}`} className="mt-4 inline-flex min-h-12 items-center rounded-lg bg-brand px-5 font-semibold text-white hover:bg-blue-700">
          {resumeModule.status === 'in_progress' || progress(resumeModule.progress_percentage) > 0 ? 'Lanjutkan modul' : 'Buka modul'} →
        </Link>
      </section>}

      <section aria-labelledby="module-roadmap-title" className="mt-8">
        <h2 id="module-roadmap-title" className="text-2xl font-semibold">Peta modul</h2>
        <p className="mt-1 text-slate-600">Ikuti modul sesuai urutan untuk membuka tahap berikutnya.</p>
        <ol className="mt-5 grid gap-4 md:grid-cols-2">
          {orderedModules.map((module, index) => {
            const completed = isCompleted(module)
            const locked = isLocked(module)
            const moduleProgress = completed ? 100 : progress(module.progress_percentage)
            const previousModule = orderedModules[index - 1]
            return <li key={module.id}>
              <article className={`flex h-full flex-col rounded-lg border p-5 shadow-sm ${locked ? 'border-slate-200 bg-slate-100' : completed ? 'border-green-300 bg-white' : 'border-blue-300 bg-white'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-secondary">{module.module_code}</p>
                    <h3 className="mt-2 text-xl font-semibold">{module.title}</h3>
                    <p className="mt-1 text-slate-600">{module.topic}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${locked ? 'bg-slate-200 text-slate-700' : completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {locked ? 'Terkunci' : completed ? '✓ Selesai' : module.status === 'in_progress' ? 'Berjalan' : 'Tersedia'}
                  </span>
                </div>
                <div role="progressbar" aria-label={`Kemajuan ${module.title}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={moduleProgress} className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className={`h-full rounded-full ${completed ? 'bg-green-600' : 'bg-secondary'}`} style={{ width: `${moduleProgress}%` }} />
                </div>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                  <span className="text-sm text-slate-600">{formatPercent(moduleProgress)} selesai</span>
                  {locked ? <span className="text-sm text-slate-600">{previousModule ? `Selesaikan ${previousModule.module_code} untuk membuka` : 'Selesaikan prasyarat untuk membuka'}</span> : <Link to={`/modules/${module.id}`} className="inline-flex min-h-12 items-center font-semibold text-brand hover:underline">
                    {completed ? 'Ulas kembali' : moduleProgress > 0 ? 'Lanjutkan' : 'Mulai belajar'} →
                  </Link>}
                </div>
              </article>
            </li>
          })}
        </ol>
      </section>
    </>}
  </>
}
