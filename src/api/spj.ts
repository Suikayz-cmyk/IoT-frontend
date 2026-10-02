/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const spjApi = {
  findAll: async (): Promise<any[]> => {
    const [ordersRes, spjRes] = await Promise.all([
      axios.get('/api/orders', { headers: getAuthHeaders() }),
      axios.get('/api/spj', { headers: getAuthHeaders() }).catch(() => ({ data: { data: [] } }))
    ]);
    
    const orders = ordersRes.data.data || []
    const spjDetails = spjRes.data.data || []
    
    const spjOrders = orders.filter((o: any) => 
      String(o.kode_order).startsWith('SPJ-') || o.keterangan === 'SPJ' || spjDetails.some((s: any) => s.order_id === o.id)
    )

    return spjOrders.map((order: any) => {
      const spjDetail = spjDetails.find((s: any) => s.order_id === order.id) || {};
      return {
        id: String(order.id),
        kodePemesanan: order.kode_order,
        namaInstansi: order.instansi?.nama_instansi || (order.instansi_id ? String(order.instansi_id) : ''),
        namaPIC: order.pic?.nama_pic || (order.pic_id ? String(order.pic_id) : ''),
        statusPesanan: order.status,
        tanggalOrder: order.tanggal_order,
        kebutuhanSPJ: spjDetail.kebutuhan_spj || '-',
        tglPrint: spjDetail.tanggal_print || '-',
        tglUpdateList: spjDetail.tanggal_update_list || '-',
        picPrint: spjDetail.pic_print || '-',
        tglPengiriman: spjDetail.tanggal_pengiriman || '-'
      };
    })
  },

  findById: async (id: string): Promise<any> => {
    const res = await axios.get(`/api/orders/${id}`, { headers: getAuthHeaders() })
    const order = res.data.data || res.data

    let specificData: any = {}
    
    if (order.spj && Array.isArray(order.spj) && order.spj.length > 0) {
      specificData = order.spj[0];
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
      spj_id: specificData.id,
    }
  },

  create: async (payload: any): Promise<any> => {
      const headers = getAuthHeaders();
      
      const spjPayload = {
        kode_order: `SPJ-${Date.now()}`,
        jenis_order: 'manual',
        kategori_order: 'iot_manual',
        keterangan: 'SPJ',
        instansi_id: payload.namaInstansi ? Number(payload.namaInstansi) : null,
        pic_id: payload.namaPIC ? Number(payload.namaPIC) : null,
        status: payload.statusPesanan || 'Diproses',
        tanggal_po: new Date().toISOString().split('T')[0],

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
      };
      
      let spjRes;
      try {
        spjRes = await axios.post('/api/spj', spjPayload, { headers });
      } catch (e) {
        console.error('Failed to create SPJ', e);
        throw e;
      }
  
      return spjRes.data;
    },
  update: async (id: string, payload: any): Promise<any> => {
    const headers = getAuthHeaders();
    
    const res = await axios.get(`/api/orders/${id}`, { headers });
    const fullOrder = res.data.data || res.data;
    
    let orderChanged = false;
    if (payload.namaInstansi !== undefined) { fullOrder.instansi_id = Number(payload.namaInstansi) || null; orderChanged = true; }
    if (payload.namaPIC !== undefined) { fullOrder.pic_id = Number(payload.namaPIC) || null; orderChanged = true; }
    if (payload.statusPesanan !== undefined) { fullOrder.status = payload.statusPesanan; orderChanged = true; }

    if (orderChanged) {
      await axios.put(`/api/orders/${id}`, fullOrder, { headers });
    }
    
    if (payload.kebutuhanSPJ !== undefined || payload.tglPrint !== undefined || payload.statusPesanan !== undefined) {
      try {
        const spjData = (fullOrder.spj && Array.isArray(fullOrder.spj) && fullOrder.spj.length > 0) ? fullOrder.spj[0] : null;
        if (spjData && spjData.id) {
          const spjUpdateData = {
            ...spjData,
            kebutuhan_spj: payload.kebutuhanSPJ !== undefined ? payload.kebutuhanSPJ : spjData.kebutuhan_spj,
            jumlah_rangkap: payload.jumlahRangkap ? Number(payload.jumlahRangkap) : spjData.jumlah_rangkap,
            jenis_kertas: payload.jenisKertas !== undefined ? payload.jenisKertas : spjData.jenis_kertas,
            jenis_file: payload.jenisFile !== undefined ? payload.jenisFile : spjData.jenis_file,
            tanggal_print: payload.tglPrint !== undefined ? payload.tglPrint : spjData.tanggal_print,
            tanggal_update_list: payload.tglUpdateList !== undefined ? payload.tglUpdateList : spjData.tanggal_update_list,
            tanggal_sign: payload.tglSign !== undefined ? payload.tglSign : spjData.tanggal_sign,
            tanggal_pengiriman: payload.tglPengiriman !== undefined ? payload.tglPengiriman : spjData.tanggal_pengiriman,
            tanggal_paraf: payload.tglParaf !== undefined ? payload.tglParaf : spjData.tanggal_paraf,
            pic_print: payload.picPrint !== undefined ? payload.picPrint : spjData.pic_print,
            status: payload.statusPesanan !== undefined ? payload.statusPesanan : spjData.status
          };
          await axios.put(`/api/spj/${spjData.id}`, spjUpdateData, { headers });
        }
      } catch (e) {
        console.warn("Gagal update tabel SPJ", e);
      }
    }

    return { id, ...payload } as any;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/api/orders/${id}`, { headers: getAuthHeaders() });
  },

  exportExcel: async () => {
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

