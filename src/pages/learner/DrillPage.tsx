import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { learningApi } from '../../api/learningApi'
import { PageState } from '../../components/common/PageState'
import { Button } from '../../components/common/Button'
import { useDrillEngine } from '../../hooks/useDrillEngine'
import type { DrillQuestion, DrillResult } from '../../types/learning.types'

// Sub-component: Progress Bar
function DrillProgress({ current, total }: { current: number; total: number }) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div className="mt-2">
      <div className="flex justify-between text-sm text-slate-600">
        <span>Soal {Math.min(current + 1, total)} / {total}</span>
        <span>{percent}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"
      >
        <div
          className="h-full rounded-full bg-brand transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

// Sub-component: MCQ Question
function McqQuestion({
  question,
  onAnswer,
  disabled,
}: {
  question: DrillQuestion
  onAnswer: (answer: string) => void
  disabled: boolean
}) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {question.options?.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onAnswer(String(option.id))}
          disabled={disabled}
          className="min-h-12 rounded-lg border border-slate-200 bg-white p-4 text-left font-medium hover:border-brand hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {option.text}
        </button>
      ))}
    </div>
  )
}

// Sub-component: Typing Question
function TypingQuestion({
  question,
  onSubmit,
  disabled,
}: {
  question: DrillQuestion
  onSubmit: (answer: string) => void
  disabled: boolean
}) {
  const [value, setValue] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (value.trim() === '') return
    onSubmit(value.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={question.placeholder ?? 'Ketik jawaban di sini...'}
        disabled={disabled}
        autoFocus
        className="min-h-12 w-full rounded-lg border border-slate-300 px-4 text-lg disabled:bg-slate-100"
      />
      <Button type="submit" disabled={disabled || value.trim() === ''}>
        {disabled ? 'Memeriksa...' : 'Periksa'}
      </Button>
    </form>
  )
}

// Sub-component: Feedback
function DrillFeedback({
  result,
  onNext,
  isLast,
}: {
  result: DrillResult
  onNext: () => void
  isLast: boolean
}) {
  const isCorrect = result.is_correct
  return (
    <div
      className={`mt-6 rounded-lg border-2 p-5 ${
        isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
      }`}
    >
      <p className={`text-lg font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
        {isCorrect ? '✓ Luar biasa! Jawaban benar' : '✗ Kurang tepat'}
      </p>
      {!isCorrect && (
        <p className="mt-2 text-slate-700">
          Jawaban yang benar: <strong>{result.correct_answer}</strong>
        </p>
      )}
      {result.explanation && (
        <p className="mt-2 text-sm text-slate-600">{result.explanation}</p>
      )}
      <Button onClick={onNext} className="mt-4">
        {isLast ? 'Lihat hasil' : 'Lanjut'}
      </Button>
    </div>
  )
}

// Main Component: DrillPage
export function DrillPage() {
  const { id } = useParams()
  const [questions, setQuestions] = useState<DrillQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [correctCount, setCorrectCount] = useState(0)

  useEffect(() => {
    if (!id) return
    let active = true
    learningApi
      .drills(id)
      .then((data) => {
        if (active) setQuestions(data)
      })
      .catch((cause) => {
        if (active)
          setFetchError(cause instanceof Error ? cause.message : 'Soal gagal dimuat.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id])

  const engine = useDrillEngine(questions)

  useEffect(() => {
    if (engine.result?.is_correct) {
      setCorrectCount((c) => c + 1)
    }
  }, [engine.result])

  if (loading) return <p role="status" className="py-12 text-center">Memuat soal drill...</p>

  if (fetchError) {
    return <PageState title="Soal drill belum tersedia" message={fetchError} />
  }

  if (questions.length === 0) {
    return (
      <PageState
        title="Belum ada soal"
        message="Pelajaran ini belum memiliki soal latihan yang diterbitkan."
      />
    )
  }

  if (engine.done) {
    const total = questions.length
    const percent = Math.round((correctCount / total) * 100)
    const isPass = percent >= 70
    return (
      <section className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">Hasil Latihan</h1>
        <div
          className={`mt-6 rounded-lg border-2 p-6 ${
            isPass ? 'border-green-300 bg-green-50' : 'border-amber-300 bg-amber-50'
          }`}
        >
          <p className="text-lg font-semibold">Skor Kamu</p>
          <p className="mt-2 text-5xl font-bold">{percent}/100</p>
          <p className="mt-3">
            Benar: <strong>{correctCount}</strong> dari <strong>{total}</strong> soal
          </p>
          <p className={`mt-2 font-semibold ${isPass ? 'text-green-800' : 'text-amber-800'}`}>
            {isPass
              ? '🎉 Luar biasa! Kamu lulus latihan ini.'
              : '💪 Ayo coba lagi untuk hasil lebih baik.'}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex min-h-12 items-center rounded-lg bg-brand px-6 font-semibold text-white hover:bg-brand-hover"
          >
            Ulangi latihan
          </button>
          <Link
            to={`/lessons/${id}/writing`}
            className="inline-flex min-h-12 items-center rounded-lg border border-brand px-6 font-semibold text-brand"
          >
            Lanjut ke latihan menulis →
          </Link>
        </div>
      </section>
    )
  }

  const { question, result, checking, error, check, next, index } = engine

  return (
    <section className="mx-auto max-w-2xl">
      <Link to={`/lessons/${id}`} className="font-medium text-brand">
        ← Kembali ke pelajaran
      </Link>
      <h1 className="mt-6 text-2xl font-bold">Latihan Kosakata</h1>
      <DrillProgress current={index} total={questions.length} />

      {question && (
        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-lg font-semibold">{question.prompt}</p>

          {question.question_type === 'mcq_meaning' && !result && (
            <McqQuestion question={question} onAnswer={check} disabled={checking} />
          )}
          {question.question_type === 'typing' && !result && (
            <TypingQuestion question={question} onSubmit={check} disabled={checking} />
          )}

          {error && (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 p-4 text-danger">
              {error}
            </p>
          )}

          {result && (
            <DrillFeedback
              result={result}
              onNext={next}
              isLast={index === questions.length - 1}
            />
          )}
        </div>
      )}
    </section>
  )
}