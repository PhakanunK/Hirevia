const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''
const PUBLIC_API = BASE_URL + '/public'
const ADMIN_API = BASE_URL + '/admin'

type FetchOptions = RequestInit & {
  params?: Record<string, string>
}

/**
 * Handle 401 responses by clearing token and redirecting to login
 */
const handleUnauthorized = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token')
    window.location.href = '/admin'
  }
}

/**
 * Public fetch - no authentication required
 */
export const publicFetch = async <T = unknown>(
  path: string,
  options?: FetchOptions
): Promise<T> => {
  const { params, ...fetchOptions } = options || {}
  
  let url = PUBLIC_API + path
  if (params) {
    const searchParams = new URLSearchParams(params)
    url += `?${searchParams.toString()}`
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions?.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.detail || body.message || `${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Admin fetch - automatically adds Bearer token from localStorage
 * Redirects to /admin on 401 Unauthorized
 */
export const adminFetch = async <T = unknown>(
  path: string,
  options?: FetchOptions
): Promise<T> => {
  const { params, ...fetchOptions } = options || {}
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

  let url = ADMIN_API + path
  if (params) {
    const searchParams = new URLSearchParams(params)
    url += `?${searchParams.toString()}`
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
      ...fetchOptions?.headers,
    },
  })

  if (response.status === 401) {
    handleUnauthorized()
    throw new Error('Unauthorized')
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.detail || body.message || `${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Public fetch for FormData (file uploads) - no authentication required
 */
export const publicFetchFormData = async <T = unknown>(
  path: string,
  formData: FormData
): Promise<T> => {
  const url = PUBLIC_API + path

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    // Note: Don't set Content-Type header - browser will set it with boundary for FormData
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.detail || errorData.message || `API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Helper to set the auth token after login
 */
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token)
  }
}

/**
 * Helper to clear the auth token on logout
 */
export const clearAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token')
  }
}

/**
 * Helper to check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('access_token')
  }
  return false
}
