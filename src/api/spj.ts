/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const spjApi = {
  findAll: async (): Promise<any[]> => {
    // 1. Fetch Orders to get those with jenis_order = SPJ
    const res = await axios.get('/api/orders', { headers: getAuthHeaders() })
    const orders = res.data.data || []
    const spjOrders = orders.filter((o: any) => o.jenis_order === 'SPJ')

    return spjOrders.map((order: any) => ({
      id: String(order.id),
      kodePemesanan: order.kode_order,
      namaInstansi: order.instansi_id ? String(order.instansi_id) : '',
      namaPIC: order.pic_id ? String(order.pic_id) : '',
      statusPesanan: order.status,
      tanggalOrder: order.tanggal_order,
    }))
  },

  findById: async (id: string): Promise<any> => {
    // 1. Fetch Order
    const res = await axios.get(`/api/orders/${id}`, { headers: getAuthHeaders() })
    const order = res.data.data || res.data

    let specificData: any = {}
    
    // 2. Fetch SPJ details
    try {
      const specRes = await axios.get(`/api/spj/order/${id}`, { headers: getAuthHeaders() })
      specificData = specRes.data?.data || {}
    } catch (e) {
      console.warn('SPJ detail not found', e)
    }

    return {
      id: String(order.id),
      kodePemesanan: order.kode_order,
      namaInstansi: order.instansi_id ? String(order.instansi_id) : '',
      namaPIC: order.pic_id ? String(order.pic_id) : '',
      statusPesanan: order.status,
      
      kebutuhanSPJ: specificData.kebutuhan_spj,
      jumlahRangkap: specificData.jumlah_rangkap ? String(specificData.jumlah_rangkap) : '1',
      jenisKertas: specificData.jenis_kertas,
      jenisFile: specificData.jenis_file,
      tglPrint: specificData.tanggal_print,
      tglUpdateList: specificData.tanggal_update_list,
      tglSign: specificData.tanggal_sign,
      tglPengiriman: specificData.tanggal_pengiriman,
      tglParaf: specificData.tanggal_paraf,
      picPrint: specificData.pic_print,
    }
  },

  create: async (payload: any): Promise<any> => {
    // 1. Create Order
    const orderData = {
      kode_order: `SPJ-${Date.now()}`, // Or allow payload to specify
      jenis_order: 'SPJ',
      instansi_id: payload.namaInstansi ? Number(payload.namaInstansi) : null,
      pic_id: payload.namaPIC ? Number(payload.namaPIC) : null,
      status: 'Diproses',
      qty: 1,
      harga_ppn: 0,
      tanggal_order: new Date().toISOString().split('T')[0]
    };
    const headers = getAuthHeaders();
    
    let orderRes;
    try {
      orderRes = await axios.post('/api/orders', orderData, { headers });
    } catch (e) {
      console.error('Failed to create SPJ order', e);
      throw new Error('Gagal membuat Order SPJ di database', { cause: e });
    }

    const orderId = orderRes.data?.data?.id;
    if (!orderId) throw new Error('Order ID tidak ditemukan');

    // 2. Create SPJ Detail
    const spjData = {
      order_id: orderId,
      kebutuhan_spj: payload.kebutuhanSPJ || '',
      jumlah_rangkap: payload.jumlahRangkap ? Number(payload.jumlahRangkap) : 1,
      jenis_kertas: payload.jenisKertas || '',
      jenis_file: payload.jenisFile || '',
      tanggal_print: payload.tglPrint || null,
      tanggal_update_list: payload.tglUpdateList || null,
      tanggal_sign: payload.tglSign || null,
      tanggal_pengiriman: payload.tglPengiriman || null,
      tanggal_paraf: payload.tglParaf || null,
      pic_print: payload.picPrint || '',
      status: payload.statusPesanan || 'Diproses'
    };
    await axios.post('/api/spj', spjData, { headers });

    return orderRes.data;
  },

  update: async (id: string, payload: any): Promise<any> => {
    const orderData: any = {};
    if (payload.namaInstansi !== undefined) orderData.instansi_id = Number(payload.namaInstansi) || null;
    if (payload.namaPIC !== undefined) orderData.pic_id = Number(payload.namaPIC) || null;
    if (payload.statusPesanan !== undefined) orderData.status = payload.statusPesanan;

    const headers = getAuthHeaders();
    if (Object.keys(orderData).length > 0) {
      await axios.put(`/api/orders/${id}`, orderData, { headers });
    }
    // Update SPJ details ideally needs SPJ ID. We assume SPJ is linked and backend handles or we ignore for now.
    return { id, ...payload } as any;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/api/orders/${id}`, { headers: getAuthHeaders() });
  },

  exportExcel: async () => {
    // Placeholder as it likely requires a different structure now
    const response = await axios.get('/api/spj/export', {
      headers: getAuthHeaders(),
      responseType: 'blob',
    })
    return response.data
  },

  importExcel: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await axios.post('/api/spj/import', formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

