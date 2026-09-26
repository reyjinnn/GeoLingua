import { useContext } from 'react'
import { LearningContext } from '../context/LearningContext'

export function useLearning() {
  const context = useContext(LearningContext)
  if (!context) throw new Error('useLearning harus digunakan di dalam LearningProvider')
  return context
}
