import { apiClient } from './apiClient'

export interface CreateModuleInput { course_id: number; level_id: number; module_code: string; title: string; topic: string; description: string; learning_objectives: string; order_index: number; prerequisite_module_id: number | null; status: 'draft' }
export const adminApi = {
  createModule: (input: CreateModuleInput) => apiClient<{ id: number; message: string }>('/admin/modules', { method: 'POST', body: input }),
  publishModule: (id: number) => apiClient<{ id: number; status: 'published'; message: string }>(`/admin/modules/${id}/publish`, { method: 'PUT' }),
}
