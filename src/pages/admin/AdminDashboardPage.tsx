import { useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi, type CreateModuleInput } from '../../api/adminApi'
import { Button } from '../../components/common/Button'

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'modules' | 'lessons' | 'vocabularies' | 'drills'>('modules')
  
  // State for form kosong setup awal modul
  const [formData, setFormData] = useState<CreateModuleInput>({
    course_id: 1,
    level_id: 1,
    module_code: '',
    title: '',
    topic: '',
    description: '',
    learning_objectives: '',
    order_index: 1,
    prerequisite_module_id: null,
    status: 'draft'
  })
  
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      const result = await adminApi.createModule(formData)
      setSuccess(result.message || 'Modul berhasil dibuat dalam status draft.')
      setFormData(prev => ({ ...prev, module_code: '', title: '', topic: '', description: '', learning_objectives: '', order_index: prev.order_index + 1 }))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Gagal membuat modul.')
    } finally {
      setSubmitting(false)
    }
  }

  const tabs = [
    { id: 'modules', label: 'Modules' },
    { id: 'lessons', label: 'Lessons' },
    { id: 'vocabularies', label: 'Vocabularies' },
    { id: 'drills', label: 'Drills' }
  ] as const

  return <section className="mx-auto max-w-4xl">
    <header className="mb-8 flex items-center justify-between">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
    </header>

    <div className="mb-6 flex border-b border-slate-200">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-6 py-3 font-semibold ${activeTab === tab.id ? 'border-b-2 border-brand text-brand' : 'text-slate-500 hover:text-slate-700'}`}
        >
          {tab.label}
        </button>
      ))}
    </div>

    {activeTab === 'modules' && (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-bold">Buat Modul Baru (Draft)</h2>
        
        {success && <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-800">{success}</div>}
        {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">{error}</div>}
        
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Course ID</label>
            <input type="number" required value={formData.course_id} onChange={e => setFormData({...formData, course_id: Number(e.target.value)})} className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Level ID</label>
            <input type="number" required value={formData.level_id} onChange={e => setFormData({...formData, level_id: Number(e.target.value)})} className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand" />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium">Module Code</label>
            <input type="text" required placeholder="Contoh: A1-01" value={formData.module_code} onChange={e => setFormData({...formData, module_code: e.target.value})} className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Order Index</label>
            <input type="number" required value={formData.order_index} onChange={e => setFormData({...formData, order_index: Number(e.target.value)})} className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand" />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand" />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Topic</label>
            <input type="text" required value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand" />
          </div>
          
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full resize-none rounded-lg border border-slate-300 p-3 outline-none focus:border-brand"></textarea>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Learning Objectives</label>
            <textarea required rows={3} value={formData.learning_objectives} onChange={e => setFormData({...formData, learning_objectives: e.target.value})} className="w-full resize-none rounded-lg border border-slate-300 p-3 outline-none focus:border-brand"></textarea>
          </div>
          
          <div className="sm:col-span-2 flex justify-end gap-3 mt-4">
            <Button disabled={submitting}>{submitting ? 'Menyimpan...' : 'Simpan Draft'}</Button>
          </div>
        </form>
        
        <div className="mt-8 pt-8 border-t border-slate-200">
          <p className="text-slate-600 mb-4">Untuk mempublikasikan modul dan mengisi konten, akses halaman editor modul.</p>
          <div className="flex gap-4">
             <Link to="/admin/modules/1/edit" className="inline-flex min-h-12 items-center rounded-lg border border-slate-300 px-5 font-semibold text-slate-700 hover:bg-slate-50">Editor (Modul ID 1)</Link>
          </div>
        </div>
      </div>
    )}
    
    {activeTab !== 'modules' && (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
        Fitur pengelolaan {activeTab} akan tersedia di rilis berikutnya.
      </div>
    )}
  </section>
}
