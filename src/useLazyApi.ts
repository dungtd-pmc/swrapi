import useApi from "./useApi"
import { useCallback, useState } from "react"
import { deepMerge } from "./utils"
import type { ApiInit, ApiKey } from "./types"
// workaround for importing nested types
import type { APIs, FetcherError } from './types'

interface LazyApiOptions<K extends ApiKey> extends ApiInit<K> {
}

export default function useLazyApi<K extends ApiKey>(key: K, defaultOpts: LazyApiOptions<K> = {}) {
  const [skip, setSkip] = useState(true)
  const [opts, setOpts] = useState<LazyApiOptions<K>>({})

  const fetch = useCallback((opts: LazyApiOptions<K> = {}) => {
    setOpts(opts)
    setSkip(false)
  }, [])

  const result = useApi<K>(key, { ...deepMerge(defaultOpts, opts), skip })

  return [fetch, result] as const
}