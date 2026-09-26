import { AuthProvider } from './context/AuthProvider'
import { LearningProvider } from './context/LearningProvider'
import { AppRoutes } from './routes/AppRoutes'

export default function App() {
  return (
    <AuthProvider>
      <LearningProvider>
        <AppRoutes />
      </LearningProvider>
    </AuthProvider>
  )
}
