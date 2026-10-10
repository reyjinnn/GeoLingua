import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { curriculumApi } from '../../api/curriculumApi'
import { PageState } from '../../components/common/PageState'
import type { ModuleDetail } from '../../types/curriculum.types'

export function ModulePage() {
  const { id } = useParams()
  const [module, setModule] = useState<ModuleDetail | null>(null)
  const [error, setError] = useState('')
  useEffect(() => {
    if (!id) return
    let active = true
    curriculumApi.module(id).then((data) => { if (active) setModule(data) }).catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : 'Modul gagal dimuat.') })
    return () => { active = false }
  }, [id])
  if (error) return <PageState title="Modul belum tersedia" message={error} />
  if (!module) return <p role="status">Memuat modul...</p>
  return <><Link to="/dashboard" className="font-medium text-brand">← Kembali ke dasbor</Link><p className="mt-8 text-sm font-bold text-secondary">{module.module_code} · {module.estimated_duration_minutes} menit</p><h1 className="mt-2 text-3xl font-bold">{module.title}</h1><p className="mt-3 max-w-3xl text-slate-600">{module.description}</p><div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-5"><h2 className="font-semibold">Target belajar</h2><p className="mt-1">{module.learning_objectives}</p></div><h2 className="mt-10 text-2xl font-semibold">Pelajaran</h2><div className="mt-4 grid gap-3">{module.lessons.map((lesson) => <Link key={lesson.id} to={`/lessons/${lesson.id}`} className="flex min-h-16 items-center justify-between rounded-lg border border-slate-200 bg-white p-4 hover:border-brand"><span><strong>{lesson.lesson_name}</strong><span className="ml-3 text-sm text-slate-500">{lesson.vocabulary_count} kosakata</span></span><span className="text-brand">Buka →</span></Link>)}</div>{module.quiz && (
  <Link to={`/modules/${module.id}/quiz`} className="mt-6 inline-flex min-h-12 items-center rounded-lg border border-brand px-5 font-semibold text-brand">{module.quiz.title}</Link>
)}</>
}
