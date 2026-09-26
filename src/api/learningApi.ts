import { apiClient } from './apiClient'
import type { DrillQuestion, DrillResult, ModuleQuiz, QuizResult, VocabularyItem, WritingPrompt, WritingResult } from '../types/learning.types'

const id = encodeURIComponent
export const learningApi = {
  vocabulary: (lessonId: string) => apiClient<VocabularyItem[]>(`/lessons/${id(lessonId)}/vocabulary`),
  drills: (lessonId: string) => apiClient<DrillQuestion[]>(`/lessons/${id(lessonId)}/drills`),
  answerDrill: (drillId: number, answer: string) => apiClient<DrillResult>(`/drills/${drillId}/answer`, { method: 'POST', body: { answer } }),
  writing: (lessonId: string) => apiClient<WritingPrompt>(`/lessons/${id(lessonId)}/writing`),
  submitWriting: (writingId: number, text: string) => apiClient<WritingResult>(`/writing/${writingId}/submit`, { method: 'POST', body: { text } }),
  quiz: (moduleId: string) => apiClient<ModuleQuiz>(`/modules/${id(moduleId)}/quiz`),
  submitQuiz: (quizId: number, answers: { question_id: number; selected_option_id: number }[], duration_seconds: number) => apiClient<QuizResult>(`/quizzes/${quizId}/submit`, { method: 'POST', body: { answers, duration_seconds } }),
}
