import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { AxiosError } from 'axios'
import './index.css'
import router from './router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof AxiosError && error.response) {
          const status = error.response.status
          if (status >= 400 && status < 500) {
            console.warn(`[QueryClient] No se reintenta — error ${status}`)
            return false
          }
        }
        const willRetry = failureCount < 2
        if (willRetry) console.warn(`[QueryClient] Reintento ${failureCount + 1}/2`)
        return willRetry
      },
    },
    mutations: {
      onError: (error) => {
        console.error('[QueryClient] Mutation error:', error)
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
