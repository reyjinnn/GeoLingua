import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { learningApi } from '../../api/learningApi'
import { PageState } from '../../components/common/PageState'
import type { VocabularyItem } from '../../types/learning.types'

export function LessonPage() {
  const { id } = useParams()
  const [lesson, setLesson] = useState<import('../../types/curriculum.types').LessonDetail | null>(null)
  const [words, setWords] = useState<VocabularyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    if (!id) return
    let active = true
    Promise.all([
      import('../../api/curriculumApi').then(m => m.curriculumApi.lesson(id)),
      learningApi.vocabulary(id)
    ])
    .then(([lessonData, wordsData]) => {
      if (active) {
        setLesson(lessonData)
        setWords(wordsData)
      }
    })
    .catch((cause) => {
      if (active) setError(cause instanceof Error ? cause.message : 'Pelajaran gagal dimuat.')
    })
    .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])
  
  if (loading) return <p role="status">Memuat pelajaran...</p>
  if (error) return <PageState title="Pelajaran belum tersedia" message={error} />
  
  return <>
    <Link to={`/modules/${lesson?.module_id}`} className="font-medium text-brand">← Kembali ke modul</Link>
    <h1 className="mt-8 text-3xl font-bold">{lesson?.lesson_name}</h1>
    {lesson?.lesson_objective && <p className="mt-2 text-slate-600">{lesson.lesson_objective}</p>}
    {lesson?.grammar_notes && <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-5">
      <h2 className="font-semibold">Catatan tata bahasa</h2>
      <p className="mt-2 text-sm">{lesson.grammar_notes}</p>
    </div>}
    
    <h2 className="mt-10 text-2xl font-bold">Kosakata</h2>
    {words.length === 0 ? <PageState title="Kosakata belum tersedia" message="Pelajaran ini belum memiliki kosakata yang diterbitkan." /> : <div className="mt-7 grid gap-4 md:grid-cols-2">{words.map((word) => <article key={word.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-bold">{word.word}</h2><span className="text-slate-500">{word.pronunciation}</span><span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-secondary">{word.part_of_speech}</span></div><p className="mt-3 font-semibold">{word.translation}</p><p className="mt-2 text-slate-600">{word.definition}</p><blockquote className="mt-4 border-l-2 border-brand pl-3 italic">{word.example_sentence}<br /><span className="text-sm text-slate-500">{word.example_translation}</span></blockquote></article>)}</div>}
    
    <div className="sticky bottom-0 mt-8 border-t border-slate-200 bg-canvas py-4">
      <Link to={`/lessons/${id}/drill`} className="inline-flex min-h-12 items-center rounded-lg bg-brand px-6 font-semibold text-white hover:bg-blue-700">Lanjut ke latihan drill →</Link>
    </div>
  </>
}
