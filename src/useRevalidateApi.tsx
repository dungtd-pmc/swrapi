import { useCallback } from "react"
import { useSWRConfig } from "swr"
import { useApiConfig } from "./ApiConfigContext"
import { generateSWRKey } from "./utils"
import type { ApiInit, ApiKey } from "./types"

export default function useRevalidateApi() {
  const { api, baseUrl } = useApiConfig()
  const { mutate } = useSWRConfig()

  const revalidate = useCallback(<K extends ApiKey>(key: K, init: ApiInit<K> = {}) => {
    const config = api[key]
    const swrKey = generateSWRKey({ baseUrl }, config, init)
    mutate(swrKey)
  }, [api, baseUrl, mutate])

  return revalidate
}