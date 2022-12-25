import { useState, useCallback } from 'react'
import { useSWRConfig } from 'swr'
import { useApiConfig } from './ApiConfigContext'
import { deepMerge, generateSWRKey, swrFetcher } from './utils'
import type { APIs, ApiKey, ApiInit, FetcherError, FetcherOptions } from './types'
import useDataRef from './useDataRef'

interface MutateApiOptions<K extends ApiKey> extends ApiInit<K> {
}

export default function useMutateApi<K extends ApiKey>(key: K, defaultOpts: MutateApiOptions<K> = {}) {
  const defaultOptsRef = useDataRef(defaultOpts)
  const { api, baseUrl } = useApiConfig()
  const { fetcher = swrFetcher } = useSWRConfig()
  const config = api[key]

  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<APIs[K]['data'] | null>()
  const [error, setError] = useState<FetcherError<APIs[K]['error']> | null>()

  const mutate = useCallback(async (opts: MutateApiOptions<K> = {}) => {
    setIsLoading(true)

    let data: APIs[K]['data'] | null = null
    let error: FetcherError<APIs[K]['error']> | null = null
    try {
      const swrKey = generateSWRKey({ baseUrl }, config, deepMerge(defaultOptsRef.current, opts)) as [string, FetcherOptions]
      data = await fetcher(swrKey) as APIs[K]['data']
    } catch (err) {
      error = err as FetcherError<APIs[K]['error']>
    }

    setData(data)
    setError(error)
    setIsLoading(false)

    return { data, error }
  }, [config, baseUrl, fetcher])

  return [mutate, { isLoading, data, error }] as const
}