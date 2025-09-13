// Re-export all database types
export * from './database'

// Additional application types can be added here
export type ApiResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type PaginationParams = {
  page?: number
  limit?: number
  offset?: number
}

export type SortParams = {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type SearchParams = {
  q?: string
  email?: string
  passportId?: string
}