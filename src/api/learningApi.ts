import { apiClient } from './apiClient'
import type { DrillQuestion, DrillResult, ModuleQuiz, QuizResult, VocabularyItem, WritingPrompt, WritingResult } from '../types/learning.types'

const id = encodeURIComponent
export const learningApi = {
  vocabulary: (lessonId: string) => apiClient<{ vocabularies: VocabularyItem[] }>(`/lessons/${id(lessonId)}/vocabulary`).then(d => d.vocabularies),
  drills: (lessonId: string) => apiClient<{ questions?: DrillQuestion[]; exercises?: DrillQuestion[] }>(`/lessons/${id(lessonId)}/drills`).then(d => d.questions ?? d.exercises ?? []),
  answerDrill: (drillId: number, answer: string) => apiClient<DrillResult>(`/drills/${drillId}/answer`, { method: 'POST', body: { answer } }),
  writing: (lessonId: string) => apiClient<{ prompt?: WritingPrompt; writing?: WritingPrompt }>(`/lessons/${id(lessonId)}/writing`).then(d => d.prompt ?? d.writing!),
  submitWriting: (writingId: number, text: string) => apiClient<WritingResult>(`/writing/${writingId}/submit`, { method: 'POST', body: { text } }),
  quiz: (moduleId: string) => apiClient<{ quiz: ModuleQuiz }>(`/modules/${id(moduleId)}/quiz`).then(d => d.quiz),
  submitQuiz: (quizId: number, answers: { question_id: number; selected_option_id: number }[], duration_seconds: number) => apiClient<QuizResult>(`/quizzes/${quizId}/submit`, { method: 'POST', body: { answers, duration_seconds } }),
}
