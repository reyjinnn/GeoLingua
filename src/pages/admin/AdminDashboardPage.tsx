import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  adminApi,
  type AdminModuleItem,
  type CreateModuleInput,
  type CreateLessonInput,
  type CreateVocabularyInput,
  type CreateExerciseInput
} from '../../api/adminApi'
import { Button } from '../../components/common/Button'

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'modules' | 'lessons' | 'vocabularies' | 'drills'>('modules')
  
  // Data modul dari server
  const [modules, setModules] = useState<AdminModuleItem[]>([])
  const [loadingModules, setLoadingModules] = useState(true)
  const [createdModuleId, setCreatedModuleId] = useState<number | null>(null)

  // State Form Module
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

  // State Form Lesson
  const [lessonData, setLessonData] = useState<CreateLessonInput>({
    module_id: 1,
    lesson_name: '',
    lesson_objective: '',
    grammar_notes: '',
    order_index: 1
  })

  // State Form Vocabulary
  const [vocabData, setVocabData] = useState<CreateVocabularyInput>({
    lesson_id: 1,
    word: '',
    translation: '',
    pronunciation: '',
    part_of_speech: 'noun',
    definition: '',
    example_sentence: '',
    example_translation: ''
  })

  // State Form Drill
  const [drillData, setDrillData] = useState<CreateExerciseInput>({
    lesson_id: 1,
    vocabulary_id: 1,
    question_type: 'mcq_meaning',
    prompt: '',
    correct_answer: '',
    explanation: '',
    order_index: 1,
    options: [
      { text: '', is_correct: 1 },
      { text: '', is_correct: 0 },
      { text: '', is_correct: 0 }
    ]
  })
  
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function fetchModules() {
    adminApi.listModules()
      .then(res => setModules(res.modules))
      .catch(() => {})
      .finally(() => setLoadingModules(false))
  }

  useEffect(() => {
    fetchModules()
  }, [])

  async function handleModuleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      const result = await adminApi.createModule(formData)
      setSuccess(`Modul #${result.id} berhasil dibuat sebagai draft.`)
      setCreatedModuleId(result.id)
      fetchModules()
      setFormData(prev => ({
        ...prev,
        module_code: '',
        title: '',
        topic: '',
        description: '',
        learning_objectives: '',
        order_index: prev.order_index + 1
      }))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Gagal membuat modul.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleLessonSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      const result = await adminApi.createLesson(lessonData)
      setSuccess(`Pelajaran #${result.id} berhasil ditambahkan ke modul.`)
      fetchModules()
      setLessonData(prev => ({ ...prev, lesson_name: '', lesson_objective: '', grammar_notes: '', order_index: (prev.order_index ?? 1) + 1 }))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Gagal menambahkan pelajaran.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleVocabSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      const result = await adminApi.createVocabulary(vocabData)
      setSuccess(`Kosakata #${result.id} ("${vocabData.word}") berhasil disimpan.`)
      setVocabData(prev => ({
        ...prev,
        word: '',
        translation: '',
        pronunciation: '',
        definition: '',
        example_sentence: '',
        example_translation: ''
      }))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Gagal menyimpan kosakata.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDrillSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      const payload: CreateExerciseInput = {
        ...drillData,
        options: drillData.question_type === 'mcq_meaning' ? drillData.options : undefined
      }
      const result = await adminApi.createExercise(payload)
      setSuccess(`Latihan drill #${result.id} berhasil ditambahkan.`)
      setDrillData(prev => ({
        ...prev,
        prompt: '',
        correct_answer: '',
        explanation: '',
        order_index: (prev.order_index ?? 1) + 1
      }))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Gagal menyimpan latihan drill.')
    } finally {
      setSubmitting(false)
    }
  }

  const tabs = [
    { id: 'modules', label: 'Modul Kurikulum' },
    { id: 'lessons', label: 'Tambah Pelajaran' },
    { id: 'vocabularies', label: 'Tambah Kosakata' },
    { id: 'drills', label: 'Tambah Drill' }
  ] as const

  return (
    <section className="mx-auto max-w-5xl">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin CMS Kurikulum</h1>
          <p className="mt-1 text-slate-600">Kelola modul, pelajaran, kosakata, dan materi pembelajaran GeoLingua.</p>
        </div>
      </header>

      {/* Pesan Global */}
      {success && (
        <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-800 border border-green-200 flex justify-between items-center">
          <span>{success}</span>
          {createdModuleId && (
            <Link to={`/admin/modules/${createdModuleId}/edit`}>
              <Button className="bg-green-700 hover:bg-green-800 text-xs py-1 px-3">
                Buka Editor Modul #{createdModuleId} →
              </Button>
            </Link>
          )}
        </div>
      )}
      {error && <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800 border border-red-200">{error}</div>}

      {/* Tab Navigasi */}
      <div className="mb-6 flex border-b border-slate-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id)
              setError('')
              setSuccess('')
            }}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === tab.id ? 'border-b-2 border-brand text-brand' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Modules */}
      {activeTab === 'modules' && (
        <div className="space-y-8">
          {/* Daftar Modul yang Ada */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">Daftar Modul Kurikulum</h2>
            {loadingModules ? (
              <p className="text-sm text-slate-500">Memuat modul...</p>
            ) : modules.length === 0 ? (
              <p className="text-sm text-slate-500">Belum ada modul yang terdaftar.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 text-xs uppercase text-slate-500 bg-slate-50">
                    <tr>
                      <th className="p-3">Urutan</th>
                      <th className="p-3">Kode</th>
                      <th className="p-3">Judul Modul</th>
                      <th className="p-3">Topik</th>
                      <th className="p-3">Pelajaran</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {modules.map(m => (
                      <tr key={m.id} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-600">#{m.order_index}</td>
                        <td className="p-3 font-mono text-xs">{m.module_code}</td>
                        <td className="p-3 font-medium text-slate-900">{m.title}</td>
                        <td className="p-3 text-slate-600">{m.topic}</td>
                        <td className="p-3">{m.lesson_count} lesson</td>
                        <td className="p-3">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              m.status === 'published'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {m.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <Link to={`/admin/modules/${m.id}/edit`}>
                            <Button className="bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs py-1 px-3">
                              Editor & Publikasi
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Form Buat Modul Baru */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold">Buat Modul Baru (Draft)</h2>
            <form onSubmit={handleModuleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Course ID</label>
                <input
                  type="number"
                  required
                  value={formData.course_id}
                  onChange={e => setFormData({ ...formData, course_id: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Level ID</label>
                <input
                  type="number"
                  required
                  value={formData.level_id}
                  onChange={e => setFormData({ ...formData, level_id: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Kode Modul (Unik)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: EN-A1-M3"
                  value={formData.module_code}
                  onChange={e => setFormData({ ...formData, module_code: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Urutan (Order Index)</label>
                <input
                  type="number"
                  required
                  value={formData.order_index}
                  onChange={e => setFormData({ ...formData, order_index: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Judul Modul</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Keluarga dan Teman"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Topik</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Family & Friends"
                  value={formData.topic}
                  onChange={e => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Deskripsi Modul</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full resize-none rounded-lg border border-slate-300 p-3 outline-none focus:border-brand text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Tujuan Pembelajaran (Learning Objectives)</label>
                <textarea
                  required
                  rows={2}
                  value={formData.learning_objectives}
                  onChange={e => setFormData({ ...formData, learning_objectives: e.target.value })}
                  className="w-full resize-none rounded-lg border border-slate-300 p-3 outline-none focus:border-brand text-sm"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-3 mt-4">
                <Button disabled={submitting}>
                  {submitting ? 'Menyimpan...' : 'Simpan Modul Draft'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Lessons */}
      {activeTab === 'lessons' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold">Tambah Pelajaran (Lesson) Baru</h2>
          <form onSubmit={handleLessonSubmit} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Modul Induk</label>
              <select
                value={lessonData.module_id}
                onChange={e => setLessonData({ ...lessonData, module_id: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand text-sm"
              >
                {modules.map(m => (
                  <option key={m.id} value={m.id}>
                    #{m.order_index} {m.title} ({m.module_code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Urutan Pelajaran (Order Index)</label>
              <input
                type="number"
                required
                value={lessonData.order_index}
                onChange={e => setLessonData({ ...lessonData, order_index: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">Nama Pelajaran</label>
              <input
                type="text"
                required
                placeholder="Contoh: Anggota Keluarga Inti"
                value={lessonData.lesson_name}
                onChange={e => setLessonData({ ...lessonData, lesson_name: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">Tujuan Pelajaran</label>
              <textarea
                required
                rows={2}
                placeholder="Mampu menyebutkan anggota keluarga inti..."
                value={lessonData.lesson_objective}
                onChange={e => setLessonData({ ...lessonData, lesson_objective: e.target.value })}
                className="w-full resize-none rounded-lg border border-slate-300 p-3 outline-none focus:border-brand text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">Catatan Tata Bahasa (Grammar Notes)</label>
              <textarea
                rows={2}
                placeholder="Penggunaan possessive pronoun: my mother, his father..."
                value={lessonData.grammar_notes}
                onChange={e => setLessonData({ ...lessonData, grammar_notes: e.target.value })}
                className="w-full resize-none rounded-lg border border-slate-300 p-3 outline-none focus:border-brand text-sm"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-3 mt-4">
              <Button disabled={submitting}>
                {submitting ? 'Menyimpan...' : 'Simpan Pelajaran'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Vocabularies */}
      {activeTab === 'vocabularies' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold">Tambah Kosakata (Vocabulary) Baru</h2>
          <form onSubmit={handleVocabSubmit} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Kata Target (Bahasa Inggris)</label>
              <input
                type="text"
                required
                placeholder="Contoh: brother"
                value={vocabData.word}
                onChange={e => setVocabData({ ...vocabData, word: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Terjemahan (Bahasa Indonesia)</label>
              <input
                type="text"
                required
                placeholder="Contoh: saudara laki-laki"
                value={vocabData.translation}
                onChange={e => setVocabData({ ...vocabData, translation: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Pelafalan IPA</label>
              <input
                type="text"
                placeholder="Contoh: ˈbrʌðər"
                value={vocabData.pronunciation}
                onChange={e => setVocabData({ ...vocabData, pronunciation: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Kelas Kata (Part of Speech)</label>
              <select
                value={vocabData.part_of_speech}
                onChange={e => setVocabData({ ...vocabData, part_of_speech: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand text-sm"
              >
                <option value="noun">Noun (Kata Benda)</option>
                <option value="verb">Verb (Kata Kerja)</option>
                <option value="adjective">Adjective (Kata Sifat)</option>
                <option value="phrase">Phrase (Frasa)</option>
                <option value="interjection">Interjection (Kata Seru)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">Definisi</label>
              <input
                type="text"
                placeholder="Definisi ringkas kata..."
                value={vocabData.definition}
                onChange={e => setVocabData({ ...vocabData, definition: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand text-sm"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Contoh Kalimat (Target)</label>
              <input
                type="text"
                placeholder="Contoh: He is my older brother."
                value={vocabData.example_sentence}
                onChange={e => setVocabData({ ...vocabData, example_sentence: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Terjemahan Contoh</label>
              <input
                type="text"
                placeholder="Contoh: Dia adalah kakak laki-laki saya."
                value={vocabData.example_translation}
                onChange={e => setVocabData({ ...vocabData, example_translation: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand text-sm"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-3 mt-4">
              <Button disabled={submitting}>
                {submitting ? 'Menyimpan...' : 'Simpan Kosakata'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Drills */}
      {activeTab === 'drills' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold">Tambah Soal Drill Baru</h2>
          <form onSubmit={handleDrillSubmit} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Tipe Soal</label>
              <select
                value={drillData.question_type}
                onChange={e =>
                  setDrillData({
                    ...drillData,
                    question_type: e.target.value as 'mcq_meaning' | 'typing'
                  })
                }
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand text-sm"
              >
                <option value="mcq_meaning">Pilihan Ganda (MCQ)</option>
                <option value="typing">Mengetik (Typing)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">ID Kosakata Terkait</label>
              <input
                type="number"
                required
                value={drillData.vocabulary_id}
                onChange={e => setDrillData({ ...drillData, vocabulary_id: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">Pertanyaan (Prompt)</label>
              <input
                type="text"
                required
                placeholder="Contoh: Apa arti kata 'hello'?"
                value={drillData.prompt}
                onChange={e => setDrillData({ ...drillData, prompt: e.target.value })}
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">Jawaban Benar</label>
              <input
                type="text"
                required
                placeholder="Jawaban benar..."
                value={drillData.correct_answer}
                onChange={e => {
                  const val = e.target.value
                  setDrillData(prev => {
                    const opts = [...(prev.options || [])]
                    if (opts[0]) opts[0].text = val
                    return { ...prev, correct_answer: val, options: opts }
                  })
                }}
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-brand text-sm"
              />
            </div>

            {drillData.question_type === 'mcq_meaning' && (
              <div className="sm:col-span-2 space-y-3 rounded-lg bg-slate-50 p-4 border border-slate-200">
                <p className="font-semibold text-sm text-slate-800">Pilihan Opsi (Opsi 1 otomatis benar):</p>
                {drillData.options?.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500 w-16">
                      {opt.is_correct ? 'Benar ✓' : `Pengecoh ${idx}`}
                    </span>
                    <input
                      type="text"
                      required
                      placeholder={`Teks pilihan ${idx + 1}...`}
                      value={opt.text}
                      onChange={e => {
                        const val = e.target.value
                        setDrillData(prev => {
                          const updated = [...(prev.options || [])]
                          updated[idx] = { ...updated[idx], text: val }
                          return { ...prev, options: updated }
                        })
                      }}
                      className="flex-1 rounded-lg border border-slate-300 p-2.5 outline-none focus:border-brand text-sm bg-white"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium">Penjelasan (Explanation)</label>
              <textarea
                rows={2}
                placeholder="Penjelasan mengapa jawaban tersebut benar..."
                value={drillData.explanation}
                onChange={e => setDrillData({ ...drillData, explanation: e.target.value })}
                className="w-full resize-none rounded-lg border border-slate-300 p-3 outline-none focus:border-brand text-sm"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-3 mt-4">
              <Button disabled={submitting}>
                {submitting ? 'Menyimpan...' : 'Simpan Soal Drill'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </section>
  )
}
