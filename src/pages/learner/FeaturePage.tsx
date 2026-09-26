import { Link } from 'react-router-dom'

export function FeaturePage({ title, description }: { title: string; description: string }) {
  return <section className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm"><p className="text-sm font-semibold text-secondary">Fondasi GeoLingua</p><h1 className="mt-2 text-3xl font-bold">{title}</h1><p className="mt-4 leading-relaxed text-slate-600">{description}</p><p className="mt-4 text-sm text-slate-500">Layar ini menunggu implementasi endpoint dan alur fitur sesuai spesifikasi proyek.</p><Link to="/dashboard" className="mt-6 inline-flex min-h-12 items-center font-semibold text-brand">Kembali ke dasbor →</Link></section>
}
