import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { curriculumApi } from '../../api/curriculumApi'
import { PageState } from '../../components/common/PageState'
import { useAuth } from '../../hooks/useAuth'
import type { ModuleSummary } from '../../types/curriculum.types'
import { formatPercent } from '../../utils/formatting'

export function DashboardPage() {
  const { user } = useAuth()
  const [modules, setModules] = useState<ModuleSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  useEffect(() => {
    let active = true
    curriculumApi.modules().then((data) => { if (active) setModules(data) }).catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : 'Modul gagal dimuat.') }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [reload])
  return <><div className="mb-8"><p className="font-semibold text-secondary">{user?.active_course?.current_level ?? 'A1'} · Jalur belajar</p><h1 className="mt-2 text-3xl font-bold">Halo, {user?.full_name.split(' ')[0]}</h1><p className="mt-2 text-slate-600">Lanjutkan perjalanan belajar Anda, satu langkah dalam satu waktu.</p></div>
    {loading ? <p role="status">Memuat modul...</p> : error ? <PageState title="Modul belum dapat dimuat" message={error} retry={() => { setError(''); setLoading(true); setReload((value) => value + 1) }} /> : modules.length === 0 ? <PageState title="Materi sedang disiapkan" message="Modul untuk level ini sedang dipersiapkan oleh tim kurikulum." /> : <div className="grid gap-4 md:grid-cols-2">{modules.map((module) => <article key={module.id} className={`rounded-lg border bg-white p-5 shadow-sm ${module.status === 'locked' ? 'border-slate-200 opacity-75' : module.is_completed ? 'border-green-300' : 'border-blue-300'}`}><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-secondary">{module.module_code}</p><h2 className="mt-2 text-xl font-semibold">{module.title}</h2><p className="mt-1 text-slate-600">{module.topic}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{module.status === 'locked' ? 'Terkunci' : module.is_completed ? 'Selesai' : 'Tersedia'}</span></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-secondary" style={{ width: formatPercent(module.progress_percentage) }} /></div><div className="mt-4 flex items-center justify-between"><span className="text-sm text-slate-500">{formatPercent(module.progress_percentage)} selesai</span>{module.status === 'locked' ? <span className="text-sm text-slate-500">Selesaikan modul sebelumnya</span> : <Link to={`/modules/${module.id}`} className="font-semibold text-brand">{module.is_completed ? 'Ulas kembali' : 'Mulai belajar'} →</Link>}</div></article>)}</div>}
  </>
}
