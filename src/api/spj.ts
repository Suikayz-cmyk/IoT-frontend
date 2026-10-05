/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const spjApi = {
  findAll: async (): Promise<any[]> => {
    const headers = getAuthHeaders();
    const spjRes = await axios.get('/api/spj', { headers });
    const spjs = spjRes.data.data || [];

    return spjs.map((spj: any) => ({
      id: String(spj.id),
      kodePemesanan: spj.kode_order || `SPJ-${spj.id}`,
      kategori: 'SPJ',
      instansiId: spj.instansi_id ? String(spj.instansi_id) : '',
      picId: spj.pic_id ? String(spj.pic_id) : '',
      namaInstansi: spj.instansi?.nama_instansi || (spj.instansi_id ? String(spj.instansi_id) : ''),
      namaPIC: spj.pic?.nama_pic || (spj.pic_id ? String(spj.pic_id) : ''),
      kebutuhanSPJ: spj.kebutuhan_spj || '-',
      tglPrint: spj.tanggal_print || '-',
      picPrint: spj.pic_print || '-',
      tglPengiriman: spj.tanggal_pengiriman || '-',
      statusPesanan: spj.status || 'diproses',
      tanggalOrder: spj.created_at || spj.tanggal_po || '',
    }));
  },

  findById: async (id: string): Promise<any> => {
    const headers = getAuthHeaders();
    const spjRes = await axios.get(`/api/spj/${id}`, { headers });
    const spj = spjRes.data.data;
    if (!spj) throw new Error("SPJ not found");

    return {
      id: String(spj.id),
      kodePemesanan: spj.kode_order || `SPJ-${spj.id}`,
      kategori: 'SPJ',
      instansiId: spj.instansi_id ? String(spj.instansi_id) : '',
      picId: spj.pic_id ? String(spj.pic_id) : '',
      namaInstansi: spj.instansi?.nama_instansi || (spj.instansi_id ? String(spj.instansi_id) : ''),
      namaPIC: spj.pic?.nama_pic || (spj.pic_id ? String(spj.pic_id) : ''),
      noTelpPIC: spj.pic?.no_hp || '-',
      alamat: spj.instansi?.alamat || '-',
      kota: spj.instansi?.kota_kab || '-',
      provinsi: spj.instansi?.provinsi || '-',
      statusPesanan: spj.status || 'diproses',
      kebutuhanSPJ: spj.kebutuhan_spj || '',
      jumlahRangkap: spj.jumlah_rangkap ? String(spj.jumlah_rangkap) : '1',
      jenisKertas: spj.jenis_kertas || '',
      jenisFile: spj.jenis_file || '',
      tglPrint: spj.tanggal_print || '',
      tglUpdateList: spj.tanggal_update_list || '',
      tglTandaTangan: spj.tanggal_sign || '',
      tglSign: spj.tanggal_sign || '',
      tglPengiriman: spj.tanggal_pengiriman || '',
      tglParaf: spj.tanggal_paraf || '',
      picPrint: spj.pic_print || '',
      spj_id: spj.id,
    }
  },

  create: async (payload: any): Promise<any> => {
    const headers = getAuthHeaders();
    
    const spjPayload = {
      kode_order: `SPJ-${Date.now()}`,
      instansi_id: payload.namaInstansi ? Number(payload.namaInstansi) : null,
      pic_id: payload.namaPIC ? Number(payload.namaPIC) : null,
      status: payload.statusPesanan || 'diproses',
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

    const spjRes = await axios.post('/api/spj', spjPayload, { headers });
    return spjRes.data;
  },

  update: async (id: string, payload: any): Promise<any> => {
    const headers = getAuthHeaders();
    const spjRes = await axios.get(`/api/spj/${id}`, { headers });
    const spjData = spjRes.data.data;
    if (!spjData) throw new Error("SPJ not found");

    const spjUpdateData = {
      ...spjData,
      instansi_id: payload.namaInstansi !== undefined ? (payload.namaInstansi ? Number(payload.namaInstansi) : null) : spjData.instansi_id,
      pic_id: payload.namaPIC !== undefined ? (payload.namaPIC ? Number(payload.namaPIC) : null) : spjData.pic_id,
      status: payload.statusPesanan !== undefined ? payload.statusPesanan : spjData.status,
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
    };

    await axios.put(`/api/spj/${id}`, spjUpdateData, { headers });
    return { id, ...payload } as any;
  },

  updateStatus: async (id: string, status: string): Promise<any> => {
    const headers = getAuthHeaders();
    const spjRes = await axios.get(`/api/spj/${id}`, { headers });
    const spjData = spjRes.data.data;
    if (!spjData) throw new Error("SPJ not found");
    
    spjData.status = status;
    await axios.put(`/api/spj/${id}`, spjData, { headers });
    return { id, statusPesanan: status };
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/api/spj/${id}`, { headers: getAuthHeaders() });
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
