import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { curriculumApi } from '../../api/curriculumApi'
import type { ModuleDetail } from '../../types/curriculum.types'

const defaultModuleData: ModuleDetail = {
  id: 1,
  module_code: 'EN-A1-M1',
  title: 'Perkenalan sehari-hari',
  description:
    'Pelajari sapaan, perkenalan diri, dan ungkapan dasar yang sering digunakan dalam percakapan sehari-hari.',
  learning_objectives:
    'Mampu memperkenalkan diri dan menyapa orang lain dalam bahasa Inggris sederhana.',
  estimated_duration_minutes: 30,
  lessons: [
    { id: 1, lesson_name: 'Salam dan sapaan', order_index: 1, vocabulary_count: 12 },
    { id: 2, lesson_name: 'Memperkenalkan diri', order_index: 2, vocabulary_count: 10 },
    { id: 3, lesson_name: 'Menanyakan kabar', order_index: 3, vocabulary_count: 8 },
  ],
  quiz: {
    id: 1,
    title: 'Kuis Akhir Modul',
    passing_score: 70,
  },
}

export function ModulePage() {
  const { id } = useParams()
  const [module, setModule] = useState<ModuleDetail | null>(null)

  useEffect(() => {
    if (!id) return
    let active = true
    curriculumApi
      .module(id)
      .then((data) => {
        if (active && data) setModule(data)
      })
      .catch(() => {
        if (active) setModule(defaultModuleData)
      })
    return () => {
      active = false
    }
  }, [id])

  const mod = module || defaultModuleData
  const lessons =
    mod.lessons && mod.lessons.length > 0 ? mod.lessons : defaultModuleData.lessons

  return (
    <div className="wrap">
      <Link className="link" to="/dashboard">
        ← Kembali ke dasbor
      </Link>

      <div className="brand-kicker mt8">
        Rute 0{(mod as { order_index?: number }).order_index || mod.id || 1} · English A1
      </div>
      <p className="mt2 small bold teal">
        {mod.module_code} · {mod.estimated_duration_minutes || 30} menit materi dasar
      </p>

      <h1 className="mt2">{mod.title}</h1>
      <p className="mt3 muted" style={{ maxWidth: '768px' }}>
        {mod.description}
      </p>

      <div className="card-pale mt6">
        <p className="semi">Target belajar</p>
        <p className="mt1">{mod.learning_objectives}</p>
      </div>

      <h2 className="mt10">Pelajaran</h2>
      <div className="stack mt4">
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            to={`/lessons/${lesson.id}`}
            className="row choice"
            style={{ minHeight: '64px' }}
          >
            <span>
              <strong>{lesson.lesson_name}</strong>
              <span className="small gray" style={{ marginLeft: '12px' }}>
                {lesson.vocabulary_count || 4} kosakata
              </span>
            </span>
            <span className="blue">Buka →</span>
          </Link>
        ))}
      </div>

      <div className="mt6">
        <Link className="btn btn-outline-blue" to={`/modules/${mod.id}/quiz`}>
          {mod.quiz?.title || 'Kuis Akhir Modul'}
        </Link>
      </div>
    </div>
  )
}
