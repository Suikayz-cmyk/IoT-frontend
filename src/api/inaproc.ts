import axios from 'axios'
import type { InaprocOrder } from '@/types/inaproc'

// Fungsi bantuan untuk mengambil token otentikasi
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return { Authorization: `Bearer ${token}` }
}

export const inaprocApi = {
  // Mendapatkan semua data Inaproc
  findAll: async (): Promise<InaprocOrder[]> => {
    const response = await axios.get('/inaproc', { headers: getAuthHeaders() })
    return response.data.data || []
  },

  // Membuat data Inaproc baru
  create: async (data: Partial<InaprocOrder>) => {
    const response = await axios.post('/inaproc', data, { headers: getAuthHeaders() })
    return response.data
  },

  // Mengubah data Inaproc yang sudah ada
  update: async ({ id, data }: { id: number; data: Partial<InaprocOrder> }) => {
    const response = await axios.put(`/inaproc/${id}`, data, { headers: getAuthHeaders() })
    return response.data
  },

  // Menghapus data Inaproc
  delete: async (id: number) => {
    const response = await axios.delete(`/inaproc/${id}`, { headers: getAuthHeaders() })
    return response.data
  }
}