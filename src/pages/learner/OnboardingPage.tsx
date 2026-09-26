import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { curriculumApi } from '../../api/curriculumApi'
import { Button } from '../../components/common/Button'
import { PageState } from '../../components/common/PageState'
import { useLearning } from '../../hooks/useLearning'
import { useAuth } from '../../hooks/useAuth'
import type { Language, Level } from '../../types/curriculum.types'

export function OnboardingPage() {
  const [languages, setLanguages] = useState<Language[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [reload, setReload] = useState(0)
  const { setPreferences } = useLearning()
  const { refreshUser } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    let active = true
    Promise.all([curriculumApi.languages(), curriculumApi.levels()]).then(([allLanguages, allLevels]) => { if (active) { setLanguages(allLanguages); setLevels(allLevels) } }).catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : 'Pilihan bahasa gagal dimuat.') }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [reload])
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('')
    const data = new FormData(event.currentTarget)
    const input = { base_language_code: String(data.get('base')), target_language_code: String(data.get('target')), level_code: String(data.get('level')) }
    if (input.base_language_code === input.target_language_code) { setError('Bahasa pengantar dan bahasa sasaran harus berbeda.'); return }
    setBusy(true)
    try { await curriculumApi.savePreferences(input); setPreferences(input); await refreshUser(); navigate('/dashboard') }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Preferensi gagal disimpan.') }
    finally { setBusy(false) }
  }
  if (loading) return <p role="status">Memuat pilihan belajar...</p>
  if (!languages.length || !levels.length) return <PageState title="Pilihan belajar belum tersedia" message={error || 'Belum ada bahasa atau level yang dapat dipilih.'} retry={() => { setError(''); setLoading(true); setReload((value) => value + 1) }} />
  return <section className="mx-auto max-w-2xl"><p className="font-semibold text-secondary">Langkah 1 dari 3 · Atur jalur belajar</p><h1 className="mt-2 text-3xl font-bold">Bahasa apa yang ingin Anda pelajari?</h1><p className="mt-3 text-slate-600">Pilih bahasa yang Anda pahami, bahasa sasaran, dan level awal.</p>{error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-4 text-danger">{error}</p>}
    <form onSubmit={submit} className="mt-7 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><label className="block font-medium">Bahasa pengantar<select name="base" defaultValue="id" required className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 px-3">{languages.map((language) => <option key={language.id} value={language.code}>{language.native_name}</option>)}</select></label><label className="block font-medium">Bahasa sasaran<select name="target" defaultValue="en" required className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 px-3">{languages.map((language) => <option key={language.id} value={language.code}>{language.native_name}</option>)}</select></label><label className="block font-medium">Level CEFR<select name="level" defaultValue="A1" required className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 px-3">{levels.map((level) => <option key={level.id} value={level.code}>{level.code} · {level.name}</option>)}</select></label><Button disabled={busy} className="w-full">{busy ? 'Menyimpan...' : 'Simpan dan masuk ke dasbor'}</Button></form></section>
}
