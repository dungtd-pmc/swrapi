import type { NormalObject, FetcherOptions, FetcherError, ApiInit, ApiKey, ApiConfiguration } from './types'

const isArray = <T>(obj: T) => Array.isArray(obj)
const isNormalObject = <T>(obj: T) => typeof obj === 'object' && obj !== null && !isArray(obj)

export const deepMerge = <T1, T2>(obj1: T1, obj2: T2) => {
  if (!isNormalObject(obj1) || !isNormalObject(obj2)) return obj2 as T1 & T2

  const obj: NormalObject = Object.assign({}, obj1)

  for (const [key, value2] of Object.entries(obj2 as NormalObject)) {
    const value1 = (obj1 as NormalObject)[key]
    obj[key] = deepMerge(value1, value2)
  }

  return obj as T1 & T2
}

export const generateSWRKey = <K extends ApiKey>(defaultOpts: FetcherOptions, config: ApiConfiguration[K], init: ApiInit<K>) => {
  const [path, configOpts] = Array.isArray(config) ? config : [config]
  return [path, JSON.parse(JSON.stringify(deepMerge(deepMerge(defaultOpts, configOpts), init)))]
}

const generatePath = (path: string, params: Record<string, string | number>) => path.replace(/:(\w+)/g, (_, key: string) => {
  const param = params[key]
  if (typeof param === 'string' || typeof param === 'number') return param.toString()
  throw new Error(`Missing ":${key}" param`)
})

const getData = async <TData>(res: Response) => {
  if (res.headers.get('Content-Type')?.includes('application/json')) return res.json() as TData
  return res.text() as TData
}

export const fetcher = async <TData = unknown, TError = unknown>(path: string, opts: FetcherOptions = {}) => {
  const {
    baseUrl = window.location.origin,
    params,
    ...init
  } = opts

  const url = new URL(path, baseUrl)
  if (params?.path) url.pathname = generatePath(url.pathname, params.path)
  if (params?.search) url.search = new URLSearchParams(params.search).toString()

  const res = await fetch(url.toString(), {
    ...init,
    headers: {
      ...init.headers,
      ...(params?.body && {
        'Content-Type': 'application/json'
      })
    },
    ...(params?.body && {
      body: JSON.stringify(params.body)
    })
  })

  if (!res.ok) {
    const error: FetcherError<TError> = new Error('An error occurred while fetching the data.')
    error.info = await getData<TError>(res)
    error.status = res.status
    throw error
  }

  return await getData<TData>(res)
}

export const swrFetcher = (args: [string, FetcherOptions]) => fetcher(...args)