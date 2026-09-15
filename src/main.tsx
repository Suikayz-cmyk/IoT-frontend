import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data dianggap segar selama 5 menit (mencegah request berulang)
      gcTime: 1000 * 60 * 10,    // Data yang tidak dipakai disimpan di memori selama 10 menit
      retry: 1,                 // Mengulang request gagal sebanyak 1 kali sebelum melempar error
      refetchOnWindowFocus: false, // Set false jika tidak ingin auto-fetch saat pindah tab browser
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
)