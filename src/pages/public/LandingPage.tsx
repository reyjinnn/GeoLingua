import { useState } from 'react'
import { Link } from 'react-router-dom'

const goalsData = {
  daily: {
    title: 'Berani mulai bicara.',
    copy: 'Kenali sapaan, perkenalkan diri, dan bangun percakapan sederhana dari keseharianmu.',
  },
  work: {
    title: 'Mulai koneksi profesional.',
    copy: 'Bangun fondasi bahasa Inggris untuk memperkenalkan diri dan menyapa rekan baru. Mulai dari materi dasar A1.',
  },
  travel: {
    title: 'Sapaan membuka perjalanan.',
    copy: 'Awali pertemuan baru dengan sapaan dan perkenalan sederhana. Bangun fondasinya lewat materi dasar A1.',
  },
}

export function LandingPage() {
  const [activeGoal, setActiveGoal] = useState<'daily' | 'work' | 'travel'>('daily')
  const [trySelection, setTrySelection] = useState<'wrong' | 'correct' | null>(null)
  const [tryFeedback, setTryFeedback] = useState('Pilih satu jawaban di atas. Setiap percobaan adalah bagian dari belajar.')

  function handleTryOption(choice: 'wrong' | 'correct') {
    setTrySelection(choice)
    if (choice === 'correct') {
      setTryFeedback('Tepat sekali! Good morning berarti selamat pagi. Gunakan saat menyapa seseorang pada pagi hari.')
    } else {
      setTryFeedback('Belum tepat. Ingat, morning berarti pagi. Coba pilih sapaan yang sesuai.')
    }
  }

  function handleResetTry() {
    setTrySelection(null)
    setTryFeedback('Pilih satu jawaban di atas. Setiap percobaan adalah bagian dari belajar.')
  }

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Hero Home */}
      <section className="hero-home">
        <div className="hero-copy">
          <h1>
            Satu bahasa baru.
            <br />
            Dunia yang
            <br />
            <em>lebih luas.</em>
          </h1>
          <p className="intro">
            Dari “hello” pertama hingga percakapan penuh percaya diri. Bangun kemampuan
            bahasamu, satu langkah kecil setiap hari.
          </p>
          <div className="hero-actions">
            <Link className="btn" to="/register">
              Mulai perjalananmu <span aria-hidden="true">↗</span>
            </Link>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => scrollToSection('coba')}
            >
              Coba latihan <span aria-hidden="true">▷</span>
            </button>
          </div>
          <div className="micro-benefits">
            <span>Gratis untuk belajar</span>
            <span>Sesuai levelmu</span>
            <span>Fleksibel, kapan saja</span>
          </div>
        </div>

        <div
          className="world-stage"
          role="img"
          aria-label="Ilustrasi dunia hijau dengan sapaan Hello, world dan Halo, dunia, menggambarkan bahasa yang menghubungkan kita."
        >
          <div className="world-arch">
            <div className="world-label">A LITTLE PRACTICE. A BIGGER WORLD.</div>
            <svg className="world-svg" viewBox="0 0 460 460" aria-hidden="true">
              <defs>
                <clipPath id="globe-clip">
                  <circle cx="235" cy="259" r="129" />
                </clipPath>
              </defs>
              <path
                d="M48 240C39 124 354 70 399 174S344 412 89 359"
                fill="none"
                stroke="#9eaf88"
                strokeDasharray="5 7"
              />
              <path
                d="M78 116l27-10-11 27-4-13z"
                fill="#caa64e"
                transform="rotate(14 90 119)"
              />
              <circle cx="235" cy="259" r="129" fill="#26735b" />
              <g clipPath="url(#globe-clip)">
                <path
                  d="M103 197l34-39 33 2 5 22 31 10 16 32-11 22-27 2-5 29-26 5-7-31-26-13-14-24zM178 286l26-20 29 14 10 37-23 26-10 36-22-18 3-29-20-17zM260 129l49 15 19 33-21 19-9 24-33 4-10-24-23-9 8-21zM279 236l40-22 33 11 10 28 33 10 12 29-33 13-17-16-23 5-19-31-23 2zM297 329l26-7 22 21-3 17-27 8-24-19z"
                  fill="#bcd29c"
                />
                <g fill="none" stroke="#d7e9bc" strokeOpacity=".2">
                  <ellipse cx="235" cy="259" rx="57" ry="129" />
                  <ellipse cx="235" cy="259" rx="103" ry="129" />
                  <ellipse cx="235" cy="259" rx="129" ry="46" />
                  <path d="M106 259h258M128 187h214M128 331h214M235 130v258" />
                </g>
              </g>
              <circle cx="235" cy="259" r="129" fill="none" stroke="#174e3e" strokeWidth="2" />
              <path
                d="M161 294Q210 197 296 228"
                fill="none"
                stroke="#fff6d4"
                strokeWidth="2"
                strokeDasharray="5 6"
              />
              <circle cx="162" cy="294" r="6" fill="#f4ce70" stroke="#fff3cc" strokeWidth="3" />
              <circle cx="296" cy="228" r="6" fill="#f4ce70" stroke="#fff3cc" strokeWidth="3" />
              <path
                d="M379 109v22m-11-11h22M81 298v16m-8-8h16"
                stroke="#90a375"
                strokeWidth="1.5"
              />
              <circle cx="336" cy="86" r="4" fill="#d5b05b" />
              <circle cx="67" cy="206" r="3" fill="#7b9568" />
            </svg>
          </div>
          <div className="hello-card">
            <small>YOUR FIRST WORDS</small>
            <strong>Hello, world.</strong>
          </div>
          <div className="hello-translation">Halo, dunia.</div>
          <div className="lesson-ticket">
            <span className="ticket-icon">Aa</span>
            <div>
              <small>LANGKAH KECIL PERTAMAMU</small>
              <strong>Mulai dari sebuah sapaan</strong>
              <p>English A1 · Salam dan perkenalan</p>
            </div>
            <span className="ticket-arrow">↗</span>
          </div>
        </div>
      </section>

      {/* Value Ribbon */}
      <section className="value-ribbon" aria-label="Keunggulan pembelajaran">
        <p>
          Ruang untuk tumbuh,
          <br />
          dengan caramu.
        </p>
        <div className="value-item">
          <span className="v-icon">◎</span>
          <div>
            <strong>Jalur yang terarah</strong>
            <small>Materi bertahap sesuai level</small>
          </div>
        </div>
        <div className="value-item">
          <span className="v-icon">↗</span>
          <div>
            <strong>Belajar dengan praktik</strong>
            <small>Kenali, latih, lalu gunakan</small>
          </div>
        </div>
        <div className="value-item">
          <span className="v-icon">◷</span>
          <div>
            <strong>Ritme milikmu</strong>
            <small>Mulai kecil, lanjutkan konsisten</small>
          </div>
        </div>
      </section>

      {/* Program Section */}
      <section id="program" className="home-section">
        <div className="section-heading">
          <div>
            <div className="section-label">TEMUKAN TITIK AWALMU</div>
            <h2>
              Tujuanmu berbeda.
              <br />
              Langkah awalmu juga.
            </h2>
          </div>
          <p>
            Mulai dari hal yang ingin kamu lakukan. Kami bantu hubungkan dengan materi yang
            relevan.
          </p>
        </div>

        <div className="goal-tabs" role="group" aria-label="Tujuan belajar">
          <button
            type="button"
            className="goal-tab"
            aria-pressed={activeGoal === 'daily'}
            onClick={() => setActiveGoal('daily')}
          >
            Percakapan sehari-hari
          </button>
          <button
            type="button"
            className="goal-tab"
            aria-pressed={activeGoal === 'work'}
            onClick={() => setActiveGoal('work')}
          >
            Dunia kerja
          </button>
          <button
            type="button"
            className="goal-tab"
            aria-pressed={activeGoal === 'travel'}
            onClick={() => setActiveGoal('travel')}
          >
            Jelajah dunia
          </button>
        </div>

        <div className="course-grid">
          <article className="course-feature">
            <div className="course-content">
              <span className="tag-warm">ENGLISH · A1 PEMULA</span>
              <h3 id="goal-title">{goalsData[activeGoal].title}</h3>
              <p id="goal-copy">{goalsData[activeGoal].copy}</p>
              <div className="course-meta">
                <span>Pengantar Indonesia</span>
                <span>Belajar mandiri</span>
              </div>
              <Link className="simple-link" to="/modules/1">
                Jelajahi materi <span>↗</span>
              </Link>
            </div>
            <div className="course-art" aria-hidden="true">
              <span>Aa</span>
            </div>
          </article>

          <article className="course-secondary">
            <span className="tag-warm">JALUR PERSONAL</span>
            <h3>
              Baru mulai?
              <br />
              Kamu ada di tempat yang tepat.
            </h3>
            <p>
              Pilih bahasa pengantar dan level awalmu. Tidak perlu terburu-buru; satu pelajaran
              dulu sudah berarti.
            </p>
            <div className="mt6">
              <Link className="simple-link" to="/onboarding">
                Temukan jalur belajarmu <span>↗</span>
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* Metode Section */}
      <section id="metode" className="method-section home-section">
        <div className="section-heading">
          <div>
            <div className="section-label">CARA BELAJAR GEOLINGUA</div>
            <h2>
              Bukan sekadar tahu artinya.
              <br />
              Terbiasa menggunakannya.
            </h2>
          </div>
          <p>
            Satu alur yang saling terhubung. Dari mengenal kata hingga merangkainya menjadi
            kalimatmu sendiri.
          </p>
        </div>
        <div className="method-grid">
          {[
            ['01', 'Kenali dalam konteks', 'Pelajari arti, pelafalan, dan contoh kalimat. Setiap kata punya cerita.'],
            ['02', 'Latih ingatanmu', 'Coba pilihan ganda dan latihan mengetik, lalu lihat umpan baliknya.'],
            ['03', 'Buat kalimatmu', 'Gunakan kata yang baru dipelajari dalam latihan menulis singkat.'],
            ['04', 'Lihat kemajuanmu', 'Uji pemahaman lewat kuis, tinjau hasilnya, lalu lanjutkan langkahmu.'],
          ].map(([n, t, d]) => (
            <article key={n} className="method-item">
              <span className="method-number">{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </article>
          ))}
        </div>
        <div className="method-foot">
          <span>Pelajaran → Latihan → Menulis → Kuis</span>
          <Link to="/lessons/1">Lihat satu pelajaran utuh ↗</Link>
        </div>
      </section>

      {/* Try Section */}
      <section id="coba" className="home-section try-grid">
        <div className="try-copy">
          <div className="section-label">RASAKAN LANGKAH PERTAMANYA</div>
          <h2>
            Ternyata, kamu bisa
            <br />
            mulai dari sekarang.
          </h2>
          <p>
            Tidak perlu menunggu siap. Coba satu pertanyaan sederhana dan lihat bagaimana kamu
            belajar di GeoLingua.
          </p>
          <ul className="try-points">
            <li>
              <b>1</b>Pertanyaan singkat dengan konteks yang jelas
            </li>
            <li>
              <b>2</b>Umpan balik langsung setelah menjawab
            </li>
            <li>
              <b>3</b>Ruang untuk mencoba lagi, tanpa tekanan
            </li>
          </ul>
        </div>

        <div className="try-card">
          <div className="try-card-head">
            <b>LATIHAN MINI</b>
            <span>English · A1</span>
          </div>
          <span className="section-label">SALAM DAN SAPAAN</span>
          <h3>Apa arti “Good morning”?</h3>
          <div className="try-options">
            <button
              type="button"
              className={`try-option ${trySelection === 'wrong' ? 'incorrect' : ''}`}
              onClick={() => handleTryOption('wrong')}
            >
              <span>A</span>Selamat malam
            </button>
            <button
              type="button"
              className={`try-option ${trySelection === 'correct' ? 'correct' : ''}`}
              onClick={() => handleTryOption('correct')}
            >
              <span>B</span>Selamat pagi
            </button>
            <button
              type="button"
              className={`try-option ${trySelection === 'wrong' ? 'incorrect' : ''}`}
              onClick={() => handleTryOption('wrong')}
            >
              <span>C</span>Sampai jumpa
            </button>
          </div>
          <div className="try-feedback" id="try-feedback" aria-live="polite">
            {trySelection === 'correct' ? (
              <strong>{tryFeedback}</strong>
            ) : (
              tryFeedback
            )}
          </div>
          <div className="try-bottom">
            <button type="button" className="try-reset" onClick={handleResetTry}>
              Ulangi latihan
            </button>
            <Link className="simple-link" to="/lessons/1/drill">
              Latihan lainnya ↗
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="home-section faq-section">
        <div>
          <div className="section-label">SEBELUM MELANGKAH</div>
          <h2>Masih penasaran?</h2>
          <p>Kenali cara belajar yang akan kamu jalani.</p>
        </div>
        <div className="faq-list">
          <details open>
            <summary>Apakah cocok untuk pemula?</summary>
            <p>
              Ya. Mulai dari level A1 untuk mengenal sapaan, kosakata sehari-hari, dan kalimat
              sederhana. Kamu bisa mengulang materi sesuai kebutuhan.
            </p>
          </details>
          <details>
            <summary>Bagaimana cara belajarnya?</summary>
            <p>
              Kamu belajar mandiri melalui materi kosakata, contoh kalimat, latihan mengingat,
              menulis, dan kuis akhir modul. Setiap tahap membantu kamu memakai materi sebelumnya.
            </p>
          </details>
          <details>
            <summary>Harus belajar berapa lama setiap hari?</summary>
            <p>
              Tidak ada waktu wajib. Mulai dari satu pelajaran singkat, lalu sesuaikan dengan
              jadwalmu. Konsistensi lebih penting daripada menyelesaikan banyak materi sekaligus.
            </p>
          </details>
          <details>
            <summary>Bisakah saya mencoba sebelum mendaftar?</summary>
            <p>
              Bisa. Coba latihan mini di halaman ini atau buka contoh pelajaran. Pada aplikasi ini,
              akun dan progres dapat dicoba langsung untuk merasakan alur belajar.
            </p>
          </details>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="closing-cta">
        <div className="section-label">DUNIA YANG LEBIH LUAS MENANTIMU</div>
        <h2>
          Perjalanan besar.
          <br />
          Dimulai dari satu “hello”.
        </h2>
        <p>Ambil langkah kecilmu hari ini. Belajar dengan caramu, bersama GeoLingua.</p>
        <Link className="btn" to="/register">
          Yuk, mulai belajar <span>↗</span>
        </Link>
      </section>
    </>
  )
}
