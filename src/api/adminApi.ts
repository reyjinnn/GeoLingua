import { apiClient } from './apiClient'

export interface AdminModuleItem {
  id: number
  course_id: number
  level_id: number
  module_code: string
  title: string
  topic: string
  order_index: number
  status: 'draft' | 'published' | 'archived'
  lesson_count: number
}

export interface AdminLessonItem {
  id: number
  module_id: number
  lesson_name: string
  lesson_objective: string
  grammar_notes: string
  order_index: number
}

export interface CreateModuleInput {
  course_id: number
  level_id: number
  module_code: string
  title: string
  topic: string
  description: string
  learning_objectives: string
  order_index: number
  prerequisite_module_id: number | null
  status: 'draft'
}

export interface CreateLessonInput {
  module_id: number
  lesson_name: string
  lesson_objective?: string
  grammar_notes?: string
  order_index?: number
}

export interface CreateVocabularyInput {
  lesson_id?: number
  word: string
  translation: string
  pronunciation?: string
  part_of_speech?: string
  definition?: string
  example_sentence?: string
  example_translation?: string
  order_index?: number
}

export interface CreateExerciseInput {
  lesson_id: number
  vocabulary_id: number
  question_type: 'mcq_meaning' | 'typing'
  prompt: string
  correct_answer: string
  explanation?: string
  order_index?: number
  options?: { text: string; is_correct: number }[]
}

export const adminApi = {
  listModules: () => apiClient<{ modules: AdminModuleItem[] }>('/admin/modules'),
  getLessons: (moduleId: number) => apiClient<{ lessons: AdminLessonItem[] }>(`/admin/modules/${moduleId}/lessons`),
  createModule: (input: CreateModuleInput) => apiClient<{ id: number; message: string }>('/admin/modules', { method: 'POST', body: input }),
  createLesson: (input: CreateLessonInput) => apiClient<{ id: number; message: string }>('/admin/lessons', { method: 'POST', body: input }),
  createVocabulary: (input: CreateVocabularyInput) => apiClient<{ id: number; message: string }>('/admin/vocabularies', { method: 'POST', body: input }),
  createExercise: (input: CreateExerciseInput) => apiClient<{ id: number; message: string }>('/admin/exercises', { method: 'POST', body: input }),
  publishModule: (id: number) => apiClient<{ id: number; status: 'published'; message: string }>(`/admin/modules/${id}/publish`, { method: 'PUT' }),
}
