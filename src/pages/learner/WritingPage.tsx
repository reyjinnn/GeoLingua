import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { learningApi } from '../../api/learningApi'
import { PageState } from '../../components/common/PageState'
import { Button } from '../../components/common/Button'
import { useWritingCheck } from '../../hooks/useWritingCheck'
import type { WritingPrompt, WritingResult } from '../../types/learning.types'


// Sub-component: Required Vocabulary Chips

function RequiredVocabChips({
  words,
  text,
}: {
  words: string[]
  text: string
}) {
  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-slate-700">Kata wajib:</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {words.map((word) => {
          const found = new RegExp(`\\b${word}\\b`, 'i').test(text)
          return (
            <span
              key={word}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                found
                  ? 'bg-green-100 text-green-800'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {word}
            </span>
          )
        })}
      </div>
    </div>
  )
}


// Sub-component: Word Counter

function WordCounter({ count, minimum }: { count: number; minimum: number }) {
  const passed = count >= minimum
  return (
    <p className={`mt-3 text-sm font-medium ${passed ? 'text-green-600' : 'text-amber-600'}`}>
      Jumlah kata: {count} / {minimum} (minimum)
      {passed ? ' ✓' : ''}
    </p>
  )
}


// Sub-component: Review Panel

function ReviewPanel({
  result,
  onRetry,
}: {
  result: WritingResult
  onRetry: () => void
}) {
  const isPassed = result.passed_validation
  return (
    <div
      className={`mt-6 rounded-lg border-2 p-5 ${
        isPassed ? 'border-green-300 bg-green-50' : 'border-amber-300 bg-amber-50'
      }`}
    >
      <p className={`text-lg font-bold ${isPassed ? 'text-green-800' : 'text-amber-800'}`}>
        {isPassed ? '✓ Validasi Memenuhi Syarat' : '⚠ Belum Memenuhi Syarat'}
      </p>

      <p className="mt-2 text-sm text-slate-700">
        Jumlah kata: <strong>{result.word_count}</strong>
      </p>

      {result.missing_required_words.length > 0 && (
        <p className="mt-2 text-sm text-red-700">
          Kata belum muncul: <strong>{result.missing_required_words.join(', ')}</strong>
        </p>
      )}

      <div className="mt-4 rounded-lg bg-white p-4">
        <p className="text-sm font-semibold text-slate-700">Contoh Jawaban Ideal:</p>
        <blockquote className="mt-2 border-l-2 border-brand pl-3 italic text-slate-700">
          "{result.benchmark_answer}"
        </blockquote>
      </div>

      <div className="mt-4 rounded-lg bg-white p-4">
        <p className="text-sm font-semibold text-slate-700">Panduan Evaluasi Mandiri:</p>
        <p className="mt-2 text-sm text-slate-600">{result.evaluation_guide}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={onRetry}
          className="inline-flex min-h-12 items-center rounded-lg border border-slate-300 px-6 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Tulis Ulang
        </button>
        <Link
          to="/dashboard"
          className="inline-flex min-h-12 items-center rounded-lg bg-brand px-6 font-semibold text-white hover:bg-brand-hover"
        >
          Kembali ke Dasbor →
        </Link>
      </div>
    </div>
  )
}

// Main Component: WritingPage

export function WritingPage() {
  const { id } = useParams()
  const [prompt, setPrompt] = useState<WritingPrompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<WritingResult | null>(null)
  const [submitError, setSubmitError] = useState('')

  // Fetch prompt
  useEffect(() => {
    if (!id) return
    let active = true
    setLoading(true)
    learningApi
      .writing(id)
      .then((data) => {
        if (active) setPrompt(data)
      })
      .catch((cause) => {
        if (active)
          setFetchError(cause instanceof Error ? cause.message : 'Prompt gagal dimuat.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id])

  // Hook: real-time check
  const check = useWritingCheck(
    text,
    prompt?.required_vocabulary ?? [],
    prompt?.minimum_words ?? 0
  )

  // Submit
  async function handleSubmit() {
    if (!prompt || !check.ready) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await learningApi.submitWriting(prompt.id, text)
      setResult(res)
    } catch (cause) {
      setSubmitError(cause instanceof Error ? cause.message : 'Gagal mengirim tulisan.')
    } finally {
      setSubmitting(false)
    }
  }

  // Reset
  function handleRetry() {
    setText('')
    setResult(null)
    setSubmitError('')
  }

  // Loading
  if (loading) return <p role="status" className="py-12 text-center">Memuat prompt...</p>

  // Error
  if (fetchError) {
    return <PageState title="Latihan menulis belum tersedia" message={fetchError} />
  }

  // Empty
  if (!prompt) {
    return (
      <PageState
        title="Belum ada prompt"
        message="Pelajaran ini belum punya latihan menulis."
      />
    )
  }

  // Success: show result
  if (result) {
    return (
      <section className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">Hasil Latihan Menulis</h1>
        <ReviewPanel result={result} onRetry={handleRetry} />
      </section>
    )
  }

  // Main form
  return (
    <section className="mx-auto max-w-2xl">
      <Link to={`/lessons/${id}`} className="font-medium text-brand">
        ← Kembali ke pelajaran
      </Link>
      <h1 className="mt-6 text-3xl font-bold">Latihan Menulis</h1>
      <p className="mt-2 text-slate-600">{prompt.instruction}</p>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="font-semibold">{prompt.writing_prompt}</p>

        <RequiredVocabChips words={prompt.required_vocabulary} text={text} />
        <WordCounter count={check.count} minimum={prompt.minimum_words} />

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tulis paragraf perkenalan diri di sini..."
          rows={6}
          className="mt-4 w-full rounded-lg border border-slate-300 p-4 text-lg disabled:bg-slate-100"
          disabled={submitting}
        />

        {submitError && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 p-4 text-danger">
            {submitError}
          </p>
        )}

        <div className="mt-5">
          <Button onClick={handleSubmit} disabled={!check.ready || submitting}>
            {submitting ? 'Memvalidasi...' : 'Validasi Tulisan'}
          </Button>
        </div>
      </div>
    </section>
  )
}