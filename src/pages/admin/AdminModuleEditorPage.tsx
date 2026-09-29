import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { adminApi } from '../../api/adminApi'
import { ApiError } from '../../api/apiClient'

export function AdminModuleEditorPage() {
  const { id } = useParams()
  const moduleId = Number(id) || 1

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
        setError(cause.message || 'Materi modul belum lengkap.')
        if (Array.isArray(cause.details)) {
          setMissingDetails(cause.details as string[])
        } else if (cause.details && typeof cause.details === 'object') {
          setMissingDetails(Object.values(cause.details as Record<string, string>))
        } else {
          setMissingDetails([
            'Modul belum memiliki kuis dengan 10 pertanyaan valid.',
            'Pelajaran #2 masih dalam status draft.',
          ])
        }
      } else {
        // Mock fallback alert
        setError('Materi modul belum lengkap.')
        setMissingDetails([
          'Pastikan modul ini memiliki setidaknya 1 pelajaran dengan kosakata, latihan drill, writing prompt, dan kuis berisi 10 pertanyaan valid.',
        ])
      }
    } finally {
      setPublishing(false)
    }
  }

  return (
    <section className="wrap-lg">
      <div className="mb4">
        <Link to="/admin/modules?tab=modules" className="link small" style={{ fontWeight: 650 }}>
          ← Kembali ke Daftar Modul
        </Link>
      </div>

      {/* Admin Hero */}
      <div className="admin-hero">
        <span className="tag-code dark">EN-A1-M{moduleId} / EDITOR</span>
        <h1 className="mt5" style={{ color: '#fff', fontSize: '38px' }}>
          Editor Modul #{moduleId}
        </h1>
        <p className="mt2" style={{ color: '#c4cfdf' }}>
          Isi seluruh konten sebelum mempublikasikan modul.
        </p>
        <div className="flex-wrap mt5" style={{ display: 'flex', gap: '8px' }}>
          <span className="tag-code dark">3 lessons</span>
          <span className="tag-code dark">24 vocab</span>
          <span className="tag-code dark">10 quiz slots</span>
        </div>
      </div>

      {/* Action Header */}
      <div className="row mt7 mb6" style={{ alignItems: 'center' }}>
        <div className="section-index" style={{ margin: 0, flex: 1 }}>
          Publication readiness
        </div>
        <button
          type="button"
          onClick={handlePublish}
          disabled={publishing}
          className="btn"
        >
          {publishing ? 'Memvalidasi...' : success ? 'Published ✓' : 'Publish Modul'}
        </button>
      </div>

      {/* Alert Result */}
      {error && (
        <div
          className="card-xl mb8"
          style={{
            border: '1px solid #fecaca',
            background: '#fef2f2',
            color: '#7f1d1d',
          }}
        >
          <h3>Gagal Publikasi</h3>
          <p className="mt1">{error}</p>
          {missingDetails.length > 0 && (
            <div className="mt3">
              <ul className="small" style={{ paddingLeft: '20px', margin: 0 }}>
                {missingDetails.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="small mt3">
            Pastikan modul ini memiliki setidaknya 1 pelajaran dengan kosakata, latihan drill,
            writing prompt, dan kuis berisi 10 pertanyaan valid.
          </p>
        </div>
      )}

      {success && (
        <div
          className="card-xl mb8"
          style={{
            border: '1px solid #c3ebe3',
            background: '#effaf7',
            color: '#137d72',
          }}
        >
          <h3>Publikasi Berhasil</h3>
          <p className="mt1">{success}</p>
        </div>
      )}

      {/* 2 Grid Columns */}
      <div className="grid2" style={{ gap: '24px' }}>
        <div className="card card-xl">
          <div className="section-index">Route contents</div>
          <h3>Daftar Pelajaran</h3>
          <p className="small muted mt2">Form tambah Kosakata, Drill, dan Writing Prompt.</p>
          <div className="editor-stack mt6">
            <div>
              <span className="tag-code">01</span>
              <strong style={{ marginLeft: '10px' }}>Salam dan sapaan</strong>
              <span className="badge badge-green" style={{ float: 'right' }}>
                ready
              </span>
            </div>
            <div>
              <span className="tag-code">02</span>
              <strong style={{ marginLeft: '10px' }}>Memperkenalkan diri</strong>
              <span className="badge badge-amber" style={{ float: 'right' }}>
                draft
              </span>
            </div>
            <div className="card-soft">
              Mekanisme form kompleks konten akan diimplementasi dalam sprint terpisah.
            </div>
          </div>
        </div>

        <div className="card card-xl">
          <div className="section-index">Checkpoint</div>
          <h3>Soal kuis</h3>
          <p className="small muted mt2">Modul publik wajib memiliki 10 soal kuis pilihan ganda.</p>
          <div className="quiz-readiness mt6">
            <div>
              <strong>07</strong>
              <span>valid</span>
            </div>
            <div>
              <strong>03</strong>
              <span>missing</span>
            </div>
            <div>
              <strong>70%</strong>
              <span>threshold</span>
            </div>
          </div>
          <div className="card-soft mt6">
            Mekanisme editor soal kuis akan diimplementasi dalam sprint terpisah.
          </div>
        </div>
      </div>
    </section>
  )
}
