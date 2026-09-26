import type { ApiResponse } from '../types/api.types'
import { tokenStorage } from '../utils/tokenStorage'

const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  code: string
  details?: Record<string, string>
  constructor(message: string, status: number, code: string, details?: Record<string, string>) {
    super(message)
    this.status = status
    this.code = code
    this.details = details
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown }

export async function apiClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')
  if (options.body !== undefined) headers.set('Content-Type', 'application/json')
  const token = tokenStorage.get()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    })
  } catch {
    throw new ApiError('Cannot Connect To Server, Please T.', 0, 'NETWORK_ERROR')
  }

  let payload: ApiResponse<T>
  try { payload = await response.json() as ApiResponse<T> }
  catch { throw new ApiError('Respons server tidak valid.', response.status, 'INVALID_RESPONSE') }

  if (!response.ok || !payload.success) {
    const failure = 'error' in payload ? payload.error : undefined
    if (response.status === 401 && token) {
      tokenStorage.clear()
      window.dispatchEvent(new Event('geolingua:session-expired'))
    }
    throw new ApiError(failure?.message ?? 'Permintaan gagal.', response.status, failure?.code ?? 'REQUEST_FAILED', failure?.details)
  }
  return payload.data
}
