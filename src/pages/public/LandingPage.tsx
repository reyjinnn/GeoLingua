import { Link } from 'react-router-dom'

const pillars = [
  ['01', 'Pelajari', 'Temukan kata, arti, pelafalan, dan contoh kalimat dalam konteks.'],
  ['02', 'Latih', 'Uji ingatan dengan pilihan ganda dan latihan mengetik.'],
  ['03', 'Tulis', 'Gunakan kosakata baru untuk menyusun kalimat sendiri.'],
  ['04', 'Uji', 'Selesaikan kuis modul dan lanjutkan ke tahap berikutnya.'],
]
export function LandingPage() {
  return <>
    <section className="grid gap-10 py-12 md:grid-cols-2 md:items-center md:py-20">
      <div><p className="mb-4 font-semibold uppercase tracking-widest text-secondary">Belajar aktif · 100% gratis</p><h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">Kuasai bahasa asing secara mandiri, satu modul demi satu.</h1><p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">GeoLingua membantu Anda memahami kosakata, mengingatnya, menulis kalimat, lalu mengukur kemajuan melalui kurikulum CEFR yang terstruktur.</p><div className="mt-8 flex flex-wrap gap-3"><Link to="/register" className="inline-flex min-h-12 items-center rounded-lg bg-brand px-6 font-semibold text-white hover:bg-brand-hover">Mulai belajar gratis</Link><Link to="/login" className="inline-flex min-h-12 items-center rounded-lg border border-slate-300 px-6 font-semibold text-ink">Masuk ke akun</Link></div></div>
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-teal-50 p-6 shadow-sm md:p-8"><p className="text-sm font-semibold text-brand">Jalur belajar A1 · Pemula</p><h2 className="mt-3 text-2xl font-bold">Langkah kecil, hasil nyata</h2><ol className="mt-6 space-y-3">{['Perkenalan sehari-hari', 'Aktivitas harian', 'Keluarga dan hubungan'].map((item, index) => <li key={item} className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm"><span className="grid size-10 place-items-center rounded-full bg-blue-100 font-bold text-brand">{index + 1}</span><span className="font-medium">{item}</span></li>)}</ol></div>
    </section>
    <section id="tentang" className="py-10"><h2 className="text-2xl font-bold">Empat langkah untuk benar-benar menggunakan bahasa</h2><div className="mt-6 grid gap-4 md:grid-cols-4">{pillars.map(([number, title, description]) => <article key={number} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><span className="text-sm font-bold text-secondary">{number}</span><h3 className="mt-3 text-xl font-semibold">{title}</h3><p className="mt-2 text-slate-600">{description}</p></article>)}</div></section>
  </>
}
