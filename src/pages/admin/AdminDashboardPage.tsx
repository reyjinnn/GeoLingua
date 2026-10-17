import { useEffect, useState } from 'react'
import { PageState } from '../../components/common/PageState'
import { adminApi, type DashboardMetrics } from '../../api/adminApi'

export function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    adminApi
      .dashboard()
      .then((data) => { if (active) setMetrics(data) })
      .catch((cause) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Gagal memuat metrics.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  if (loading) return <p role="status">Memuat dashboard...</p>
  if (error) return <PageState title="Dashboard gagal dimuat" message={error} />
  if (!metrics) return <PageState title="Data kosong" message="Tidak ada metrics." />

  const cards = [
    { label: 'Total Users', value: metrics.total_users },
    { label: 'Modul Published', value: metrics.published_modules },
    { label: 'Modul Draft', value: metrics.draft_modules },
    { label: 'Modul Archived', value: metrics.archived_modules },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard Admin</h1>
      <p className="mt-2 text-slate-600">Ringkasan status konten dan pengguna.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-600">{c.label}</p>
            <p className="mt-2 text-3xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}