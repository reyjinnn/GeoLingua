import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { adminApi } from '../../api/adminApi'
import { ApiError } from '../../api/apiClient'
import { Button } from '../../components/common/Button'

export function AdminModuleEditorPage() {
  const { id } = useParams()
  const moduleId = Number(id)
  
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')
  const [missingDetails, setMissingDetails] = useState<string[]>([])
  const [success, setSuccess] = useState('')

  async function handlePublish() {
    setPublishing(true)
    setError('')
    setMissingDetails([])
    setSuccess('')
    try {
      const result = await adminApi.publishModule(moduleId)
      setSuccess(result.message || 'Modul berhasil dipublikasikan!')
    } catch (cause) {
      if (cause instanceof ApiError) {
        setError(cause.message)
        if (Array.isArray(cause.details)) {
          setMissingDetails(cause.details as string[])
        } else if (cause.details && typeof cause.details === 'object') {
          setMissingDetails(Object.values(cause.details as Record<string, string>))
        } else {
          setMissingDetails([])
        }
      } else {
        setError(cause instanceof Error ? cause.message : 'Gagal mempublikasikan modul.')
        setMissingDetails([])
      }
    } finally {
      setPublishing(false)
    }
  }

  return <section className="mx-auto max-w-4xl">
    <header className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Editor Modul #{moduleId}</h1>
        <p className="mt-2 text-slate-600">Isi seluruh konten sebelum mempublikasikan modul.</p>
      </div>
      <Button 
        onClick={handlePublish} 
        disabled={publishing}
        className={success ? 'bg-green-700 hover:bg-green-800' : 'bg-brand'}
      >
        {publishing ? 'Memvalidasi...' : success ? 'Published ✓' : 'Publish Modul'}
      </Button>
    </header>

    {error && (
      <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-6 text-red-900">
        <h2 className="text-lg font-bold">Gagal Publikasi</h2>
        <p className="mt-1">{error}</p>
        {missingDetails.length > 0 && (
          <div className="mt-3">
            <p className="font-semibold text-sm text-red-800">Daftar kekurangan materi:</p>
            <ul className="mt-1.5 list-disc list-inside space-y-1 text-sm text-red-700">
              {missingDetails.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        <p className="mt-3 text-sm text-red-700">Pastikan modul ini memiliki setidaknya 1 pelajaran dengan kosakata, latihan drill, writing prompt, dan kuis berisi 10 pertanyaan valid.</p>
      </div>
    )}
    
    {success && (
      <div className="mb-8 rounded-xl border border-green-200 bg-green-50 p-6 text-green-900">
        <h2 className="text-lg font-bold">Publikasi Berhasil</h2>
        <p className="mt-1">{success}</p>
      </div>
    )}

    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Daftar Pelajaran</h2>
        <p className="text-sm text-slate-600 mb-6">Form tambah Kosakata, Drill, dan Writing Prompt.</p>
        
        <div className="rounded-lg bg-slate-50 p-8 text-center text-slate-500 border border-slate-200 border-dashed">
          Mekanisme form kompleks konten<br/>akan diimplementasi dalam sprint terpisah.
        </div>
      </div>
      
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Soal Kuis</h2>
        <p className="text-sm text-slate-600 mb-6">Modul publik wajib memiliki 10 soal kuis pilihan ganda.</p>
        
        <div className="rounded-lg bg-slate-50 p-8 text-center text-slate-500 border border-slate-200 border-dashed">
          Mekanisme editor soal kuis<br/>akan diimplementasi dalam sprint terpisah.
        </div>
      </div>
    </div>
  </section>
}
