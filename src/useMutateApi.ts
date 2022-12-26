import { useState, useCallback } from 'react'
import { useSWRConfig } from 'swr'
import { useApiConfig } from './ApiConfigContext'
import { deepMerge, generateSWRKey, swrFetcher } from './utils'
import useDataRef from './useDataRef'
import useRevalidateApi from './useRevalidateApi'
import type { APIs, ApiKey, ApiInit, FetcherError, FetcherOptions, ApiInitTuple, PartialApiInit } from './types'

interface MutateApiOptions<K extends ApiKey> extends PartialApiInit<K> {
  onSuccess?: (data: APIs[K]['data']) => void
  onError?: (error: FetcherError<APIs[K]['error']>) => void
  revalidateAPIs?: (ApiKey | ApiInitTuple[ApiKey])[]
}

export default function useMutateApi<K extends ApiKey>(key: K, defaultOpts: MutateApiOptions<K> = {}) {
  const revalidate = useRevalidateApi()
  const defaultOptsRef = useDataRef(defaultOpts)
  const { api, baseUrl } = useApiConfig()
  const { fetcher = swrFetcher } = useSWRConfig()
  const config = api[key]

  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<APIs[K]['data'] | null>()
  const [error, setError] = useState<FetcherError<APIs[K]['error']> | null>()

  const mutate = useCallback(async (opts: PartialApiInit<K> = {}) => {
    setIsLoading(true)

    const { onError, onSuccess, revalidateAPIs = [], ...restOpts } = defaultOptsRef.current
    let data: APIs[K]['data'] | null = null
    let error: FetcherError<APIs[K]['error']> | null = null
    try {
      const swrKey = generateSWRKey({ baseUrl }, config, deepMerge(restOpts, opts) as ApiInit<K>) as [string, FetcherOptions]
      data = await fetcher(swrKey) as APIs[K]['data']

      if (onSuccess) setTimeout(() => onSuccess(data!), 0)

      if (revalidateAPIs.length > 0) setTimeout(() => {
        revalidateAPIs.forEach(api => {
          if (Array.isArray(api)) revalidate(...(api as [ApiKey, ApiInit<ApiKey>]))
          else revalidate(api)
        })
      }, 0)
    } catch (err) {
      error = err as FetcherError<APIs[K]['error']>
      if (onError) setTimeout(() => onError(error!), 0)
    }

    setData(data)
    setError(error)
    setIsLoading(false)

    return { data, error }
  }, [config, baseUrl, fetcher, revalidate])

  return [mutate, { isLoading, data, error }] as const
}