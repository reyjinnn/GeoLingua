import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageState } from '../../components/common/PageState'
import { adminApi, type ModuleAdmin } from '../../api/adminApi'

export function AdminModulesPage() {
  const [modules, setModules] = useState<ModuleAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<number | null>(null)

  async function loadModules() {
    setLoading(true)
    try {
      const data = await adminApi.listModules()
      setModules(data)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Gagal memuat modul.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadModules() }, [])

  async function handlePublish(id: number) {
    setBusyId(id)
    try {
      await adminApi.publishModule(id)
      await loadModules()
    } catch (cause) {
      alert(cause instanceof Error ? cause.message : 'Gagal publish.')
    } finally {
      setBusyId(null)
    }
  }

  async function handleUnpublish(id: number) {
    setBusyId(id)
    try {
      await adminApi.unpublishModule(id)
      await loadModules()
    } catch (cause) {
      alert(cause instanceof Error ? cause.message : 'Gagal unpublish.')
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Yakin hapus modul ini?')) return
    setBusyId(id)
    try {
      await adminApi.deleteModule(id)
      await loadModules()
    } catch (cause) {
      alert(cause instanceof Error ? cause.message : 'Gagal hapus.')
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <p role="status">Memuat modul...</p>
  if (error) return <PageState title="Modul gagal dimuat" message={error} />

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Manajemen Modul</h1>
        <Link
          to="/admin/modules/new/edit"
          className="inline-flex min-h-12 items-center rounded-lg bg-brand px-5 font-semibold text-white hover:bg-brand-hover"
        >
          + Buat Modul Baru
        </Link>
      </div>

      {modules.length === 0 ? (
        <PageState title="Belum ada modul" message="Buat modul pertama Anda." />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[800px] text-left">
            <thead className="border-b border-slate-200 bg-slate-50 text-sm text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Kode</th>
                <th className="px-4 py-3 font-semibold">Judul</th>
                <th className="px-4 py-3 font-semibold">Level</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {modules.map((m) => (
                <tr key={m.id}>
                  <td className="px-4 py-4 font-mono text-sm">{m.module_code}</td>
                  <td className="px-4 py-4">
                    <div className="font-semibold">{m.title}</div>
                    <div className="text-sm text-slate-500">{m.topic}</div>
                  </td>
                  <td className="px-4 py-4">{m.level_code}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        m.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : m.status === 'draft'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-3">
                      <Link
                        to={`/admin/modules/${m.id}/edit`}
                        className="font-medium text-brand hover:underline"
                      >
                        Edit
                      </Link>
                      {m.status === 'published' ? (
                        <button
                          onClick={() => handleUnpublish(m.id)}
                          disabled={busyId === m.id}
                          className="font-medium text-amber-600 hover:underline disabled:opacity-50"
                        >
                          Draft
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePublish(m.id)}
                          disabled={busyId === m.id}
                          className="font-medium text-green-600 hover:underline disabled:opacity-50"
                        >
                          Publish
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(m.id)}
                        disabled={busyId === m.id}
                        className="font-medium text-red-600 hover:underline disabled:opacity-50"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}