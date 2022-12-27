import { SWRConfig } from "swr";
import { swrFetcher as fetcher } from './utils'
import ApiConfigContext from "./ApiConfigContext";
import type { ApiConfiguration, FetcherInit } from "./types";

type SWRConfigProps = React.ComponentProps<typeof SWRConfig>

interface ApiConfigProps extends Omit<SWRConfigProps, 'value'>  {
  api: ApiConfiguration
  swr?: SWRConfigProps['value']
  defaultFetcherInit?: FetcherInit
}

export default function ApiConfig({ api, defaultFetcherInit, swr, ...rest }: ApiConfigProps) {
  return (
    <ApiConfigContext.Provider value={{ api, defaultFetcherInit }}>
      <SWRConfig
        value={{ fetcher, ...swr }}
        {...rest}
      />
    </ApiConfigContext.Provider>
  )
}