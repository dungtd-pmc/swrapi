# SWRAPI
SWR wrapper for faster usage.

## Installation
SWRAPI uses SWR as peer dependency so you also need to install it as well
```bash
yarn add swr swrapi
```

## Quick Start

1. Define your APIs
```js
// api.ts
import type { ApiConfiguration } from 'swrapi'

interface ExampleData {
  id: string
  name: string
}

interface ExampleError {
  status: string
  message: string
}

interface ExampleBody {
  name: string
}

declare module 'swrapi' {
  interface APIs {
    GET_EXAMPLE: Api<ExampleData>
    POST_EXAMPLE: Api<ExampleData, ExampleError, FetcherParams<{ body: ExampleBody }>>
  }
}

const api: ApiConfiguration = {
  GET_EXAMPLE: '/example',
  POST_EXAMPLE: ['/example', { method: 'POST' }]
}

export default api
```

2. Pass it into `ApiConfig` props
```js
// app.tsx
import api from 'path/to/api.ts'
import { ApiConfig } from 'swrapi'

function App() {
  return (
    <ApiConfig 
      api={api} 
      swr={swrConfig} // Optionnal
    >
      ....
    </ApiConfig>
  ) 
}
```

3. Use it

GET example
```js
// example.tsx
import { useApi } from 'swrapi'

function Example() {
  const { data, error, isLoading } = useApi('GET_EXAMPLE')

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}
```

Lazy GET example
```js
// example.tsx
import { useLazyApi } from 'swrapi'

function Example() {
  const [getExample, { data, error, isLoading }] = useLazyApi('GET_EXAMPLE')

  useEffect(() => getExample(), [])
  
  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}
```

POST example
```js
// example.tsx
import { useMutateApi } from 'swrapi'

function Example() {
  const [postExample, { data, error, isLoading }] = useMutateApi('POST_EXAMPLE', {
    revalidateAPIs: ['GET_EXAMPLE'] // Optional. Used to revalidate multiple active APIs
  })

  useEffect(() => {
    postExample({
      params: {
        body: {
          name: 'Foo Bar'
        }
      }
    })
  }, [])
  
  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}
```

## License
The MIT License.
