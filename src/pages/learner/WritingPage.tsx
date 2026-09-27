import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { learningApi } from '../../api/learningApi'
import { PageState } from '../../components/common/PageState'
import type { WritingPrompt, WritingResult } from '../../types/learning.types'
import { Button } from '../../components/common/Button'
import { useWritingCheck } from '../../hooks/useWritingCheck'

export function WritingPage() {
  const { id } = useParams()
  const [prompt, setPrompt] = useState<WritingPrompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<WritingResult | null>(null)
  const [reload, setReload] = useState(0)

  // Checklist state for self-review
  const [reviewChecklist, setReviewChecklist] = useState<Record<string, boolean>>({
    meaning: false,
    vocabulary: false,
    grammar: false
  })

  useEffect(() => {
    if (!id) return
    let active = true
    learningApi.writing(id)
      .then((data) => { if (active) setPrompt(data) })
      .catch((cause) => { if (active) setLoadError(cause instanceof Error ? cause.message : 'Tugas writing gagal dimuat.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id, reload])

  const requiredVocab = prompt?.required_vocabulary ?? []
  const minWords = prompt?.minimum_words ?? 0
  const { count: wordCount, missing: missingWords, ready } = useWritingCheck(text, requiredVocab, minWords)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!ready || submitting) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await learningApi.submitWriting(prompt!.id, text)
      setResult(res)
    } catch (cause) {
      setSubmitError(cause instanceof Error ? cause.message : 'Gagal mengirim tugas. Silakan coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p role="status">Memuat latihan menulis...</p>
  if (loadError) return (
    <PageState 
      title="Tugas belum tersedia" 
      message={loadError} 
      retry={() => {
        setLoading(true)
        setLoadError('')
        setReload(r => r + 1)
      }} 
    />
  )
  if (!prompt) return <PageState title="Tugas belum tersedia" message="Belum ada prompt writing untuk pelajaran ini." />

  if (submitting) {
    return <section className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-brand border-r-transparent"></div>
      <h2 className="text-xl font-semibold">Sedang mengevaluasi tulisan...</h2>
      <p className="mt-2 text-slate-600">Sistem sedang memeriksa jumlah kata dan pemenuhan kosakata wajib Anda.</p>
    </section>
  }

  if (result) {
    return <section className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="mb-6 flex items-center gap-3">
        {result.passed_validation ? (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold">✓</span>
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-700 font-bold">!</span>
        )}
        <div>
          <h1 className="text-2xl font-bold">{result.passed_validation ? 'Validasi Berhasil!' : 'Perlu Revisi'}</h1>
          <p className="text-slate-600">
            {result.passed_validation 
              ? `Tulisan Anda memenuhi syarat minimum (${result.word_count} kata) dan semua kosakata wajib.` 
              : `Tulisan Anda belum memenuhi persyaratan.`}
          </p>
        </div>
      </header>

      {!result.passed_validation && (
        <div className="mb-6 rounded-lg bg-orange-50 p-4 text-orange-900 border border-orange-200">
          <p className="font-semibold">Catatan kekurangan:</p>
          <ul className="mt-2 ml-5 list-disc space-y-1">
            {result.word_count < minWords && (
              <li>Jumlah kata masih kurang ({result.word_count} dari minimal {minWords} kata).</li>
            )}
            {result.missing_required_words.length > 0 && (
              <li>Kosakata wajib yang belum ditemukan: <strong>{result.missing_required_words.join(', ')}</strong>.</li>
            )}
          </ul>
        </div>
      )}

      {result.passed_validation && (
        <>
          <div className="mb-6 rounded-lg bg-blue-50 p-5 border border-blue-100">
            <h2 className="font-semibold text-brand">Panduan Evaluasi Mandiri (Self-Review)</h2>
            <p className="mt-2 text-slate-700 whitespace-pre-wrap leading-relaxed">{result.evaluation_guide}</p>
            
            <div className="mt-4 border-t border-blue-200 pt-3">
              <p className="text-sm font-semibold text-slate-700">Checklist Evaluasi Mandiri:</p>
              <div className="mt-2 space-y-2">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={reviewChecklist.meaning} 
                    onChange={e => setReviewChecklist(prev => ({ ...prev, meaning: e.target.checked }))}
                    className="rounded border-slate-300 text-brand focus:ring-brand"
                  />
                  <span>Makna kalimat sesuai dengan prompt yang diberikan</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={reviewChecklist.vocabulary} 
                    onChange={e => setReviewChecklist(prev => ({ ...prev, vocabulary: e.target.checked }))}
                    className="rounded border-slate-300 text-brand focus:ring-brand"
                  />
                  <span>Kosakata wajib digunakan dalam konteks tata bahasa yang benar</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={reviewChecklist.grammar} 
                    onChange={e => setReviewChecklist(prev => ({ ...prev, grammar: e.target.checked }))}
                    className="rounded border-slate-300 text-brand focus:ring-brand"
                  />
                  <span>Kapitalisasi huruf dan tanda baca sudah diperiksa</span>
                </label>
              </div>
            </div>
          </div>

          {result.benchmark_answer && (
            <div className="mb-6 rounded-lg border border-slate-200 p-5 bg-slate-50">
              <h2 className="font-semibold text-slate-800">Contoh Jawaban Acuan (Benchmark)</h2>
              <p className="mt-2 text-slate-700 italic whitespace-pre-wrap font-serif">"{result.benchmark_answer}"</p>
            </div>
          )}
        </>
      )}

      <div className="mt-8 flex flex-wrap gap-4">
        {!result.passed_validation ? (
          <Button onClick={() => setResult(null)}>Revisi Tulisan</Button>
        ) : (
          <>
            <Link to={`/lessons/${id}`} className="inline-flex min-h-12 items-center rounded-lg border border-slate-300 px-6 font-semibold text-slate-700 hover:bg-slate-50">
              ← Kembali ke Pelajaran
            </Link>
            <Link to="/dashboard" className="inline-flex min-h-12 items-center rounded-lg bg-brand px-6 font-semibold text-white hover:bg-blue-700">
              Selesai & Ke Dasbor
            </Link>
          </>
        )}
      </div>
    </section>
  }

  return <section className="mx-auto max-w-3xl">
    <h1 className="text-3xl font-bold">Latihan Menulis</h1>
    <p className="mt-2 text-slate-600">Terapkan apa yang sudah Anda pelajari dalam sebuah paragraf pendek.</p>
    
    <div className="mt-8 grid gap-6 md:grid-cols-5">
      <div className="md:col-span-2">
        <div className="sticky top-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-lg text-slate-800">Prompt</h2>
          <p className="mt-2 font-medium text-slate-900">{prompt.writing_prompt}</p>
          <p className="mt-4 text-sm text-slate-600">{prompt.instruction}</p>
          
          <div className="mt-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kosakata Wajib</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {requiredVocab.map(v => {
                const isIncluded = !missingWords.includes(v)
                return (
                  <li 
                    key={v} 
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold border transition-colors ${
                      isIncluded 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm' 
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {isIncluded ? '✓ ' : ''}{v}
                  </li>
                )
              })}
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
              placeholder="Ketik tulisan Anda di sini..."
              className="min-h-[300px] w-full resize-y rounded-xl border border-slate-300 p-5 font-medium leading-relaxed outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            ></textarea>
            <div className={`absolute bottom-4 right-4 rounded-md px-2.5 py-1 text-xs font-bold ${wordCount < minWords ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {wordCount} / {minWords} kata
            </div>
          </div>
          
          {submitError && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
              <p className="font-semibold">Pengiriman gagal</p>
              <p className="mt-1">{submitError}</p>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">
              {!ready 
                ? (wordCount < minWords 
                    ? `Perlu ${minWords - wordCount} kata lagi` 
                    : `Gunakan kata: ${missingWords.join(', ')}`)
                : 'Siap dikirim!'}
            </span>
            <Button disabled={!ready || submitting}>
              {submitting ? 'Mengirim...' : 'Kirim Tulisan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </section>
}
