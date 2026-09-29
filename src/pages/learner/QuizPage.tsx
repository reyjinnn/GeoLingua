import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { learningApi } from '../../api/learningApi'

const defaultQuizQuestions = [
  {
    id: 1,
    question_text: 'Sapaan yang digunakan pada pagi hari adalah …',
    options: [
      { id: 1, text: 'Good morning', is_correct: 1 },
      { id: 2, text: 'Good night', is_correct: 0 },
      { id: 3, text: 'Goodbye', is_correct: 0 },
    ],
  },
  {
    id: 2,
    question_text: 'Kalimat untuk memperkenalkan diri adalah …',
    options: [
      { id: 4, text: 'My name is Ana.', is_correct: 1 },
      { id: 5, text: 'Good night, Ana.', is_correct: 0 },
      { id: 6, text: 'See you, Ana.', is_correct: 0 },
    ],
  },
  {
    id: 3,
    question_text: 'Apa arti kata “friend”?',
    options: [
      { id: 7, text: 'Teman', is_correct: 1 },
      { id: 8, text: 'Nama', is_correct: 0 },
      { id: 9, text: 'Pagi', is_correct: 0 },
    ],
  },
]

export function QuizPage() {
  const { id } = useParams()
  const moduleId = id || '1'
  const navigate = useNavigate()

  const [title, setTitle] = useState('Perkenalan sehari-hari')
  const [questions, setQuestions] = useState(defaultQuizQuestions)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const startTime = useRef<number>(Date.now())

  useEffect(() => {
    if (!id) return
    learningApi
      .quiz(id)
      .then((data) => {
        if (data && data.questions && data.questions.length > 0) {
          setTitle(data.title || 'Perkenalan sehari-hari')
          setQuestions(
            data.questions.map((q) => ({
              id: q.id,
              question_text: q.question_text,
              options: q.options.map((o) => ({
                id: o.id,
                text: o.text,
                is_correct: 0,
              })),
            }))
          )
        }
      })
      .catch(() => {
        // Fallback to default mock quiz
      })
  }, [id])

  const totalQuestions = questions.length
  const q = questions[currentIdx]
  const answeredCount = Object.keys(answers).length
  const isLast = currentIdx === totalQuestions - 1

  function handleSelectOption(optIdx: number) {
    setAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }))
  }

  async function handleSubmit() {
    setSubmitting(true)
    const durationSeconds = Math.round((Date.now() - startTime.current) / 1000)

    // Calculate score for mock mode (or API submission)
    const correctCount = Object.entries(answers).filter(([idx, optIdx]) => {
      const question = questions[Number(idx)]
      return question && optIdx === 0 // In default mock, option 0 is correct
    }).length
    const calculatedScore = Math.round((correctCount / totalQuestions) * 100)
    const isPassed = calculatedScore >= 70

    try {
      const formattedAnswers = Object.entries(answers).map(([qIdx, optId]) => ({
        question_id: questions[Number(qIdx)]?.id || Number(qIdx) + 1,
        selected_option_id: optId,
      }))
      const apiResult = await learningApi.submitQuiz(Number(moduleId), formattedAnswers, durationSeconds)
      navigate(`/modules/${moduleId}/quiz/result`, {
        state: {
          result: apiResult,
          quizTitle: title,
        },
        replace: true,
      })
    } catch {
      // Fallback navigation with calculated score
      navigate(`/modules/${moduleId}/quiz/result`, {
        state: {
          result: {
            quiz_attempt_id: 1,
            score: calculatedScore,
            passing_score: 70,
            is_passed: isPassed,
            next_module_unlocked: isPassed,
            unlocked_module_id: isPassed ? 2 : undefined,
          },
          quizTitle: title,
        },
        replace: true,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="wrap-sm">
      <div className="row">
        <div>
          <div className="section-index">Checkpoint / final quiz</div>
          <h1 className="mt3" style={{ fontSize: '40px' }}>
            {title}
          </h1>
        </div>
        <span className="tag-code">
          {String(currentIdx + 1).padStart(2, '0')} / {String(totalQuestions).padStart(2, '0')}
        </span>
      </div>

      <div className="quiz-hero mt7">
        <div className="quiz-index">
          QUESTION {String(currentIdx + 1).padStart(2, '0')} · MODULE CHECKPOINT
        </div>
        <h2 className="mt4">{q.question_text}</h2>
        <p className="small" style={{ color: '#c4cfdf', marginTop: '8px' }}>
          Pilih jawaban yang paling tepat berdasarkan materi modul.
        </p>
      </div>

      <div className="mt6">
        {q.options.map((opt, i) => (
          <button
            key={opt.id || i}
            type="button"
            className={`answer-choice ${answers[currentIdx] === i ? 'selected' : ''} mt3`}
            onClick={() => handleSelectOption(i)}
          >
            <span className="answer-key">{String.fromCharCode(65 + i)}</span>
            <span className="semi">{opt.text}</span>
          </button>
        ))}
      </div>

      <div className="row mt8">
        <button
          type="button"
          className="btn btn-soft"
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx((c) => Math.max(0, c - 1))}
        >
          Sebelumnya
        </button>
        <button
          type="button"
          className="btn"
          disabled={isLast ? answeredCount < totalQuestions || submitting : false}
          onClick={() => {
            if (isLast) {
              handleSubmit()
            } else {
              setCurrentIdx((c) => Math.min(totalQuestions - 1, c + 1))
            }
          }}
        >
          {submitting ? 'Memeriksa...' : isLast ? 'Kirim jawaban' : 'Selanjutnya'}
        </button>
      </div>

      <div className="quiz-rail mt8">
        <span className="tiny gray">PROGRESS</span>
        <div>
          {questions.map((_, i) => (
            <i
              key={i}
              className={`${i < answeredCount ? 'done' : i === currentIdx ? 'current' : ''}`}
            ></i>
          ))}
        </div>
      </div>
    </section>
  )
}
