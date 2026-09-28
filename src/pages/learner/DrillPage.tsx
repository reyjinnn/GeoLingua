import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { learningApi } from '../../api/learningApi'
import type { DrillQuestion } from '../../types/learning.types'

const defaultDrillQuestions: Array<{
  id: number
  prompt: string
  question_type: 'mcq_meaning' | 'typing'
  options?: Array<{ id: number; text: string }>
  correct: string
}> = [
  {
    id: 1,
    prompt: 'Apa arti kata “hello”?',
    question_type: 'mcq_meaning',
    options: [
      { id: 1, text: 'Halo' },
      { id: 2, text: 'Terima kasih' },
      { id: 3, text: 'Selamat malam' },
    ],
    correct: 'halo',
  },
  {
    id: 2,
    prompt: 'Ketik bahasa Inggris untuk “nama”.',
    question_type: 'typing',
    correct: 'name',
  },
]

export function DrillPage() {
  const { id } = useParams()
  const lessonId = id || '1'

  const [questions, setQuestions] = useState<typeof defaultDrillQuestions>(defaultDrillQuestions)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [typingInput, setTypingInput] = useState('')

  useEffect(() => {
    if (!id) return
    learningApi
      .drills(id)
      .then((data: DrillQuestion[]) => {
        if (data && data.length > 0) {
          const mapped = data.map((d, index) => ({
            id: d.id || index + 1,
            prompt: d.prompt,
            question_type: d.question_type as 'mcq_meaning' | 'typing',
            options: d.options ? d.options.map((o) => ({ id: o.id, text: o.text })) : undefined,
            correct: (d as { correct_answer?: string }).correct_answer
              ? (d as { correct_answer?: string }).correct_answer!.toLowerCase().trim()
              : (d.options?.[0]?.text.toLowerCase() || 'halo'),
          }))
          setQuestions(mapped)
        }
      })
      .catch(() => {
        // Fallback to default questions
      })
  }, [id])

  const totalQuestions = questions.length
  const isFinished = currentIdx >= totalQuestions

  if (isFinished) {
    const pct = Math.round((correctCount / totalQuestions) * 100)
    return (
      <section className="completion-card wrap-sm">
        <div className="completion-orbit">
          <span>✓</span>
        </div>
        <div className="brand-kicker mt4">Route checkpoint</div>
        <h1 className="mt4">Latihan selesai.</h1>
        <p className="mt3 muted">
          Akurasi Anda: <strong className="blue">{pct}%</strong>
        </p>

        <div className="meta-strip mt7">
          <div>
            <div className="meta-label">Correct</div>
            <div className="meta-value">{correctCount}</div>
          </div>
          <div>
            <div className="meta-label">Total</div>
            <div className="meta-value">{totalQuestions}</div>
          </div>
          <div>
            <div className="meta-label">Next</div>
            <div className="meta-value">Writing</div>
          </div>
        </div>

        <div
          className="flex-wrap mt8"
          style={{ justifyContent: 'center', display: 'flex', gap: '14px' }}
        >
          <button
            type="button"
            className="btn btn-outline-blue"
            onClick={() => {
              setCurrentIdx(0)
              setSelectedAnswer('')
              setIsChecked(false)
              setCorrectCount(0)
              setTypingInput('')
            }}
          >
            Ulangi latihan
          </button>
          <Link className="btn" to={`/lessons/${lessonId}/writing`}>
            Lanjut ke writing →
          </Link>
        </div>
      </section>
    )
  }

  const q = questions[currentIdx]
  const pct = Math.round((currentIdx / totalQuestions) * 100)
  const isCorrect =
    q.correct && selectedAnswer.toLowerCase().trim() === q.correct.toLowerCase().trim()

  function handleOptionClick(text: string) {
    if (isChecked) return
    setSelectedAnswer(text)
    setIsChecked(true)
    if (text.toLowerCase().trim() === q.correct.toLowerCase().trim()) {
      setCorrectCount((c) => c + 1)
    }
  }

  function handleTypingSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!typingInput.trim() || isChecked) return
    const ans = typingInput.trim()
    setSelectedAnswer(ans)
    setIsChecked(true)
    if (ans.toLowerCase().trim() === q.correct.toLowerCase().trim()) {
      setCorrectCount((c) => c + 1)
    }
  }

  function handleNext() {
    setCurrentIdx((prev) => prev + 1)
    setSelectedAnswer('')
    setIsChecked(false)
    setTypingInput('')
  }

  return (
    <section className="wrap-sm">
      <div className="section-index">Active recall / checkpoint</div>
      <div className="row mb6">
        <span className="tag-code">
          DRILL {String(currentIdx + 1).padStart(2, '0')} / {String(totalQuestions).padStart(2, '0')}
        </span>
        <span className="small gray">{pct}% route</span>
      </div>

      <div className="bar bar-sm bar-blue">
        <span style={{ width: `${pct}%` }}></span>
      </div>

      <div className="question-card mt8">
        <div className="question-number">{String(currentIdx + 1).padStart(2, '0')}</div>
        <div className="question-copy">
          <span className="tiny gray">TERJEMAHKAN / RECALL</span>
          <h2 className="mt3">{q.prompt}</h2>
          <p className="mt2 small muted">
            {q.question_type === 'mcq_meaning'
              ? 'Pilih terjemahan yang tepat'
              : 'Ketik terjemahan yang tepat'}
          </p>
        </div>
      </div>

      <div className="mt7">
        {q.options && q.options.length > 0 ? (
          <div className="choice-grid">
            {q.options.map((opt, i) => (
              <button
                key={opt.id || i}
                type="button"
                className={`answer-choice ${selectedAnswer === opt.text ? 'selected' : ''}`}
                onClick={() => handleOptionClick(opt.text)}
                disabled={isChecked}
              >
                <span className="answer-key">{String.fromCharCode(65 + i)}</span>
                <span className="semi">{opt.text}</span>
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleTypingSubmit} className="card card-xl">
            <label className="field">
              Jawaban
              <input
                className="input mt3"
                name="answer"
                placeholder="Ketik jawaban Anda..."
                value={typingInput}
                onChange={(e) => setTypingInput(e.target.value)}
                disabled={isChecked}
                autoFocus
              />
            </label>
            <div className="mt6" style={{ textAlign: 'right' }}>
              <button type="submit" className="btn" disabled={!typingInput.trim() || isChecked}>
                Periksa jawaban
              </button>
            </div>
          </form>
        )}
      </div>

      {isChecked && (
        <div className={`feedback-card mt7 ${isCorrect ? 'success' : 'error'}`}>
          <div>
            <span className="tag-code">{isCorrect ? 'CORRECT' : 'REVIEW'}</span>
            <h3 className="mt3">{isCorrect ? 'Tepat.' : 'Hampir.'}</h3>
            <p className="mt2 small">
              Jawaban benar: <strong>{q.correct}</strong>
            </p>
            <p className="mt1 small muted">
              Gunakan kata ini lagi dalam konteks perkenalan sehari-hari.
            </p>
          </div>
          <button
            type="button"
            className={`btn ${isCorrect ? 'btn-green' : ''}`}
            onClick={handleNext}
          >
            Lanjut
          </button>
        </div>
      )}
    </section>
  )
}
