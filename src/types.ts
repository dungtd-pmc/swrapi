export type NormalObject = Record<string, any>

export interface Api<TData = unknown, TError = unknown, TParams = unknown> {
  data: TData
  error: TError
  params: TParams
}

export interface APIs {}

export type ApiKey = keyof APIs

export type ApiInit<K extends ApiKey> = FetcherInit<APIs[K]['params']>

export type PartialApiInit<K extends ApiKey> = FetcherInit<Partial<APIs[K]['params']>>

export type ApiInitTuple = {
  [K in ApiKey]: [K, ApiInit<K>]
}

export type ApiConfiguration = Record<ApiKey, string | [string, FetcherInit]>

interface FParams {
  path?: any
  search?: any
  body?: any
}

type FetcherParams<T extends FParams = FParams> = T

export interface FetcherError<T> extends Error {
  info?: T,
  status?: number
}

export interface FetcherInit<T extends FParams = FParams> extends RequestInit {
  baseUrl?: string
  params?: FetcherParams<T>
}
