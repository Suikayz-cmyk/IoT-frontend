import apiClient from './client'
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



export const masterApi = {
  getOptions: async () => {
    const res = await apiClient.get('/api/options');
    return res.data.data || {};
  },
  getInstansi: async (): Promise<MasterInstansi[]> => {
    const res = await apiClient.get<BackendResponse<BInstansi[]>>('/api/instansi');
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
    const res = await apiClient.post('/api/instansi', payload);
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
    const res = await apiClient.put(`/api/instansi/${data.id}`, payload);
    return res.data;
  },
  deleteInstansi: async (id: string) => {
    await apiClient.delete(`/api/instansi/${id}`);
  },

  getPIC: async (): Promise<MasterPIC[]> => {
    const res = await apiClient.get<BackendResponse<BPIC[]>>('/api/pic');
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
    const res = await apiClient.post('/api/pic', payload);
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
    const res = await apiClient.put(`/api/pic/${data.id}`, payload);
    return res.data;
  },
  deletePIC: async (id: string) => {
    await apiClient.delete(`/api/pic/${id}`);
  },

    getProduk: async (): Promise<MasterProduk[]> => {
    const res = await apiClient.get<BackendResponse<BProduk[]>>("/api/produk");
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
    const res = await apiClient.post("/api/produk", payload);
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
    const res = await apiClient.put(`/api/produk/${data.id}`, payload);
    return res.data;
  },
  deleteProduk: async (id: string) => {
    await apiClient.delete(`/api/produk/${id}`);
  },

  getEkspedisi: async (): Promise<MasterEkspedisi[]> => {
    const res = await apiClient.get<BackendResponse<BEkspedisi[]>>('/api/ekspedisi');
    const data = res.data.data || [];
    return data.map((d: BEkspedisi) => ({
      id: String(d.id),
      namaEkspedisi: (d.nama_ekspedisi as string) || ''
    }));
  },
  addEkspedisi: async (data: Omit<MasterEkspedisi, 'id'>) => {
    const payload = {
      nama_ekspedisi: data.namaEkspedisi,
      status: '1' // backend: MasterEkspedisi.Status bertipe string
    };
    const res = await apiClient.post('/api/ekspedisi', payload);
    return res.data;
  },
  updateEkspedisi: async (data: MasterEkspedisi) => {
    const payload = {
      nama_ekspedisi: data.namaEkspedisi,
      status: '1' // backend: MasterEkspedisi.Status bertipe string
    };
    const res = await apiClient.put(`/api/ekspedisi/${data.id}`, payload);
    return res.data;
  },
  deleteEkspedisi: async (id: string) => {
    await apiClient.delete(`/api/ekspedisi/${id}`);
  },

  getWilayah: async (): Promise<MasterWilayah[]> => {
    const res = await apiClient.get<BackendResponse<BWilayah[]>>('/api/wilayah');
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
    const res = await apiClient.post('/api/wilayah', payload);
    return res.data;
  },
  updateWilayah: async (data: MasterWilayah) => {
    const payload = {
      provinsi: data.provinsi,
      kota_kab: data.kotaKab,
      alamat: data.alamat || ''
    };
    const res = await apiClient.put(`/api/wilayah/${data.id}`, payload);
    return res.data;
  },
  deleteWilayah: async (id: string) => {
    await apiClient.delete(`/api/wilayah/${id}`);
  }
};
