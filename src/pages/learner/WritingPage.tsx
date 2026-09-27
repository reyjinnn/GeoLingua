import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { learningApi } from '../../api/learningApi'
import { PageState } from '../../components/common/PageState'
import type { WritingPrompt, WritingResult } from '../../types/learning.types'
import { Button } from '../../components/common/Button'

export function WritingPage() {
  const { id } = useParams()
  const [prompt, setPrompt] = useState<WritingPrompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<WritingResult | null>(null)

  useEffect(() => {
    if (!id) return
    let active = true
    learningApi.writing(id)
      .then((data) => { if (active) setPrompt(data) })
      .catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : 'Tugas writing gagal dimuat.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  if (loading) return <p role="status">Memuat latihan menulis...</p>
  if (error) return <PageState title="Tugas belum tersedia" message={error} />
  if (!prompt) return <PageState title="Tugas belum tersedia" message="Belum ada prompt writing untuk pelajaran ini." />

  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length
  const minWords = prompt.minimum_words

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (wordCount < minWords) return
    setSubmitting(true)
    setError('')
    setResult(null)
    try {
      setResult(await learningApi.submitWriting(prompt!.id, text))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Gagal mengirim tugas.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitting) {
    return <section className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-brand border-r-transparent"></div>
      <h2 className="text-xl font-semibold">Sedang mengevaluasi tulisan...</h2>
      <p className="mt-2 text-slate-600">AI tutor kami sedang memeriksa kelengkapan dan tata bahasa Anda.</p>
    </section>
  }

  if (result) {
    return <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="mb-6 flex items-center gap-3">
        {result.passed_validation ? (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">✓</span>
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-700">!</span>
        )}
        <div>
          <h1 className="text-2xl font-bold">{result.passed_validation ? 'Kerja bagus!' : 'Perlu revisi'}</h1>
          <p className="text-slate-600">{result.passed_validation ? 'Tulisan Anda memenuhi kriteria.' : 'Beberapa persyaratan belum terpenuhi.'}</p>
        </div>
      </header>

      {!result.passed_validation && result.missing_required_words.length > 0 && (
        <div className="mb-6 rounded-lg bg-orange-50 p-4 text-orange-900 border border-orange-200">
          <strong>Kosakata berikut belum digunakan:</strong>
          <ul className="mt-2 ml-5 list-disc">
            {result.missing_required_words.map(w => <li key={w}>{w}</li>)}
          </ul>
        </div>
      )}

      {result.passed_validation && (
        <div className="mb-6 rounded-lg bg-blue-50 p-5">
          <h2 className="font-semibold text-brand">Evaluasi Tutor</h2>
          <p className="mt-2 text-slate-700 whitespace-pre-wrap">{result.evaluation_guide}</p>
        </div>
      )}

      {result.passed_validation && result.benchmark_answer && (
        <div className="mb-6 rounded-lg border border-slate-200 p-5">
          <h2 className="font-semibold">Contoh Jawaban</h2>
          <p className="mt-2 text-slate-700 whitespace-pre-wrap">{result.benchmark_answer}</p>
        </div>
      )}

      <div className="mt-8 flex gap-4">
        {!result.passed_validation ? (
          <Button onClick={() => setResult(null)}>Revisi Tulisan</Button>
        ) : (
          <Link to={`/dashboard`} className="inline-flex min-h-12 items-center rounded-lg bg-brand px-6 font-semibold text-white hover:bg-blue-700">Selesai Belajar</Link>
        )}
      </div>
    </section>
  }

  return <section className="mx-auto max-w-3xl">
    <h1 className="text-3xl font-bold">Latihan Menulis</h1>
    <p className="mt-2 text-slate-600">Terapkan apa yang sudah Anda pelajari dalam sebuah paragraf.</p>
    
    <div className="mt-8 grid gap-6 md:grid-cols-5">
      <div className="md:col-span-2">
        <div className="sticky top-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-lg text-slate-800">Prompt</h2>
          <p className="mt-2 font-medium">{prompt.writing_prompt}</p>
          <p className="mt-4 text-sm text-slate-600">{prompt.instruction}</p>
          
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Kosakata Wajib</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {prompt.required_vocabulary.map(v => (
                <li key={v} className="rounded-md bg-teal-50 px-2 py-1 text-sm font-medium text-secondary border border-teal-100">
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="md:col-span-3">
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="relative">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Ketik jawaban Anda di sini..."
              className="min-h-[300px] w-full resize-y rounded-xl border border-slate-300 p-5 font-medium leading-relaxed outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            ></textarea>
            <div className={`absolute bottom-4 right-4 rounded-md px-2 py-1 text-xs font-bold ${wordCount < minWords ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {wordCount} / {minWords} kata
            </div>
          </div>
          
          {error && <p className="text-danger">{error}</p>}
          
          <div className="flex justify-end">
            <Button disabled={wordCount < minWords}>Kirim Tulisan</Button>
          </div>
        </form>
      </div>
    </div>
  </section>
}
