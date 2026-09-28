import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { curriculumApi } from '../../api/curriculumApi'
import { learningApi } from '../../api/learningApi'
import type { LessonDetail } from '../../types/curriculum.types'
import type { VocabularyItem } from '../../types/learning.types'

const defaultLessonData: LessonDetail = {
  id: 1,
  module_id: 1,
  lesson_name: 'Salam dan sapaan',
  lesson_objective:
    'Mengenali sapaan dan memperkenalkan diri dalam bahasa Inggris. Perhatikan bentuk, bunyi, dan contoh penggunaannya—bukan hanya terjemahannya.',
  grammar_notes:
    'Gunakan struktur “My name is …” untuk memperkenalkan diri. Hello dan Good morning menjadi pembuka percakapan.',
  order_index: 1,
}

const defaultVocab: VocabularyItem[] = [
  {
    id: 1,
    difficulty: 'A1',
    word: 'hello',
    translation: 'halo',
    pronunciation: '/həˈləʊ/',
    part_of_speech: 'interjection',
    definition: 'Sapaan saat bertemu seseorang.',
    example_sentence: 'Hello, my name is Ana.',
    example_translation: 'Halo, nama saya Ana.',
  },
  {
    id: 2,
    difficulty: 'A1',
    word: 'name',
    translation: 'nama',
    pronunciation: '/neɪm/',
    part_of_speech: 'noun',
    definition: 'Kata untuk menyebut identitas seseorang.',
    example_sentence: 'My name is Raihan.',
    example_translation: 'Nama saya Raihan.',
  },
  {
    id: 3,
    difficulty: 'A1',
    word: 'good morning',
    translation: 'selamat pagi',
    pronunciation: '/ɡʊd ˈmɔːrnɪŋ/',
    part_of_speech: 'phrase',
    definition: 'Sapaan pada pagi hari.',
    example_sentence: 'Good morning, everyone.',
    example_translation: 'Selamat pagi, semuanya.',
  },
  {
    id: 4,
    difficulty: 'A1',
    word: 'friend',
    translation: 'teman',
    pronunciation: '/frend/',
    part_of_speech: 'noun',
    definition: 'Orang yang dikenal dan disukai.',
    example_sentence: 'She is my friend.',
    example_translation: 'Dia adalah teman saya.',
  },
]

export function LessonPage() {
  const { id } = useParams()
  const lessonId = id || '1'
  const [lesson, setLesson] = useState<LessonDetail>(defaultLessonData)
  const [words, setWords] = useState<VocabularyItem[]>(defaultVocab)

  useEffect(() => {
    let active = true
    Promise.all([curriculumApi.lesson(lessonId), learningApi.vocabulary(lessonId)])
      .then(([lessonData, wordsData]) => {
        if (!active) return
        if (lessonData) setLesson(lessonData)
        if (wordsData && wordsData.length > 0) setWords(wordsData)
      })
      .catch(() => {
        // Use default mock data
      })
    return () => {
      active = false
    }
  }, [lessonId])

  return (
    <section className="learning-shell wrap-lg">
      {/* Sticky Left Rail */}
      <aside className="learning-rail">
        <div className="rail-label">lesson</div>
        <div className="rail-number">{String(lesson.order_index || 1).padStart(2, '0')}</div>
        <div className="rail-rule"></div>
        <div className="tiny gray">EN-A1</div>
        <div className="tiny gray mt2">Materi singkat</div>
      </aside>

      {/* Main Lesson Content */}
      <article>
        <div className="row">
          <Link className="link" to={`/modules/${lesson.module_id || 1}`}>
            ← Kembali ke modul
          </Link>
          <span className="tag-code">
            FIELD NOTE / 0{lesson.order_index || 1}
          </span>
        </div>

        <div className="mt8">
          <div className="brand-kicker">{lesson.lesson_name}</div>
          <h1 className="mt3">Bahasa dimulai dari pertemuan pertama.</h1>
          <p className="mt3 muted" style={{ maxWidth: '720px' }}>
            {lesson.lesson_objective ||
              'Mengenali sapaan dan memperkenalkan diri dalam bahasa Inggris. Perhatikan bentuk, bunyi, dan contoh penggunaannya—bukan hanya terjemahannya.'}
          </p>
        </div>

        {lesson.grammar_notes && (
          <div className="grammar-note mt7">
            <div className="tag-code dark">GRAMMAR NOTE</div>
            <h3 className="mt5" style={{ color: '#fff' }}>
              “My name is …”
            </h3>
            <p
              className="mt2"
              style={{ color: '#d4dbea', maxWidth: '680px', lineHeight: '1.7' }}
            >
              {lesson.grammar_notes}
            </p>
          </div>
        )}

        <div className="row mt10">
          <div>
            <div className="section-index">Language specimens</div>
            <h2>Kosakata inti</h2>
          </div>
          <span className="small gray">{words.length} kosakata</span>
        </div>

        <div className="grid2 mt5">
          {words.map((item, idx) => (
            <article key={item.id} className="specimen-card">
              <span className="tag-code">0{idx + 1}</span>
              <div className="specimen-word mt6">{item.word}</div>
              <div className="specimen-ipa mt2">
                {item.pronunciation || '/.../'} · {item.part_of_speech}
              </div>
              <div className="specimen-translation">{item.translation}</div>
              <div className="annotation">
                <p className="small muted">{item.definition}</p>
                <blockquote
                  style={{
                    margin: '14px 0 0',
                    paddingLeft: '14px',
                    borderLeft: '2px solid #28785e',
                    fontStyle: 'italic',
                    color: '#2f3d55',
                  }}
                >
                  {item.example_sentence}
                  <br />
                  <span className="small gray">{item.example_translation}</span>
                </blockquote>
              </div>
            </article>
          ))}
        </div>

        {/* Sticky Action Footer */}
        <div className="sticky-action mt8">
          <div>
            <span className="tiny gray">NEXT STOP</span>
            <strong style={{ display: 'block', marginTop: '4px' }}>Active recall drill</strong>
          </div>
          <Link className="btn" to={`/lessons/${lessonId}/drill`}>
            Lanjut ke drill →
          </Link>
        </div>
      </article>
    </section>
  )
}
