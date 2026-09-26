import { Link } from 'react-router-dom'

export function PageState({ title, message, retry }: { title: string; message: string; retry?: () => void }) {
  return <section role="status" className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-xl font-semibold">{title}</h2><p className="mt-2 text-slate-600">{message}</p>
    <div className="mt-5 flex flex-wrap gap-3">{retry && <button className="min-h-12 rounded-lg border border-brand px-4 font-semibold text-brand" onClick={retry}>Coba lagi</button>}<Link to="/dashboard" className="inline-flex min-h-12 items-center rounded-lg px-4 font-semibold text-brand">Ke dasbor</Link></div>
  </section>
}
