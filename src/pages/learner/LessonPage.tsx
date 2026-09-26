import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { learningApi } from '../../api/learningApi'
import { PageState } from '../../components/common/PageState'
import type { VocabularyItem } from '../../types/learning.types'

export function LessonPage() {
  const { id } = useParams()
  const [words, setWords] = useState<VocabularyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    if (!id) return
    let active = true
    learningApi.vocabulary(id).then((data) => { if (active) setWords(data) }).catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : 'Kosakata gagal dimuat.') }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])
  if (loading) return <p role="status">Memuat kosakata...</p>
  if (error) return <PageState title="Kosakata belum tersedia" message={error} />
  return <><h1 className="text-3xl font-bold">Pelajari kosakata</h1><p className="mt-2 text-slate-600">Pahami arti dan contoh kalimat sebelum berlatih.</p>{words.length === 0 ? <PageState title="Kosakata belum tersedia" message="Pelajaran ini belum memiliki kosakata yang diterbitkan." /> : <div className="mt-7 grid gap-4 md:grid-cols-2">{words.map((word) => <article key={word.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-bold">{word.word}</h2><span className="text-slate-500">{word.pronunciation}</span><span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-secondary">{word.part_of_speech}</span></div><p className="mt-3 font-semibold">{word.translation}</p><p className="mt-2 text-slate-600">{word.definition}</p><blockquote className="mt-4 border-l-2 border-brand pl-3 italic">{word.example_sentence}<br /><span className="text-sm text-slate-500">{word.example_translation}</span></blockquote></article>)}</div>}<div className="sticky bottom-0 mt-8 border-t border-slate-200 bg-canvas py-4"><Link to={`/lessons/${id}/drill`} className="inline-flex min-h-12 items-center rounded-lg bg-brand px-6 font-semibold text-white">Mulai latihan drill</Link></div></>
}
