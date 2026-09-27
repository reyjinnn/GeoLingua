import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { ProtectedRoute } from '../components/layout/ProtectedRoute'
import { DashboardPage } from '../pages/learner/DashboardPage'
import { FeaturePage } from '../pages/learner/FeaturePage'
import { LessonPage } from '../pages/learner/LessonPage'
import { ModulePage } from '../pages/learner/ModulePage'
import { OnboardingPage } from '../pages/learner/OnboardingPage'
import { ProgressPage } from '../pages/learner/ProgressPage'
import { AuthPage } from '../pages/public/AuthPage'
import { LandingPage } from '../pages/public/LandingPage'

const pending = (title: string, description: string) => <FeaturePage title={title} description={description} />

export function AppRoutes() {
  return <BrowserRouter><Routes><Route element={<AppLayout />}>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<AuthPage mode="login" />} />
    <Route path="/register" element={<AuthPage mode="register" />} />
    <Route path="/admin/login" element={<AuthPage mode="login" />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/modules" element={<DashboardPage />} />
      <Route path="/modules/:id" element={<ModulePage />} />
      <Route path="/lessons/:id" element={<LessonPage />} />
      <Route path="/lessons/:id/drill" element={pending('Latihan kosakata', 'Mode pilihan ganda dan mengetik akan menggunakan soal dari API drills.')} />
      <Route path="/lessons/:id/writing" element={pending('Latihan menulis', 'Teks akan divalidasi terhadap kosakata wajib dan jumlah kata minimal.')} />
      <Route path="/modules/:id/quiz" element={pending('Kuis modul', 'Kuis 10 soal akan menentukan kelulusan pada ambang nilai 70%.')} />
      <Route path="/modules/:id/quiz/result" element={pending('Hasil kuis', 'Nilai dan status modul akan ditampilkan setelah pengiriman jawaban.')} />
      <Route path="/progress" element={<ProgressPage />} />
      <Route path="/profile" element={pending('Profil', 'Preferensi bahasa dan informasi akun akan tersedia di sini.')} />
    </Route>
    <Route element={<ProtectedRoute admin />}>
      <Route path="/admin/dashboard" element={pending('Dasbor admin', 'Ringkasan pengguna dan konten akan menggunakan endpoint admin.')} />
      <Route path="/admin/modules" element={pending('Manajemen modul', 'Admin dapat membuat, mengedit, dan menerbitkan modul melalui API admin.')} />
      <Route path="/admin/modules/:id/edit" element={pending('Editor modul', 'Lesson, kosakata, latihan, dan kuis akan dikelola di sini.')} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Route></Routes></BrowserRouter>
}
