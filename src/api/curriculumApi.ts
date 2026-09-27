import { apiClient } from './apiClient'
import type { CourseOption, Language, LearningPreferences, Level, ModuleDetail, ModuleSummary } from '../types/curriculum.types'

export const curriculumApi = {
  languages: () => apiClient<Language[]>('/languages'),
  levels: () => apiClient<Level[]>('/levels'),
  courses: () => apiClient<CourseOption[]>('/courses'),
  savePreferences: (input: LearningPreferences) => apiClient<{ message: string }>('/user/preferences', { method: 'POST', body: input }),
  modules: () => apiClient<{ modules: ModuleSummary[] }>('/modules').then(d => d.modules),
  module: (id: string) => apiClient<{ module: ModuleDetail }>(`/modules/${encodeURIComponent(id)}`).then(d => d.module),
  lesson: (id: string) => apiClient<{ lesson: import('../types/curriculum.types').LessonDetail }>(`/lessons/${encodeURIComponent(id)}`).then(d => d.lesson),
}
