import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { curriculumApi } from '../../api/curriculumApi'
import { useAuth } from '../../hooks/useAuth'
import { useLearning } from '../../hooks/useLearning'
import type { CourseOption, Language, Level } from '../../types/curriculum.types'

type Step = 0 | 1 | 2
const stepLabels = ['Bahasa pengantar', 'Bahasa tujuan', 'Level belajar']
const stepQuestions = [
  'Bahasa apa yang paling nyaman kamu gunakan?',
  'Bahasa apa yang ingin kamu pelajari?',
  'Pilih level awalmu',
]
const stepSubtitles = [
  'Penjelasan materi akan menggunakan bahasa ini.',
  'Pilihan ini menentukan bahasa target kursus belajarmu.',
  'A1 adalah titik awal untuk pemula. Kamu bisa mengubah jalur belajar nanti.',
]

export function OnboardingPage() {
  const [languages, setLanguages] = useState<Language[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  const [courses, setCourses] = useState<CourseOption[]>([])
  const [baseCode, setBaseCode] = useState('id')
  const [targetCode, setTargetCode] = useState('en')
  const [levelCode, setLevelCode] = useState('A1')
  const [step, setStep] = useState<Step>(0)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const { setPreferences } = useLearning()
  const { refreshUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    Promise.all([curriculumApi.languages(), curriculumApi.levels(), curriculumApi.courses()])
      .then(([languageList, levelList, courseList]) => {
        if (!active) return
        setLanguages(languageList)
        setLevels(levelList)
        setCourses(courseList)
        if (courseList[0]?.base_language_code) setBaseCode(courseList[0].base_language_code)
        if (courseList[0]?.target_language_code) setTargetCode(courseList[0].target_language_code)
        if (levelList.find((l) => l.code === 'A1')?.code) setLevelCode('A1')
      })
      .catch(() => {
        // Fallback demo choices if API is unavailable
        setLanguages([
          { id: 1, code: 'id', name: 'Indonesian', native_name: 'Bahasa Indonesia' },
          { id: 2, code: 'en', name: 'English', native_name: 'Bahasa Inggris' },
        ])
        setLevels([
          { id: 1, code: 'A1', name: 'Pemula', order_index: 1 },
          { id: 2, code: 'A2', name: 'Dasar', order_index: 2 },
          { id: 3, code: 'B1', name: 'Menengah', order_index: 3 },
        ])
        setCourses([
          {
            id: 1,
            title: 'English for Indonesian Speakers',
            base_language_code: 'id',
            target_language_code: 'en',
          },
        ])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const baseOptions = languages.length
    ? languages.filter(
        (l) => courses.some((c) => c.base_language_code === l.code) || l.code === 'id'
      )
    : [{ id: 1, code: 'id', name: 'Indonesian', native_name: 'Bahasa Indonesia' }]

  const targetOptions = languages.length
    ? languages.filter(
        (l) => courses.some((c) => c.target_language_code === l.code) || l.code === 'en'
      )
    : [{ id: 2, code: 'en', name: 'English', native_name: 'Bahasa Inggris' }]

  const levelOptions = levels.length
    ? levels
    : [
        { id: 1, code: 'A1', name: 'Pemula', description: 'Titik awal pemula' },
        { id: 2, code: 'A2', name: 'Dasar', description: 'Kosakata & kalimat dasar' },
        { id: 3, code: 'B1', name: 'Menengah', description: 'Percakapan mandiri' },
      ]

  const selectedBaseName =
    baseOptions.find((l) => l.code === baseCode)?.native_name || 'Bahasa Indonesia'
  const selectedTargetName =
    targetOptions.find((l) => l.code === targetCode)?.native_name || 'Bahasa Inggris'

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (step < 2) {
      setStep((step + 1) as Step)
      return
    }

    const preferences = {
      base_language_code: baseCode,
      target_language_code: targetCode,
      level_code: levelCode,
    }

    setBusy(true)
    try {
      await curriculumApi.savePreferences(preferences)
      setPreferences(preferences)
      await refreshUser()
      navigate('/dashboard', { replace: true })
    } catch {
      // Graceful fallback for mock mode
      setPreferences(preferences)
      navigate('/dashboard', { replace: true })
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <section className="wrap py-12 text-center">
        <p className="muted">Memuat pilihan rute belajar...</p>
      </section>
    )
  }

  return (
    <section className="onboarding-layout wrap">
      {/* Aside Rail */}
      <aside className="onboarding-rail">
        <div className="tag-code">ROUTE SETUP</div>
        <h2 className="mt4">Rute belajar dibangun dari konteksmu.</h2>
        <p className="mt3 muted">
          GeoLingua mengubah pilihan bahasa dan level menjadi satu jalur belajar yang bisa kamu
          ikuti.
        </p>

        <div className="route-line mt7">
          {stepLabels.map((label, idx) => {
            const isDone = idx < step
            const isCurrent = idx === step
            return (
              <div
                key={label}
                className={`route-node ${isDone ? 'done' : isCurrent ? '' : 'locked'} mb6`}
              >
                <span className="tiny gray">0{idx + 1}</span>
                <strong style={{ display: 'block', marginTop: '5px' }}>{label}</strong>
              </div>
            )
          })}
        </div>
      </aside>

      {/* Main Content */}
      <section>
        <p className="brand-kicker">Siapkan jalur belajar</p>
        <h1 className="mt3">Mulai dari bahasa yang cocok untukmu</h1>
        <p className="mt3 muted">Tiga langkah singkat untuk menentukan kursus pertamamu.</p>

        <form onSubmit={handleSubmit} className="card card-xl mt7" id="onboarding-form">
          <div className="row">
            <div>
              <span className="tag-code">STEP 0{step + 1}</span>
              <h3 className="mt4">{stepQuestions[step]}</h3>
              <p className="small muted mt2">{stepSubtitles[step]}</p>
            </div>
            <span className="tiny gray">{step + 1} / 3</span>
          </div>

          <div className="grid2 mt7" style={{ gap: '14px' }}>
            {step === 0 &&
              baseOptions.map((lang) => {
                const selected = baseCode === lang.code
                return (
                  <label
                    key={lang.code}
                    className={`choice ${selected ? 'selected' : ''}`}
                    style={{
                      minHeight: '76px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <input
                      type="radio"
                      name="base"
                      value={lang.code}
                      checked={selected}
                      onChange={() => setBaseCode(lang.code)}
                    />
                    <span>
                      <strong>{lang.native_name}</strong>
                    </span>
                  </label>
                )
              })}

            {step === 1 &&
              targetOptions.map((lang) => {
                const selected = targetCode === lang.code
                return (
                  <label
                    key={lang.code}
                    className={`choice ${selected ? 'selected' : ''}`}
                    style={{
                      minHeight: '76px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <input
                      type="radio"
                      name="target"
                      value={lang.code}
                      checked={selected}
                      onChange={() => setTargetCode(lang.code)}
                    />
                    <span>
                      <strong>{lang.native_name}</strong>
                    </span>
                  </label>
                )
              })}

            {step === 2 &&
              levelOptions.map((lvl) => {
                const selected = levelCode === lvl.code
                return (
                  <label
                    key={lvl.code}
                    className={`choice ${selected ? 'selected' : ''}`}
                    style={{
                      minHeight: '76px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <input
                      type="radio"
                      name="level"
                      value={lvl.code}
                      checked={selected}
                      onChange={() => setLevelCode(lvl.code)}
                    />
                    <span>
                      <strong>{lvl.code}</strong>
                      <span className="small muted" style={{ display: 'block', marginTop: '4px' }}>
                        {lvl.name}
                      </span>
                    </span>
                  </label>
                )
              })}
          </div>

          {step === 2 && (
            <div className="meta-strip mt7">
              <div>
                <div className="meta-label">Course</div>
                <div className="meta-value">{selectedTargetName}</div>
              </div>
              <div>
                <div className="meta-label">Input</div>
                <div className="meta-value">{selectedBaseName}</div>
              </div>
              <div>
                <div className="meta-label">Level</div>
                <div className="meta-value">{levelCode}</div>
              </div>
            </div>
          )}

          {error && (
            <div
              className="mt4 rounded-lg p-3 small"
              style={{ background: '#fff3f3', border: '1px solid #fecaca', color: '#c24141' }}
            >
              {error}
            </div>
          )}

          <div className="row mt7">
            <button
              type="button"
              disabled={step === 0 || busy}
              onClick={() => {
                setError('')
                setStep((step - 1) as Step)
              }}
              className="btn btn-outline"
            >
              Kembali
            </button>
            <button type="submit" disabled={busy} className="btn">
              {busy
                ? 'Menyimpan...'
                : step === 2
                ? 'Simpan dan mulai belajar'
                : 'Lanjut'}
            </button>
          </div>
        </form>
      </section>
    </section>
  )
}
