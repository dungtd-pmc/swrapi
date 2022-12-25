import useSWR from 'swr'
import { useApiConfig } from './ApiConfigContext'
import { deepMerge, generateSWRKey } from './utils'
import type { APIs, ApiKey, FetcherOptions } from './types'
import { useMemo } from 'react'

interface Options<K extends ApiKey> extends FetcherOptions<APIs[K]['params']> {
  skip?: boolean
}

export default function useApi<K extends ApiKey>(key: K, opts: Options<K> = {}) {
  const { skip, ...fetcherOpts } = opts
  const { api, baseUrl } = useApiConfig()
  const config = api[key]

  const swrKey = useMemo(() => {
    if (skip) return null
    const [path, configOpts] = Array.isArray(config) ? config : [config]
    return generateSWRKey(path, deepMerge({ ...configOpts, baseUrl }, fetcherOpts))
  }, [skip, baseUrl, config, fetcherOpts])

  return useSWR<APIs[K]['data'], APIs[K]['error']>(swrKey)
}