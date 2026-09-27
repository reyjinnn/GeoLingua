import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { curriculumApi } from '../../api/curriculumApi'
import { Button } from '../../components/common/Button'
import { useAuth } from '../../hooks/useAuth'
import { useLearning } from '../../hooks/useLearning'
import type { CourseOption, Language, Level } from '../../types/curriculum.types'

type Step = 0 | 1 | 2
const stepTitles = ['Bahasa pengantar', 'Bahasa tujuan', 'Level belajar']

export function OnboardingPage() {
  const [languages, setLanguages] = useState<Language[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  const [courses, setCourses] = useState<CourseOption[]>([])
  const [baseCode, setBaseCode] = useState('')
  const [targetCode, setTargetCode] = useState('')
  const [levelCode, setLevelCode] = useState('')
  const [step, setStep] = useState<Step>(0)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
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
        setBaseCode(courseList[0]?.base_language_code ?? '')
        setTargetCode(courseList[0]?.target_language_code ?? '')
        setLevelCode(levelList.find((level) => level.code === 'A1')?.code ?? levelList[0]?.code ?? '')
        setError('')
      })
      .catch((cause) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Pilihan belajar gagal dimuat.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [reload])

  const baseCodes = new Set(courses.map((course) => course.base_language_code))
  const targetCodes = new Set(courses.filter((course) => course.base_language_code === baseCode).map((course) => course.target_language_code))
  const baseOptions = languages.filter((language) => baseCodes.has(language.code))
  const targetOptions = languages.filter((language) => targetCodes.has(language.code))
  const selectedCourse = courses.find((course) => course.base_language_code === baseCode && course.target_language_code === targetCode)
  const selectedLevel = levels.find((level) => level.code === levelCode)

  function chooseBase(code: string) {
    setBaseCode(code)
    setTargetCode(courses.find((course) => course.base_language_code === code)?.target_language_code ?? '')
    setError('')
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (step < 2) {
      if (step === 0 && !baseCode) { setError('Pilih bahasa pengantar.'); return }
      if (step === 1 && !selectedCourse) { setError('Pilih bahasa tujuan yang tersedia.'); return }
      setStep((step + 1) as Step)
      return
    }
    if (!selectedCourse || !selectedLevel) {
      setError('Pilih kursus dan level belajar.')
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
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Preferensi gagal disimpan. Coba lagi.')
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <p role="status" className="py-12 text-center text-slate-600">Memuat pilihan belajar...</p>
  if (!baseOptions.length || !targetOptions.length || !levels.length) {
    return <section role="status" className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-bold">Pilihan belajar belum tersedia</h1>
      <p className="mt-2 text-slate-600">{error || 'Kursus atau level belum disiapkan. Coba lagi nanti.'}</p>
      <button type="button" onClick={() => { setLoading(true); setReload((value) => value + 1) }} className="mt-5 min-h-12 rounded-lg border border-brand px-5 font-semibold text-brand">Coba lagi</button>
    </section>
  }

  return <section className="mx-auto max-w-2xl">
    <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Siapkan jalur belajar</p>
    <h1 className="mt-2 text-3xl font-bold">Mulai dari bahasa yang cocok untukmu</h1>
    <p className="mt-3 text-slate-600">Tiga langkah singkat untuk menentukan kursus pertamamu.</p>

    <ol aria-label="Tahap onboarding" className="mt-7 grid grid-cols-3 gap-2">
      {stepTitles.map((title, index) => <li key={title} aria-current={step === index ? 'step' : undefined} className={`rounded-lg border px-3 py-3 text-sm ${step === index ? 'border-brand bg-blue-50 font-semibold text-brand' : index < step ? 'border-secondary bg-teal-50 text-secondary' : 'border-slate-200 text-slate-500'}`}>
        <span className="block text-xs">Langkah {index + 1}</span>{title}
      </li>)}
    </ol>

    <form onSubmit={submit} className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {step === 0 && <fieldset>
        <legend className="text-xl font-semibold">Bahasa apa yang paling nyaman kamu gunakan?</legend>
        <p className="mt-1 text-sm text-slate-600">Penjelasan materi akan menggunakan bahasa ini.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {baseOptions.map((language) => <label key={language.id} className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-lg border p-4 ${baseCode === language.code ? 'border-brand bg-blue-50' : 'border-slate-200'}`}>
            <input type="radio" name="base" value={language.code} checked={baseCode === language.code} onChange={() => chooseBase(language.code)} />
            <span className="font-medium">{language.native_name}</span>
          </label>)}
        </div>
      </fieldset>}

      {step === 1 && <fieldset>
        <legend className="text-xl font-semibold">Bahasa apa yang ingin kamu pelajari?</legend>
        <p className="mt-1 text-sm text-slate-600">Pilihan ini hanya menampilkan kursus yang tersedia.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {targetOptions.map((language) => <label key={language.id} className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-lg border p-4 ${targetCode === language.code ? 'border-brand bg-blue-50' : 'border-slate-200'}`}>
            <input type="radio" name="target" value={language.code} checked={targetCode === language.code} onChange={() => { setTargetCode(language.code); setError('') }} />
            <span className="font-medium">{language.native_name}</span>
          </label>)}
        </div>
      </fieldset>}

      {step === 2 && <fieldset>
        <legend className="text-xl font-semibold">Pilih level awalmu</legend>
        <p className="mt-1 text-sm text-slate-600">Mulai dari A1 jika kamu baru belajar. Kamu bisa mengubah jalur belajar nanti.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {levels.map((level) => <label key={level.id} className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-lg border p-4 ${levelCode === level.code ? 'border-brand bg-blue-50' : 'border-slate-200'}`}>
            <input type="radio" name="level" value={level.code} checked={levelCode === level.code} onChange={() => { setLevelCode(level.code); setError('') }} />
            <span><strong>{level.code}</strong><span className="ml-2 text-sm text-slate-600">{level.name}</span></span>
          </label>)}
        </div>
        <p className="mt-5 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">Kursus: <strong>{selectedCourse?.title}</strong> · Level: <strong>{selectedLevel?.code}</strong></p>
      </fieldset>}

      {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-4 text-danger">{error}</p>}
      <div className="mt-7 flex flex-wrap justify-between gap-3">
        <button type="button" disabled={step === 0 || busy} onClick={() => { setError(''); setStep((step - 1) as Step) }} className="min-h-12 rounded-lg border border-slate-300 px-5 font-semibold text-slate-700 disabled:opacity-40">Kembali</button>
        <Button disabled={busy || (step === 1 && !selectedCourse) || (step === 2 && !selectedLevel)}>{busy ? 'Menyimpan...' : step === 2 ? 'Simpan dan mulai belajar' : 'Lanjut'}</Button>
      </div>
    </form>
  </section>
}

