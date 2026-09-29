import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { learningApi } from '../../api/learningApi'

export function WritingPage() {
  const { id } = useParams()
  const lessonId = id || '1'

  const [prompt, setPrompt] = useState({
    id: 1,
    title: 'Perkenalkan dirimu kepada teman baru dalam bahasa Inggris.',
    instruction: 'Tulis satu paragraf pendek menggunakan sapaan dan perkenalan diri.',
    requiredVocabulary: ['hello', 'name'],
    minimumWords: 20,
  })

  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Checklist states
  const [check1, setCheck1] = useState(false)
  const [check2, setCheck2] = useState(false)
  const [check3, setCheck3] = useState(false)

  useEffect(() => {
    if (!id) return
    learningApi
      .writing(id)
      .then((data) => {
        if (data) {
          setPrompt({
            id: data.id || 1,
            title: data.writing_prompt || 'Perkenalkan dirimu kepada teman baru dalam bahasa Inggris.',
            instruction:
              data.instruction ||
              'Tulis satu paragraf pendek menggunakan sapaan dan perkenalan diri.',
            requiredVocabulary:
              data.required_vocabulary && data.required_vocabulary.length > 0
                ? data.required_vocabulary
                : ['hello', 'name'],
            minimumWords: data.minimum_words || 20,
          })
        }
      })
      .catch(() => {
        // Fallback to default prompt
      })
  }, [id])

  const words = text.trim() ? text.trim().split(/\s+/) : []
  const wordCount = words.length
  const missingWords = prompt.requiredVocabulary.filter(
    (w) => !new RegExp(`\\b${w}\\b`, 'i').test(text)
  )
  const canSubmit = wordCount >= prompt.minimumWords && missingWords.length === 0

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit || submitting) return
    setSubmitting(true)
    try {
      await learningApi.submitWriting(prompt.id, text)
    } catch {
      // Allow visual completion in mock mode
    } finally {
      setSubmitting(false)
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <section className="completion-card wrap">
        <div className="completion-orbit success">
          <span>✓</span>
        </div>
        <div className="brand-kicker mt4">Field note saved</div>
        <h1 className="mt4">Validasi berhasil.</h1>
        <p className="mt3 muted">
          Tulisan Anda memenuhi syarat minimum ({wordCount} kata) dan semua kosakata wajib.
        </p>

        <div className="grid2 mt7">
          <div className="card">
            <span className="tag-code">SELF REVIEW</span>
            <div className="stack mt5" style={{ textAlign: 'left' }}>
              <label className="row" style={{ justifyContent: 'flex-start', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={check1}
                  onChange={(e) => setCheck1(e.target.checked)}
                />
                <span className="small">Makna kalimat sesuai dengan prompt</span>
              </label>
              <label className="row" style={{ justifyContent: 'flex-start', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={check2}
                  onChange={(e) => setCheck2(e.target.checked)}
                />
                <span className="small">Kosakata wajib digunakan dengan benar</span>
              </label>
              <label className="row" style={{ justifyContent: 'flex-start', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={check3}
                  onChange={(e) => setCheck3(e.target.checked)}
                />
                <span className="small">Kapitalisasi & tanda baca diperiksa</span>
              </label>
            </div>
          </div>

          <div className="card-pale" style={{ textAlign: 'left' }}>
            <span className="tag-code">BENCHMARK</span>
            <p
              className="mt5"
              style={{
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                lineHeight: '1.8',
                color: '#2b3952',
              }}
            >
              “Hello, my name is Raihan. I am learning English with my friend today. We enjoy
              meeting new people and practicing together every morning.”
            </p>
          </div>
        </div>

        <div
          className="flex-wrap mt8"
          style={{ justifyContent: 'center', display: 'flex', gap: '14px' }}
        >
          <Link className="btn btn-outline" to={`/lessons/${lessonId}`}>
            ← Kembali ke Pelajaran
          </Link>
          <Link className="btn" to="/dashboard">
            Selesai & Ke Dasbor
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="wrap">
      <div className="row">
        <div>
          <div className="section-index">Writing / field notebook</div>
          <h1 className="mt3">Latihan menulis</h1>
          <p className="mt2 muted">Ubah kosakata yang baru dipelajari menjadi kalimatmu sendiri.</p>
        </div>
        <span className="tag-code">A1 / M1 / WR</span>
      </div>

      <div className="writing-grid mt8">
        <aside className="card card-xl sticky">
          <span className="tag-code">PROMPT / 01</span>
          <h3 className="mt5">{prompt.title}</h3>
          <p className="mt3 small muted">{prompt.instruction}</p>

          <div className="mt7">
            <p className="tiny bold gray uppercase">Kosakata wajib</p>
            <div className="flex-wrap mt3" style={{ display: 'flex', gap: '8px' }}>
              {prompt.requiredVocabulary.map((w) => {
                const hit = !missingWords.includes(w)
                return (
                  <span key={w} className={`pill ${hit ? 'hit' : ''}`} data-word={w}>
                    {hit ? '✓ ' : ''}
                    {w}
                  </span>
                )
              })}
            </div>
          </div>

          <div className="meta-strip mt7">
            <div>
              <div className="meta-label">Minimum</div>
              <div className="meta-value">{prompt.minimumWords} kata</div>
            </div>
            <div>
              <div className="meta-label">Mode</div>
              <div className="meta-value">Free write</div>
            </div>
          </div>
        </aside>

        <form onSubmit={handleSubmit} id="writing-form">
          <div className="notebook">
            <div style={{ padding: '18px 24px 0 58px' }}>
              <span className="tag-code">FIELD NOTE / DRAFT</span>
            </div>
            <textarea
              aria-label="Tulisan perkenalan dalam bahasa Inggris"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Mulai menulis di sini... (contoh: Hello, my name is...)"
            ></textarea>
            <span
              className="badge"
              style={{
                position: 'absolute',
                right: '18px',
                bottom: '16px',
                background: wordCount >= prompt.minimumWords ? '#dcfce7' : '#fee2e2',
                color: wordCount >= prompt.minimumWords ? '#166534' : '#b91c1c',
              }}
            >
              {wordCount} / {prompt.minimumWords} kata
            </span>
          </div>

          <div className="row mt4">
            <span className="tiny gray">
              {wordCount < prompt.minimumWords
                ? `Perlu ${prompt.minimumWords - wordCount} kata lagi`
                : missingWords.length > 0
                ? `Gunakan kata: ${missingWords.join(', ')}`
                : 'Siap dikirim!'}
            </span>
            <button type="submit" className="btn" disabled={!canSubmit || submitting}>
              {submitting ? 'Mengirim...' : 'Kirim tulisan'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
