import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageState } from '../../components/common/PageState'
import { Button } from '../../components/common/Button'
import { adminApi, type CreateModuleInput } from '../../api/adminApi'

const EMPTY_FORM: CreateModuleInput = {
  course_id: 1,
  level_id: 1,
  module_code: '',
  title: '',
  topic: '',
  description: '',
  learning_objectives: '',
  order_index: 1,
  prerequisite_module_id: null,
}

export function AdminModuleEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [form, setForm] = useState<CreateModuleInput>(EMPTY_FORM)
  const [loading, setLoading] = useState(!isNew)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isNew) return
    let active = true
    adminApi
      .showModule(Number(id))
      .then((data) => {
        if (!active) return
        setForm({
          course_id: data.course_id,
          level_id: data.level_id,
          module_code: data.module_code,
          title: data.title,
          topic: data.topic,
          description: data.description,
          learning_objectives: data.learning_objectives,
          order_index: data.order_index,
          prerequisite_module_id: data.prerequisite_module_id,
        })
      })
      .catch((cause) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Gagal memuat modul.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id, isNew])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (isNew) {
        const result = await adminApi.createModule(form)
        navigate(`/admin/modules/${result.id}/edit`)
      } else {
        await adminApi.updateModule(Number(id), form)
        alert('Modul berhasil diperbarui.')
      }
    } catch (cause) {
      alert(cause instanceof Error ? cause.message : 'Gagal simpan.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p role="status">Memuat modul...</p>
  if (error) return <PageState title="Modul gagal dimuat" message={error} />

  return (
    <div>
      <Link to="/admin/modules" className="font-medium text-brand">← Kembali ke daftar modul</Link>
      <h1 className="mt-4 text-3xl font-bold">{isNew ? 'Buat Modul Baru' : `Edit Modul: ${form.title}`}</h1>

      <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Module Code</span>
          <input value={form.module_code} onChange={(e) => setForm({ ...form, module_code: e.target.value })} className="mt-1 min-h-12 w-full rounded-lg border border-slate-300 px-3" required />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Judul</span>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1 min-h-12 w-full rounded-lg border border-slate-300 px-3" required />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Topic</span>
          <input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className="mt-1 min-h-12 w-full rounded-lg border border-slate-300 px-3" required />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Description</span>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1 w-full rounded-lg border border-slate-300 p-3" required />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Learning Objectives</span>
          <textarea value={form.learning_objectives} onChange={(e) => setForm({ ...form, learning_objectives: e.target.value })} rows={3} className="mt-1 w-full rounded-lg border border-slate-300 p-3" required />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Course ID</span>
            <input type="number" value={form.course_id} onChange={(e) => setForm({ ...form, course_id: Number(e.target.value) })} className="mt-1 min-h-12 w-full rounded-lg border border-slate-300 px-3" required />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Level ID</span>
            <input type="number" value={form.level_id} onChange={(e) => setForm({ ...form, level_id: Number(e.target.value) })} className="mt-1 min-h-12 w-full rounded-lg border border-slate-300 px-3" required />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Order Index</span>
            <input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} className="mt-1 min-h-12 w-full rounded-lg border border-slate-300 px-3" required />
          </label>
        </div>
        <div className="flex gap-3">
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Menyimpan...' : isNew ? 'Buat Modul' : 'Simpan Perubahan'}
          </Button>
          <Link to="/admin/modules" className="inline-flex min-h-12 items-center rounded-lg border border-slate-300 px-5 font-semibold text-slate-700 hover:bg-slate-50">
            Batal
          </Link>
        </div>
      </form>
    </div>
  )
}