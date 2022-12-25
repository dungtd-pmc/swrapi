import { useMemo } from 'react'
import useSWR from 'swr'
import { useApiConfig } from './ApiConfigContext'
import { generateSWRKey } from './utils'
import type { APIs, ApiKey, FetcherError, ApiInit } from './types'

export interface ApiOptions<K extends ApiKey> extends ApiInit<K> {
  skip?: boolean
}

export default function useApi<K extends ApiKey>(key: K, opts: ApiOptions<K> = {}) {
  const { skip, ...fetcherOpts } = opts
  const { api, baseUrl } = useApiConfig()
  const config = api[key]

  const swrKey = useMemo(() => {
    if (skip) return null
    return generateSWRKey({ baseUrl }, config, fetcherOpts)
  }, [skip, baseUrl, config, fetcherOpts])

  return useSWR<APIs[K]['data'], FetcherError<APIs[K]['error']>>(swrKey)
}