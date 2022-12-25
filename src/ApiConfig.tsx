import { SWRConfig } from "swr";
import { swrFetcher as fetcher } from './utils'
import ApiConfigContext from "./ApiConfigContext";
import type { ApiConfiguration } from "./types";

type SWRConfigProps = React.ComponentProps<typeof SWRConfig>

interface ApiConfigProps extends Omit<SWRConfigProps, 'value'>  {
  api: ApiConfiguration
  baseUrl?: string
  swr?: SWRConfigProps['value']
}

export default function ApiConfig({ api, baseUrl, swr, ...rest }: ApiConfigProps) {
  return (
    <ApiConfigContext.Provider value={{ api, baseUrl }}>
      <SWRConfig
        value={{ fetcher, ...swr }}
        {...rest}
      />
    </ApiConfigContext.Provider>
  )
}