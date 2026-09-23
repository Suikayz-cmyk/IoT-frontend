import axios from 'axios'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export interface DashboardGrafikItem {
  periode: string;
  inaproc: number;
  manual: number;
  alat: number;
  inaproc_dibayar: number;
  manual_dibayar: number;
  alat_dibayar: number;
}

export interface DashboardResponse {
  success: boolean;
  periode: string;
  data: {
    total_pembelian: {
      inaproc: number;
      manual: number;
      alat: number;
    };
    total_dibayar: {
      inaproc: number;
      manual: number;
      alat: number;
    };
    grafik: DashboardGrafikItem[];
  };
}

export const dashboardApi = {
  getDashboard: async (periode: 'day' | 'month' | 'year' = 'month'): Promise<DashboardResponse> => {
    const response = await axios.get(`/dashboard?periode=${periode}`, { headers: getAuthHeaders() })
    return response.data
  }
}

