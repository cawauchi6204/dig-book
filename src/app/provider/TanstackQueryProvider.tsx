'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function TanstackQueryProvider(
  { children } : { children: React.ReactNode }
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: 0,
        staleTime: 0,
        retry: false,
        refetchOnWindowFocus: false,
      }
    }
  })
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}