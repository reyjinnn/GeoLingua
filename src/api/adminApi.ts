import { apiClient } from './apiClient'


// TYPES


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
}

export interface ModuleAdmin {
  id: number
  module_code: string
  title: string
  topic: string
  order_index: number
  status: 'draft' | 'published' | 'archived'
  course_id: number
  level_id: number
  prerequisite_module_id: number | null
  course_title: string
  level_code: string
}

export interface ModuleDetailAdmin extends CreateModuleInput {
  id: number
  estimated_duration_minutes: number
  status: 'draft' | 'published' | 'archived'
}

export interface LessonAdmin {
  id: number
  module_id: number
  lesson_name: string
  lesson_objective: string
  grammar_notes: string | null
  order_index: number
}

export interface DashboardMetrics {
  total_users: number
  published_modules: number
  draft_modules: number
  archived_modules: number
}

export interface ApiMessage<T = { id: number }> {
  id: number
  message: string
}


// ADMIN API


export const adminApi = {
  // Dashboard
  dashboard: () => apiClient<DashboardMetrics>('/admin/dashboard'),

  // Modules
  listModules: () => apiClient<ModuleAdmin[]>('/admin/modules'),
  showModule: (id: number) => apiClient<ModuleDetailAdmin>(`/admin/modules/${id}`),
  createModule: (input: CreateModuleInput) =>
    apiClient<ApiMessage>('/admin/modules', { method: 'POST', body: input }),
  updateModule: (id: number, input: Partial<CreateModuleInput>) =>
    apiClient<ApiMessage>(`/admin/modules/${id}`, { method: 'PUT', body: input }),
  publishModule: (id: number) =>
    apiClient<ApiMessage>(`/admin/modules/${id}/publish`, { method: 'PUT' }),
  unpublishModule: (id: number) =>
    apiClient<ApiMessage>(`/admin/modules/${id}/draft`, { method: 'PUT' }),
  deleteModule: (id: number) =>
    apiClient<ApiMessage>(`/admin/modules/${id}`, { method: 'DELETE' }),

  // Lessons
  listLessons: (moduleId: number) =>
    apiClient<LessonAdmin[]>(`/admin/modules/${moduleId}/lessons`),
  createLesson: (input: Omit<LessonAdmin, 'id'>) =>
    apiClient<ApiMessage>('/admin/lessons', { method: 'POST', body: input }),
  updateLesson: (id: number, input: Partial<LessonAdmin>) =>
    apiClient<ApiMessage>(`/admin/lessons/${id}`, { method: 'PUT', body: input }),
  deleteLesson: (id: number) =>
    apiClient<ApiMessage>(`/admin/lessons/${id}`, { method: 'DELETE' }),
}