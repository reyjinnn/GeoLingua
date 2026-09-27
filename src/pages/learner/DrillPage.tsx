import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { learningApi } from '../../api/learningApi'
import { PageState } from '../../components/common/PageState'
import { useDrillEngine } from '../../hooks/useDrillEngine'
import type { DrillQuestion } from '../../types/learning.types'
import { Button } from '../../components/common/Button'

export function DrillPage() {
  const { id } = useParams()
  const [questions, setQuestions] = useState<DrillQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [correctCount, setCorrectCount] = useState(0)

  useEffect(() => {
    if (!id) return
    let active = true
    learningApi.drills(id)
      .then((data) => { if (active) setQuestions(data) })
      .catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : 'Soal gagal dimuat.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  const engine = useDrillEngine(questions)
  const [answer, setAnswer] = useState('')

  function handleNext() {
    if (engine.result?.is_correct) {
      setCorrectCount(c => c + 1)
    }
    setAnswer('')
    engine.next()
  }

  if (loading) return <p role="status">Memuat latihan...</p>
  if (error) return <PageState title="Latihan belum tersedia" message={error} />
  if (questions.length === 0) return <PageState title="Latihan belum tersedia" message="Belum ada soal latihan untuk pelajaran ini." />

  if (engine.done) {
    const accuracy = Math.round((correctCount / questions.length) * 100)
    return <section className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-3xl font-bold">Latihan selesai!</h1>
      <p className="mt-4 text-slate-600">Akurasi Anda: <strong className="text-xl text-brand">{accuracy}%</strong></p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button type="button" onClick={() => window.location.reload()} className="min-h-12 rounded-lg border border-brand px-6 font-semibold text-brand hover:bg-blue-50">Ulangi latihan</button>
        <Link to={`/lessons/${id}/writing`} className="inline-flex min-h-12 items-center rounded-lg bg-brand px-6 font-semibold text-white hover:bg-blue-700">Lanjut ke writing →</Link>
      </div>
    </section>
  }

  const q = engine.question!
  const isChecked = engine.result !== null

  return <section className="mx-auto max-w-2xl">
    <header className="mb-8">
      <div className="flex justify-between text-sm font-semibold text-slate-500">
        <span>Soal {engine.index + 1} dari {questions.length}</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div className="h-full bg-brand transition-all duration-300" style={{ width: `${(engine.index / questions.length) * 100}%` }} />
      </div>
    </header>

    <h2 className="text-2xl font-bold">{q.prompt}</h2>
    <p className="mt-2 text-sm text-slate-600">{q.question_type === 'mcq_meaning' ? 'Pilih terjemahan yang tepat' : 'Ketik terjemahan yang tepat'}</p>

    <div className="mt-8">
      {q.question_type === 'mcq_meaning' && q.options && (
        <div className="grid gap-3">
          {q.options.map(opt => (
            <button
              key={opt.id}
              disabled={isChecked || engine.checking}
              onClick={() => { setAnswer(opt.text); engine.check(opt.id.toString()) }}
              className={`flex min-h-14 items-center rounded-lg border p-4 text-left transition-colors ${answer === opt.text ? 'border-brand bg-blue-50' : 'border-slate-200 hover:border-slate-300'} disabled:opacity-80`}
            >
              {opt.text}
            </button>
          ))}
        </div>
      )}

      {q.question_type === 'typing' && (
        <form onSubmit={e => { e.preventDefault(); engine.check(answer) }}>
          <input
            type="text"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            disabled={isChecked || engine.checking}
            placeholder={q.placeholder || 'Ketik jawaban Anda...'}
            className="w-full rounded-lg border border-slate-300 p-4 font-medium outline-none focus:border-brand focus:ring-1 focus:ring-brand disabled:bg-slate-50"
            autoFocus
          />
          {!isChecked && (
            <div className="mt-6 flex justify-end">
              <Button disabled={!answer.trim() || engine.checking}>{engine.checking ? 'Memeriksa...' : 'Periksa'}</Button>
            </div>
          )}
        </form>
      )}
    </div>

    {engine.error && <p className="mt-4 text-danger">{engine.error}</p>}

    {engine.result && (
      <div className={`mt-8 rounded-lg p-5 ${engine.result.is_correct ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`}>
        <h3 className="text-xl font-bold">{engine.result.is_correct ? 'Benar!' : 'Kurang tepat'}</h3>
        <p className="mt-2">Jawaban benar: <strong>{engine.result.correct_answer}</strong></p>
        {engine.result.explanation && <p className="mt-1 text-sm">{engine.result.explanation}</p>}
        
        <div className="mt-5 flex justify-end">
          <Button onClick={handleNext} className={engine.result.is_correct ? 'bg-green-700 hover:bg-green-800' : 'bg-red-700 hover:bg-red-800'}>
            Lanjut
          </Button>
        </div>
      </div>
    )}
  </section>
}
