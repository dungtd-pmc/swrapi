import { createContext, useContext } from "react";
import type { ApiConfiguration, FetcherInit } from "./types";

interface ApiConfigContext {
  api: ApiConfiguration
  defaultFetcherInit?: FetcherInit
}

const ApiConfigContext = createContext<ApiConfigContext>({
  api: {}
})

export const useApiConfig = () => useContext(ApiConfigContext)

export default ApiConfigContext