import { apiClient } from './apiClient'
import type { CourseOption, Language, LearningPreferences, Level, ModuleDetail, ModuleSummary } from '../types/curriculum.types'

export const curriculumApi = {
  languages: () => apiClient<Language[]>('/languages'),
  levels: () => apiClient<Level[]>('/levels'),
  courses: () => apiClient<CourseOption[]>('/courses'),
  savePreferences: (input: LearningPreferences) => apiClient<{ message: string }>('/user/preferences', { method: 'POST', body: input }),
  modules: () => apiClient<ModuleSummary[]>('/modules'),
  module: (id: string) => apiClient<ModuleDetail>(`/modules/${encodeURIComponent(id)}`),
}
