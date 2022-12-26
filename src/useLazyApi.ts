import useApi from "./useApi"
import { useCallback, useState } from "react"
import { deepMerge } from "./utils"
import type { ApiKey, ApiInit, PartialApiInit } from "./types"
// workaround for importing nested types
import type { APIs, FetcherError } from './types'

interface LazyApiOptions<K extends ApiKey> extends PartialApiInit<K> {
}

export default function useLazyApi<K extends ApiKey>(key: K, defaultOpts: LazyApiOptions<K> = {}) {
  const [skip, setSkip] = useState(true)
  const [opts, setOpts] = useState<LazyApiOptions<K>>({})

  const fetch = useCallback((opts: LazyApiOptions<K> = {}) => {
    setOpts(opts)
    setSkip(false)
  }, [])

  const result = useApi<K>(key, { ...(deepMerge(defaultOpts, opts) as ApiInit<K>), skip })

  return [fetch, result] as const
}