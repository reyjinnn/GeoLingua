import { apiClient } from './apiClient'
import type { ProgressSummary } from '../types/progress.types'

export const progressApi = {
  summary: () => apiClient<ProgressSummary>('/progress/summary'),
}
