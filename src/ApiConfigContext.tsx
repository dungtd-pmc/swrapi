import { createContext, useContext } from "react";
import type { ApiConfiguration } from "./types";

interface ApiConfigContext {
  api: ApiConfiguration
  baseUrl?: string
}

const ApiConfigContext = createContext<ApiConfigContext>({
  api: {}
})

export const useApiConfig = () => useContext(ApiConfigContext)

export default ApiConfigContext