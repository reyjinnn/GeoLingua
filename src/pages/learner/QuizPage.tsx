import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { learningApi } from '../../api/learningApi'
import { PageState } from '../../components/common/PageState'
import { Button } from '../../components/common/Button'
import type { ModuleQuiz, QuizResult } from '../../types/learning.types'


// Sub-component: Progress Bar

function QuizProgress({ current, total }: { current: number; total: number }) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div className="mt-4">
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


// Main Component: QuizPage

export function QuizPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState<ModuleQuiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [startTime] = useState(() => Date.now())

  // Fetch quiz
  useEffect(() => {
    if (!id) return
    let active = true
    learningApi
      .quiz(id)
      .then((data) => { if (active) setQuiz(data) })
      .catch((cause) => {
        if (active) setFetchError(cause instanceof Error ? cause.message : 'Kuis gagal dimuat.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  if (loading) return <p role="status" className="py-12 text-center">Memuat kuis...</p>

  if (fetchError) return <PageState title="Kuis belum tersedia" message={fetchError} />

  if (!quiz || quiz.questions.length === 0) {
    return <PageState title="Belum ada soal" message="Kuis ini belum memiliki soal yang diterbitkan." />
  }

  const totalQuestions = quiz.questions.length
  const currentQuestion = quiz.questions[currentIndex]
  const selectedOption = answers[currentQuestion.id]
  const answeredCount = Object.keys(answers).length

  function selectOption(optionId: number) {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }))
  }

  function goPrev() { setCurrentIndex((i) => Math.max(0, i - 1)) }
  function goNext() { setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1)) }

  async function handleFinish() {
    if (!quiz || answeredCount < totalQuestions) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const durationSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000))
      const payload = quiz.questions.map((q) => ({
        question_id: q.id,
        selected_option_id: answers[q.id],
      }))
      const result: QuizResult = await learningApi.submitQuiz(quiz.quiz_id, payload, durationSeconds)
      navigate(`/modules/${id}/quiz/result`, { state: { result, quizId: quiz.quiz_id } })
    } catch (cause) {
      setSubmitError(cause instanceof Error ? cause.message : 'Gagal mengirim kuis.')
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-2xl">
      <Link to={`/modules/${id}`} className="font-medium text-brand">← Kembali ke modul</Link>
      <h1 className="mt-6 text-2xl font-bold">{quiz.title}</h1>
      <p className="mt-1 text-sm text-slate-600">
        Passing score: {quiz.passing_score} · {answeredCount}/{totalQuestions} terjawab
      </p>

      <QuizProgress current={currentIndex} total={totalQuestions} />

      {/* Question card */}
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-lg font-semibold">{currentQuestion.question_text}</p>

        <div className="mt-5 space-y-3">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOption === option.id
            return (
              <label
                key={option.id}
                className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                  isSelected ? 'border-brand bg-blue-50' : 'border-slate-200 hover:border-brand'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option.id}
                  checked={isSelected}
                  onChange={() => selectOption(option.id)}
                  disabled={submitting}
                />
                <span className="font-medium">{option.text}</span>
              </label>
            )
          })}
        </div>
      </div>

      {submitError && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 p-4 text-danger">{submitError}</p>
      )}

      {/* Navigation */}
      <div className="mt-6 flex flex-wrap justify-between gap-3">
        <button
          type="button"
          onClick={goPrev}
          disabled={currentIndex === 0 || submitting}
          className="min-h-12 rounded-lg border border-slate-300 px-5 font-semibold text-slate-700 disabled:opacity-40"
        >
          ← Sebelumnya
        </button>

        {currentIndex < totalQuestions - 1 ? (
          <Button onClick={goNext} disabled={!selectedOption || submitting}>
            Selanjutnya →
          </Button>
        ) : (
          <Button onClick={handleFinish} disabled={answeredCount < totalQuestions || submitting}>
            {submitting ? 'Mengirim...' : 'Selesaikan Kuis'}
          </Button>
        )}
      </div>
    </section>
  )
}