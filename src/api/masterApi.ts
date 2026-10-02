import axios from 'axios'
import type { BackendResponse, MasterInstansi as BInstansi, MasterPIC as BPIC, MasterWilayah as BWilayah, MasterEkspedisi as BEkspedisi, MasterProduk as BProduk } from '@/types/backend';

export interface MasterInstansi {
  id: string;
  namaInstansi: string;
  nik: string;
  npwp: string;
  alamat: string;
  provinsi: string;
  kotaKab: string;
}

export interface MasterPIC {
  id: string;
  instansiId: string;
  namaPIC: string;
  nik: string;
  email: string;
  noTelp: string;
}

export interface MasterProduk {
  id: string;
  kodeProduk: string;
  namaProduk: string;
  jenisProduk: string;
  harga: number;
}

export interface MasterEkspedisi {
  id: string;
  namaEkspedisi: string;
}

export interface MasterWilayah {
  id: string;
  namaWilayah: string;

  provinsi: string;
  kotaKab: string;
  alamat: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const masterApi = {
  getOptions: async () => {
    const res = await axios.get('/api/options', { headers: getAuthHeaders() });
    return res.data.data || {};
  },
  getInstansi: async (): Promise<MasterInstansi[]> => {
    const res = await axios.get<BackendResponse<BInstansi[]>>('/api/instansi', { headers: getAuthHeaders() });
    const data = res.data.data || [];
    return data.map((d: BInstansi) => ({
      id: String(d.id),
      namaInstansi: (d.nama_instansi as string) || '',
      nik: (d.nik as string) || '',
      npwp: (d.npwp as string) || '',
      alamat: (d.alamat as string) || '',
      provinsi: (d.provinsi as string) || '',
      kotaKab: (d.kota_kab as string) || ''
    }));
  },
  addInstansi: async (data: Omit<MasterInstansi, 'id'>) => {
    const payload = {
      nama_instansi: data.namaInstansi,
      nik: data.nik || '',
      npwp: data.npwp,
      alamat: data.alamat,
      provinsi: data.provinsi,
      kota_kab: data.kotaKab
    };
    const res = await axios.post('/api/instansi', payload, { headers: getAuthHeaders() });
    return res.data;
  },
  updateInstansi: async (data: MasterInstansi) => {
    const payload = {
      nama_instansi: data.namaInstansi,
      nik: data.nik || '',
      npwp: data.npwp,
      alamat: data.alamat,
      provinsi: data.provinsi,
      kota_kab: data.kotaKab
    };
    const res = await axios.put(`/api/instansi/${data.id}`, payload, { headers: getAuthHeaders() });
    return res.data;
  },
  deleteInstansi: async (id: string) => {
    await axios.delete(`/api/instansi/${id}`, { headers: getAuthHeaders() });
  },

  getPIC: async (): Promise<MasterPIC[]> => {
    const res = await axios.get<BackendResponse<BPIC[]>>('/api/pic', { headers: getAuthHeaders() });
    const data = res.data.data || [];
    return data.map((d: BPIC) => ({
      id: String(d.id),
      instansiId: String(d.instansi_id),
      namaPIC: (d.nama_pic as string) || '',
      nik: (d.nik as string) || '',
      email: (d.email as string) || '',
      noTelp: (d.no_hp as string) || ''
    }));
  },
  addPIC: async (data: Omit<MasterPIC, 'id'>) => {
    const payload = {
      instansi_id: Number(data.instansiId),
      nama_pic: data.namaPIC,
      nik: data.nik,
      email: data.email,
      no_hp: data.noTelp
    };
    const res = await axios.post('/api/pic', payload, { headers: getAuthHeaders() });
    return res.data;
  },
  updatePIC: async (data: MasterPIC) => {
    const payload = {
      instansi_id: Number(data.instansiId),
      nama_pic: data.namaPIC,
      nik: data.nik,
      email: data.email,
      no_hp: data.noTelp
    };
    const res = await axios.put(`/api/pic/${data.id}`, payload, { headers: getAuthHeaders() });
    return res.data;
  },
  deletePIC: async (id: string) => {
    await axios.delete(`/api/pic/${id}`, { headers: getAuthHeaders() });
  },

    getProduk: async (): Promise<MasterProduk[]> => {
    const res = await axios.get<BackendResponse<BProduk[]>>("/api/produk", { headers: getAuthHeaders() });
    const data = res.data.data || [];
    return data.map((d: BProduk) => ({
      id: String(d.id),
      kodeProduk: (d.kode_produk as string) || "",
      namaProduk: (d.nama_produk as string) || "",
      jenisProduk: (d.jenis_produk as string) || "",
      harga: Number(d.harga) || 0
    }));
  },
  addProduk: async (data: Omit<MasterProduk, "id">) => {
    const payload = {
      kode_produk: data.kodeProduk,
      nama_produk: data.namaProduk,
      jenis_produk: data.jenisProduk,
      harga: Number(data.harga),
      status: 1
    };
    const res = await axios.post("/api/produk", payload, { headers: getAuthHeaders() });
    return res.data;
  },
  updateProduk: async (data: MasterProduk) => {
    const payload = {
      kode_produk: data.kodeProduk,
      nama_produk: data.namaProduk,
      jenis_produk: data.jenisProduk,
      harga: Number(data.harga),
      status: 1
    };
    const res = await axios.put(`/api/produk/${data.id}`, payload, { headers: getAuthHeaders() });
    return res.data;
  },
  deleteProduk: async (id: string) => {
    await axios.delete(`/api/produk/${id}`, { headers: getAuthHeaders() });
  },

  getEkspedisi: async (): Promise<MasterEkspedisi[]> => {
    const res = await axios.get<BackendResponse<BEkspedisi[]>>('/api/ekspedisi', { headers: getAuthHeaders() });
    const data = res.data.data || [];
    return data.map((d: BEkspedisi) => ({
      id: String(d.id),
      namaEkspedisi: (d.nama_ekspedisi as string) || ''
    }));
  },
  addEkspedisi: async (data: Omit<MasterEkspedisi, 'id'>) => {
    const payload = {
      nama_ekspedisi: data.namaEkspedisi,
      status: 1
    };
    const res = await axios.post('/api/ekspedisi', payload, { headers: getAuthHeaders() });
    return res.data;
  },
  updateEkspedisi: async (data: MasterEkspedisi) => {
    const payload = {
      nama_ekspedisi: data.namaEkspedisi,
      status: 1
    };
    const res = await axios.put(`/api/ekspedisi/${data.id}`, payload, { headers: getAuthHeaders() });
    return res.data;
  },
  deleteEkspedisi: async (id: string) => {
    await axios.delete(`/api/ekspedisi/${id}`, { headers: getAuthHeaders() });
  },

  getWilayah: async (): Promise<MasterWilayah[]> => {
    const res = await axios.get<BackendResponse<BWilayah[]>>('/api/wilayah', { headers: getAuthHeaders() });
    const data = res.data.data || [];
    return data.map((d: BWilayah) => ({
      id: String(d.id),
      namaWilayah: (d.provinsi as string) || '',

      provinsi: (d.provinsi as string) || '',
      kotaKab: (d.kota_kab as string) || '',
      alamat: (d.alamat as string) || ''
    }));
  },
  addWilayah: async (data: Omit<MasterWilayah, 'id'>) => {
    const payload = {
      provinsi: data.provinsi,
      kota_kab: data.kotaKab,
      alamat: data.alamat || ''
    };
    const res = await axios.post('/api/wilayah', payload, { headers: getAuthHeaders() });
    return res.data;
  },
  updateWilayah: async (data: MasterWilayah) => {
    const payload = {
      provinsi: data.provinsi,
      kota_kab: data.kotaKab,
      alamat: data.alamat || ''
    };
    const res = await axios.put(`/api/wilayah/${data.id}`, payload, { headers: getAuthHeaders() });
    return res.data;
  },
  deleteWilayah: async (id: string) => {
    await axios.delete(`/api/wilayah/${id}`, { headers: getAuthHeaders() });
  }
};
