import { apiClient } from './apiClient'
import type { Language, LearningPreferences, Level, ModuleDetail, ModuleSummary } from '../types/curriculum.types'

export const curriculumApi = {
  languages: () => apiClient<Language[]>('/languages'),
  levels: () => apiClient<Level[]>('/levels'),
  savePreferences: (input: LearningPreferences) => apiClient<{ message: string }>('/user/preferences', { method: 'POST', body: input }),
  modules: () => apiClient<ModuleSummary[]>('/modules'),
  module: (id: string) => apiClient<ModuleDetail>(`/modules/${encodeURIComponent(id)}`),
}
