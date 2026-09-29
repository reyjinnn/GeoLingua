import { useEffect, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  adminApi,
  type AdminModuleItem,
  type CreateModuleInput,
  type CreateLessonInput,
  type CreateVocabularyInput,
  type CreateExerciseInput,
} from '../../api/adminApi'

const defaultAdminModules: AdminModuleItem[] = [
  {
    id: 1,
    course_id: 1,
    level_id: 1,
    module_code: 'EN-A1-M1',
    title: 'Perkenalan sehari-hari',
    topic: 'Daily Introductions',
    status: 'published',
    order_index: 1,
    lesson_count: 3,
  },
  {
    id: 2,
    course_id: 1,
    level_id: 1,
    module_code: 'EN-A1-M2',
    title: 'Aktivitas harian',
    topic: 'Daily Activities',
    status: 'draft',
    order_index: 2,
    lesson_count: 3,
  },
]

const validTabs: Array<'modules' | 'lessons' | 'vocabularies' | 'drills'> = [
  'modules',
  'lessons',
  'vocabularies',
  'drills',
]

export function AdminCurriculumPage() {
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeTab: 'modules' | 'lessons' | 'vocabularies' | 'drills' =
    tabParam && validTabs.includes(tabParam as any) ? (tabParam as any) : 'modules'

  const [modules, setModules] = useState<AdminModuleItem[]>(defaultAdminModules)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  )

  // Module form state
  const [moduleForm, setModuleForm] = useState<CreateModuleInput>({
    course_id: 1,
    level_id: 1,
    module_code: 'EN-A1-M3',
    title: 'Arah dan Lokasi',
    topic: 'Directions & Places',
    description: 'Pelajari cara menanyakan arah dan mendeskripsikan lokasi di sekitar kota.',
    learning_objectives: 'Mampu menanyakan dan menunjukkan arah tempat umum.',
    order_index: 3,
    prerequisite_module_id: 1,
    status: 'draft',
  })

  // Lesson form state
  const [lessonForm, setLessonForm] = useState<CreateLessonInput>({
    module_id: 1,
    lesson_name: 'Kegiatan di Pagi Hari',
    lesson_objective: 'Mampu menyebutkan rutinitas pagi hari.',
    grammar_notes: 'Penggunaan Simple Present Tense untuk kebiasaan sehari-hari.',
    order_index: 1,
  })

  // Vocab form state
  const [vocabForm, setVocabForm] = useState<CreateVocabularyInput>({
    lesson_id: 1,
    word: 'wake up',
    translation: 'bangun tidur',
    pronunciation: '/weɪk ʌp/',
    part_of_speech: 'verb',
    definition: 'Berhenti tidur dan membuka mata.',
    example_sentence: 'I wake up at six in the morning.',
    example_translation: 'Saya bangun jam enam pagi.',
  })

  // Drill form state
  const [drillForm, setDrillForm] = useState<CreateExerciseInput>({
    lesson_id: 1,
    vocabulary_id: 1,
    question_type: 'mcq_meaning',
    prompt: 'Apa arti dari “wake up”?',
    correct_answer: 'bangun tidur',
    explanation: 'Wake up berarti bangun dari tidur di pagi hari.',
    order_index: 1,
    options: [
      { text: 'bangun tidur', is_correct: 1 },
      { text: 'tidur malam', is_correct: 0 },
      { text: 'makan siang', is_correct: 0 },
    ],
  })

  function fetchModules() {
    adminApi
      .listModules()
      .then((res) => {
        if (res && res.modules && res.modules.length > 0) {
          setModules(res.modules)
        }
      })
      .catch(() => {
        // Fallback default modules
      })
  }

  useEffect(() => {
    fetchModules()
  }, [])

  async function handleModuleSubmit(e: FormEvent) {
    e.preventDefault()
    setNotification(null)
    try {
      const res = await adminApi.createModule(moduleForm)
      setNotification({
        type: 'success',
        message: `Modul #${res.id} (${moduleForm.module_code}) berhasil dibuat sebagai draft.`,
      })
      fetchModules()
    } catch (cause) {
      setNotification({
        type: 'error',
        message: cause instanceof Error ? cause.message : 'Gagal membuat modul.',
      })
    }
  }

  async function handleLessonSubmit(e: FormEvent) {
    e.preventDefault()
    setNotification(null)
    try {
      const res = await adminApi.createLesson(lessonForm)
      setNotification({
        type: 'success',
        message: `Pelajaran #${res.id} (${lessonForm.lesson_name}) berhasil disimpan.`,
      })
    } catch (cause) {
      setNotification({
        type: 'error',
        message: cause instanceof Error ? cause.message : 'Gagal membuat pelajaran.',
      })
    }
  }

  async function handleVocabSubmit(e: FormEvent) {
    e.preventDefault()
    setNotification(null)
    try {
      const res = await adminApi.createVocabulary(vocabForm)
      setNotification({
        type: 'success',
        message: `Kosakata #${res.id} (${vocabForm.word}) berhasil disimpan.`,
      })
    } catch (cause) {
      setNotification({
        type: 'error',
        message: cause instanceof Error ? cause.message : 'Gagal membuat kosakata.',
      })
    }
  }

  async function handleDrillSubmit(e: FormEvent) {
    e.preventDefault()
    setNotification(null)
    try {
      const res = await adminApi.createExercise(drillForm)
      setNotification({
        type: 'success',
        message: `Soal drill #${res.id} berhasil disimpan.`,
      })
    } catch (cause) {
      setNotification({
        type: 'error',
        message: cause instanceof Error ? cause.message : 'Gagal membuat soal drill.',
      })
    }
  }

  return (
    <section className="wrap-lg">
      {/* Admin Hero Banner */}
      <div className="admin-hero">
        <div className="flex-wrap" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="tag-code dark">GEO / CMS</span>
          <span className="tag-code dark" style={{ textTransform: 'uppercase' }}>
            SEKSI: {activeTab === 'modules' ? 'Modul' : activeTab === 'lessons' ? 'Pelajaran' : activeTab === 'vocabularies' ? 'Kosakata' : 'Soal Drill'}
          </span>
        </div>
        <h1 className="mt5" style={{ color: '#fff', fontSize: '36px' }}>
          {activeTab === 'modules' && 'Kurikulum · Daftar & Buat Modul'}
          {activeTab === 'lessons' && 'Kurikulum · Tambah Pelajaran'}
          {activeTab === 'vocabularies' && 'Kurikulum · Kosakata Baru'}
          {activeTab === 'drills' && 'Kurikulum · Bank Soal Active Recall'}
        </h1>
        <p className="mt2" style={{ color: '#c4cfdf', maxWidth: '700px' }}>
          Kelola materi kurikulum secara langsung dari menu di sidebar kiri atau tab di bawah ini.
        </p>

        {/* Quick In-Page Tab Navigation */}
        <div className="admin-page-tabs mt6">
          <Link
            to="/admin/modules?tab=modules"
            className={`admin-page-tab-btn ${activeTab === 'modules' ? 'active' : ''}`}
          >
            Modul
          </Link>
          <Link
            to="/admin/modules?tab=lessons"
            className={`admin-page-tab-btn ${activeTab === 'lessons' ? 'active' : ''}`}
          >
            Pelajaran
          </Link>
          <Link
            to="/admin/modules?tab=vocabularies"
            className={`admin-page-tab-btn ${activeTab === 'vocabularies' ? 'active' : ''}`}
          >
            Kosakata
          </Link>
          <Link
            to="/admin/modules?tab=drills"
            className={`admin-page-tab-btn ${activeTab === 'drills' ? 'active' : ''}`}
          >
            Bank Soal Drill
          </Link>
        </div>
      </div>

      {notification && (
        <div
          className="mt6 mb6 p-4 rounded-lg"
          style={{
            background: notification.type === 'success' ? '#effaf7' : '#fff3f3',
            border: `1px solid ${notification.type === 'success' ? '#c3ebe3' : '#fecaca'}`,
            color: notification.type === 'success' ? '#137d72' : '#c24141',
          }}
        >
          {notification.message}
        </div>
      )}

      {/* Tab: Modules */}
      {activeTab === 'modules' && (
        <div className="space mt6">
          <div className="card card-xl">
            <div className="row">
              <div>
                <div className="section-index">Published map</div>
                <h3>Daftar modul kurikulum</h3>
              </div>
              <span className="tag-code">
                {String(modules.length).padStart(2, '0')} RECORD{modules.length > 1 ? 'S' : ''}
              </span>
            </div>

            <div className="table-wrap mt5">
              <table>
                <thead>
                  <tr>
                    <th>Kode</th>
                    <th>Judul Modul</th>
                    <th>Level</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map((m) => (
                    <tr key={m.id}>
                      <td>
                        <span className="tag-code">{m.module_code}</span>
                      </td>
                      <td className="semi">{m.title}</td>
                      <td>A1</td>
                      <td>
                        <span
                          className={`badge ${
                            m.status === 'published' ? 'badge-green' : 'badge-amber'
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td>
                        <Link className="link" to={`/admin/modules/${m.id}/edit`}>
                          Edit →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card card-xl">
            <div className="section-index">New record</div>
            <h3>Buat modul baru</h3>
            <form onSubmit={handleModuleSubmit} className="grid2 mt6">
              <label className="field">
                Course ID
                <input
                  className="input"
                  type="number"
                  value={moduleForm.course_id}
                  onChange={(e) =>
                    setModuleForm({ ...moduleForm, course_id: Number(e.target.value) })
                  }
                  required
                />
              </label>
              <label className="field">
                Level ID
                <input
                  className="input"
                  type="number"
                  value={moduleForm.level_id}
                  onChange={(e) =>
                    setModuleForm({ ...moduleForm, level_id: Number(e.target.value) })
                  }
                  required
                />
              </label>
              <label className="field">
                Kode Modul (Unik)
                <input
                  className="input"
                  placeholder="Contoh: EN-A1-M3"
                  value={moduleForm.module_code}
                  onChange={(e) => setModuleForm({ ...moduleForm, module_code: e.target.value })}
                  required
                />
              </label>
              <label className="field">
                Urutan (Order Index)
                <input
                  className="input"
                  type="number"
                  value={moduleForm.order_index}
                  onChange={(e) =>
                    setModuleForm({ ...moduleForm, order_index: Number(e.target.value) })
                  }
                  required
                />
              </label>
              <label className="field">
                Judul Modul
                <input
                  className="input"
                  placeholder="Contoh: Keluarga dan Teman"
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                  required
                />
              </label>
              <label className="field">
                Topik
                <input
                  className="input"
                  placeholder="Contoh: Family & Friends"
                  value={moduleForm.topic}
                  onChange={(e) => setModuleForm({ ...moduleForm, topic: e.target.value })}
                  required
                />
              </label>
              <label className="field" style={{ gridColumn: '1/-1' }}>
                Deskripsi Modul
                <textarea
                  className="textarea"
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                  required
                ></textarea>
              </label>
              <label className="field" style={{ gridColumn: '1/-1' }}>
                Tujuan Pembelajaran
                <textarea
                  className="textarea"
                  value={moduleForm.learning_objectives}
                  onChange={(e) =>
                    setModuleForm({ ...moduleForm, learning_objectives: e.target.value })
                  }
                  required
                ></textarea>
              </label>
              <div style={{ gridColumn: '1/-1', textAlign: 'right' }}>
                <button type="submit" className="btn">
                  Simpan Modul
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Lessons */}
      {activeTab === 'lessons' && (
        <div className="card card-xl mt6">
          <div className="section-index">Lesson builder</div>
          <h3>Tambah pelajaran baru</h3>
          <p className="small muted mt2">
            Susun satu titik pembelajaran yang nantinya menjadi bagian dari route modul.
          </p>
          <form onSubmit={handleLessonSubmit} className="grid2 mt6">
            <label className="field">
              Modul Induk
              <input
                className="input"
                type="number"
                value={lessonForm.module_id}
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, module_id: Number(e.target.value) })
                }
                required
              />
            </label>
            <label className="field">
              Urutan Pelajaran (Order Index)
              <input
                className="input"
                type="number"
                value={lessonForm.order_index}
                onChange={(e) =>
                  setLessonForm({ ...lessonForm, order_index: Number(e.target.value) })
                }
                required
              />
            </label>
            <label className="field" style={{ gridColumn: '1/-1' }}>
              Nama Pelajaran
              <input
                className="input"
                placeholder="Contoh: Anggota Keluarga Inti"
                value={lessonForm.lesson_name}
                onChange={(e) => setLessonForm({ ...lessonForm, lesson_name: e.target.value })}
                required
              />
            </label>

            <div className="card-soft" style={{ gridColumn: '1/-1' }}>
              <span className="tag-code">CONTENT CHECK</span>
              <p className="small muted mt3">
                Pelajaran sebaiknya memiliki tujuan, catatan grammar, kosakata, dan latihan yang
                jelas.
              </p>
            </div>

            <label className="field" style={{ gridColumn: '1/-1' }}>
              Tujuan Pelajaran
              <textarea
                className="textarea"
                placeholder="Mampu menyebutkan anggota keluarga inti..."
                value={lessonForm.lesson_objective}
                onChange={(e) => setLessonForm({ ...lessonForm, lesson_objective: e.target.value })}
                required
              ></textarea>
            </label>
            <label className="field" style={{ gridColumn: '1/-1' }}>
              Catatan Tata Bahasa
              <textarea
                className="textarea"
                placeholder="Penggunaan possessive pronoun..."
                value={lessonForm.grammar_notes}
                onChange={(e) => setLessonForm({ ...lessonForm, grammar_notes: e.target.value })}
              ></textarea>
            </label>
            <div style={{ gridColumn: '1/-1', textAlign: 'right' }}>
              <button type="submit" className="btn">
                Simpan Pelajaran
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Vocabularies */}
      {activeTab === 'vocabularies' && (
        <div className="card card-xl mt6">
          <div className="section-index">Language specimen</div>
          <h3>Tambah kosakata baru</h3>
          <p className="small muted mt2">
            Data ini akan muncul sebagai language specimen di lesson.
          </p>
          <form onSubmit={handleVocabSubmit} className="grid2 mt6">
            <label className="field">
              Kata Target (Bahasa Inggris)
              <input
                className="input"
                placeholder="Contoh: brother"
                value={vocabForm.word}
                onChange={(e) => setVocabForm({ ...vocabForm, word: e.target.value })}
                required
              />
            </label>
            <label className="field">
              Terjemahan (Bahasa Indonesia)
              <input
                className="input"
                placeholder="Contoh: saudara laki-laki"
                value={vocabForm.translation}
                onChange={(e) => setVocabForm({ ...vocabForm, translation: e.target.value })}
                required
              />
            </label>
            <label className="field">
              Pelafalan IPA
              <input
                className="input"
                placeholder="Contoh: ˈbrʌðər"
                value={vocabForm.pronunciation}
                onChange={(e) => setVocabForm({ ...vocabForm, pronunciation: e.target.value })}
              />
            </label>
            <label className="field">
              Kelas Kata
              <select
                className="select"
                value={vocabForm.part_of_speech}
                onChange={(e) => setVocabForm({ ...vocabForm, part_of_speech: e.target.value })}
              >
                <option value="noun">Noun</option>
                <option value="verb">Verb</option>
                <option value="adjective">Adjective</option>
                <option value="phrase">Phrase</option>
                <option value="interjection">Interjection</option>
              </select>
            </label>
            <label className="field" style={{ gridColumn: '1/-1' }}>
              Definisi
              <input
                className="input"
                placeholder="Definisi ringkas kata..."
                value={vocabForm.definition}
                onChange={(e) => setVocabForm({ ...vocabForm, definition: e.target.value })}
              />
            </label>
            <label className="field">
              Contoh Kalimat (Target)
              <input
                className="input"
                placeholder="He is my older brother."
                value={vocabForm.example_sentence}
                onChange={(e) => setVocabForm({ ...vocabForm, example_sentence: e.target.value })}
              />
            </label>
            <label className="field">
              Terjemahan Contoh
              <input
                className="input"
                placeholder="Dia adalah kakak laki-laki saya."
                value={vocabForm.example_translation}
                onChange={(e) =>
                  setVocabForm({ ...vocabForm, example_translation: e.target.value })
                }
              />
            </label>
            <div style={{ gridColumn: '1/-1', textAlign: 'right' }}>
              <button type="submit" className="btn">
                Simpan Kosakata
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Drills */}
      {activeTab === 'drills' && (
        <div className="card card-xl mt6">
          <div className="section-index">Active recall</div>
          <h3>Tambah soal drill baru</h3>
          <p className="small muted mt2">
            Tulis prompt, jawaban, pengecoh, dan explanation sebelum soal masuk ke route belajar.
          </p>
          <form onSubmit={handleDrillSubmit} className="grid2 mt6">
            <label className="field">
              Tipe Soal
              <select
                className="select"
                value={drillForm.question_type}
                onChange={(e) =>
                  setDrillForm({
                    ...drillForm,
                    question_type: e.target.value as 'mcq_meaning' | 'typing',
                  })
                }
              >
                <option value="mcq_meaning">Pilihan Ganda (MCQ)</option>
                <option value="typing">Mengetik (Typing)</option>
              </select>
            </label>
            <label className="field">
              ID Kosakata Terkait
              <input
                className="input"
                type="number"
                value={drillForm.vocabulary_id}
                onChange={(e) =>
                  setDrillForm({ ...drillForm, vocabulary_id: Number(e.target.value) })
                }
              />
            </label>
            <label className="field" style={{ gridColumn: '1/-1' }}>
              Pertanyaan (Prompt)
              <input
                className="input"
                placeholder="Contoh: Apa arti kata 'hello'?"
                value={drillForm.prompt}
                onChange={(e) => setDrillForm({ ...drillForm, prompt: e.target.value })}
                required
              />
            </label>
            <label className="field" style={{ gridColumn: '1/-1' }}>
              Jawaban Benar
              <input
                className="input"
                placeholder="Jawaban benar..."
                value={drillForm.correct_answer}
                onChange={(e) => {
                  const correct = e.target.value
                  setDrillForm((prev) => ({
                    ...prev,
                    correct_answer: correct,
                    options: prev.options
                      ? prev.options.map((opt, idx) =>
                          idx === 0 ? { ...opt, text: correct } : opt
                        )
                      : undefined,
                  }))
                }}
                required
              />
            </label>

            {drillForm.question_type === 'mcq_meaning' && drillForm.options && (
              <div className="card-soft" style={{ gridColumn: '1/-1' }}>
                <span className="tag-code">ANSWER MAP</span>
                <div className="field-stack mt4">
                  {drillForm.options.map((opt, i) => (
                    <label key={i} className="field">
                      {i === 0 ? 'Benar ✓' : `Pengecoh ${i}`}
                      <input
                        className="input"
                        placeholder={`Teks pilihan ${i + 1}...`}
                        value={opt.text}
                        onChange={(e) => {
                          const val = e.target.value
                          setDrillForm((prev) => ({
                            ...prev,
                            options: prev.options?.map((o, idx) =>
                              idx === i ? { ...o, text: val } : o
                            ),
                          }))
                        }}
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            <label className="field" style={{ gridColumn: '1/-1' }}>
              Penjelasan (Explanation)
              <textarea
                className="textarea"
                placeholder="Penjelasan konteks jawaban..."
                value={drillForm.explanation}
                onChange={(e) => setDrillForm({ ...drillForm, explanation: e.target.value })}
              ></textarea>
            </label>
            <div style={{ gridColumn: '1/-1', textAlign: 'right' }}>
              <button type="submit" className="btn">
                Simpan Soal Drill
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  )
}
