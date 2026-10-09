import apiClient from './client'
import type { SPJ, Order } from "@/types/backend";

export interface SPJData {
  id?: string;
  kodePemesanan?: string;
  kategori?: string;
  instansiId?: string;
  picId?: string;
  namaInstansi?: string;
  namaPIC?: string;
  noTelpPIC?: string;
  alamat?: string;
  kota?: string;
  provinsi?: string;
  kebutuhanSPJ?: string;
  tglPrint?: string;
  picPrint?: string;
  tglPengiriman?: string;
  statusPesanan?: string;
  tanggalOrder?: string;
  jumlahRangkap?: string;
  jenisKertas?: string;
  jenisFile?: string;
  tglUpdateList?: string;
  tglTandaTangan?: string;
  tglSign?: string;
  tglParaf?: string;
  spj_id?: number | string;
}



export const spjApi = {
  findAll: async (): Promise<SPJData[]> => {
    const spjRes = await apiClient.get('/api/spj');
    const spjs = spjRes.data.data || [];

    return spjs.map((spj: Order & SPJ & Record<string, unknown>) => ({
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

  findById: async (id: string): Promise<SPJData> => {
    let spj = null;
    try {
      const spjRes = await apiClient.get(`/api/spj/${id}`);
      spj = spjRes.data?.data;
    } catch (e) {
      console.warn("GET /api/spj/:id failed, falling back to findAll", e);
    }

    if (!spj) {
      const allSpjRes = await apiClient.get('/api/spj');
      const spjs = allSpjRes.data?.data || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      spj = spjs.find((s: any) => String(s.id) === id);
    }

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
      tanggalOrder: spj.created_at || spj.tanggal_po || '',
    };
  },
  create: async (payload: Partial<SPJData>): Promise<SPJData> => {
    
    const parsedInstansiId = (payload.namaInstansi && !isNaN(Number(payload.namaInstansi))) ? Number(payload.namaInstansi) : 0;
    const parsedPicId = (payload.namaPIC && !isNaN(Number(payload.namaPIC))) ? Number(payload.namaPIC) : 0;

    const spjPayload = {
      kode_order: `SPJ-${Date.now()}`,
      instansi_id: parsedInstansiId,
      instansi: parsedInstansiId === 0 && payload.namaInstansi ? {
        nama_instansi: payload.namaInstansi,
      } : undefined,
      pic_id: parsedPicId,
      pic: parsedPicId === 0 && payload.namaPIC ? {
        nama_pic: payload.namaPIC,
      } : undefined,
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

    const spjRes = await apiClient.post('/api/spj', spjPayload);
    return spjRes.data;
  },

  update: async (id: string, payload: Partial<SPJData>): Promise<SPJData> => {
    const spjRes = await apiClient.get(`/api/spj/${id}`);
    const spjData = spjRes.data.data;
    if (!spjData) throw new Error("SPJ not found");

    const parsedInstansiId = payload.namaInstansi !== undefined 
      ? ((payload.namaInstansi && !isNaN(Number(payload.namaInstansi))) ? Number(payload.namaInstansi) : 0) 
      : spjData.instansi_id;

    const parsedPicId = payload.namaPIC !== undefined
      ? ((payload.namaPIC && !isNaN(Number(payload.namaPIC))) ? Number(payload.namaPIC) : 0)
      : spjData.pic_id;

    const spjUpdateData = {
      ...spjData,
      instansi_id: parsedInstansiId,
      instansi: parsedInstansiId === 0 && payload.namaInstansi ? { nama_instansi: payload.namaInstansi } : undefined,
      pic_id: parsedPicId,
      pic: parsedPicId === 0 && payload.namaPIC ? { nama_pic: payload.namaPIC } : undefined,
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

    await apiClient.put(`/api/spj/${id}`, spjUpdateData);
    return { id, ...payload } as SPJData;
  },

  updateStatus: async (id: string, status: string): Promise<SPJData> => {
    const spjRes = await apiClient.get(`/api/spj/${id}`);
    const spjData = spjRes.data.data;
    if (!spjData) throw new Error("SPJ not found");
    
    spjData.status = status;
    await apiClient.put(`/api/spj/${id}`, spjData);
    return { id, statusPesanan: status };
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/spj/${id}`);
  },

  exportExcel: async () => {
    const response = await apiClient.get('/api/spj/export', {
      
      responseType: 'blob',
    })
    return response.data
  },

  importExcel: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post('/api/spj/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }
}
