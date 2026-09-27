import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { learningApi } from '../../api/learningApi'
import { PageState } from '../../components/common/PageState'
import type { ModuleQuiz, AnswerOption } from '../../types/learning.types'
import { Button } from '../../components/common/Button'

export function QuizPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState<ModuleQuiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitting, setSubmitting] = useState(false)
  
  const startTime = useRef<number>(0)

  useEffect(() => {
    if (!id) return
    let active = true
    learningApi.quiz(id)
      .then((data) => {
        if (active) {
          setQuiz(data)
          startTime.current = Date.now()
        }
      })
      .catch((cause) => { if (active) setLoadError(cause instanceof Error ? cause.message : 'Kuis gagal dimuat.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  if (loading) return <p role="status">Memuat kuis...</p>
  if (loadError) return <PageState title="Kuis belum tersedia" message={loadError} />
  if (!quiz || quiz.questions.length === 0) return <PageState title="Kuis belum siap" message="Modul ini belum memiliki soal kuis yang diterbitkan." />

  const q = quiz.questions[currentIdx]
  const isLast = currentIdx === quiz.questions.length - 1
  const answeredCount = Object.keys(answers).length
  const isAllAnswered = answeredCount === quiz.questions.length

  async function submit() {
    if (!isAllAnswered) return
    setSubmitting(true)
    setSubmitError('')
    const durationSeconds = Math.round((Date.now() - startTime.current) / 1000)
    
    const formattedAnswers = Object.entries(answers).map(([qId, optId]) => ({
      question_id: Number(qId),
      selected_option_id: optId
    }))
    
    try {
      const result = await learningApi.submitQuiz(quiz!.quiz_id, formattedAnswers, durationSeconds)
      navigate(`/modules/${id}/quiz/result`, { state: { result, quizTitle: quiz!.title }, replace: true })
    } catch (cause) {
      setSubmitError(cause instanceof Error ? cause.message : 'Kuis gagal dikirim. Silakan coba lagi.')
      setSubmitting(false)
    }
  }

  if (submitting) {
    return <section className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-brand border-r-transparent"></div>
      <h2 className="text-xl font-semibold">Menghitung skor...</h2>
      <p className="mt-2 text-slate-600">Mohon tunggu sebentar.</p>
    </section>
  }

  return <section className="mx-auto max-w-2xl">
    <header className="mb-8">
      <h1 className="text-2xl font-bold">{quiz.title}</h1>
      <div className="mt-6 flex justify-between text-sm font-semibold text-slate-500">
        <span>Soal {currentIdx + 1} dari {quiz.questions.length}</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div className="h-full bg-brand transition-all duration-300" style={{ width: `${(answeredCount / quiz.questions.length) * 100}%` }} />
      </div>
    </header>

    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">{q.question_text}</h2>
      
      <div className="mt-6 grid gap-3">
        {q.options.map((opt: AnswerOption) => (
          <button
            key={opt.id}
            onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt.id }))}
            className={`flex min-h-14 items-center rounded-lg border p-4 text-left transition-colors ${answers[q.id] === opt.id ? 'border-brand bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>

    {submitError && (
      <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center justify-between">
        <span>{submitError}</span>
        <Button onClick={submit} className="ml-4 bg-red-600 hover:bg-red-700 text-white text-xs py-1.5 px-3">
          Coba Kirim Lagi
        </Button>
      </div>
    )}

    <div className="mt-8 flex justify-between">
      <Button 
        onClick={() => setCurrentIdx(c => Math.max(0, c - 1))} 
        disabled={currentIdx === 0}
        className="bg-slate-200 text-slate-800 hover:bg-slate-300"
      >
        Sebelumnya
      </Button>
      
      {!isLast ? (
        <Button onClick={() => setCurrentIdx(c => Math.min(quiz.questions.length - 1, c + 1))}>Selanjutnya</Button>
      ) : (
        <Button onClick={submit} disabled={!isAllAnswered}>Kirim Jawaban</Button>
      )}
    </div>
  </section>
}
