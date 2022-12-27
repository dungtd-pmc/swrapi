import { useCallback } from "react"
import { useSWRConfig } from "swr"
import { useApiConfig } from "./ApiConfigContext"
import { generateSWRKey } from "./utils"
import type { ApiInit, ApiKey } from "./types"

export default function useRevalidateApi(): <K extends ApiKey>(key: K, init?: ApiInit<K>) => void {
  const { api, defaultFetcherInit = {} } = useApiConfig()
  const { mutate } = useSWRConfig()

  const revalidate = useCallback(<K extends ApiKey>(key: K, init: ApiInit<K> = {}) => {
    const config = api[key]
    const swrKey = generateSWRKey(defaultFetcherInit, config, init)
    mutate(swrKey)
  }, [api, defaultFetcherInit, mutate])

  return revalidate
}