import { KATEGORI } from '@/constants/options';
import apiClient from './client'
import type { BackendResponse, Order, OrderItem } from '@/types/backend';
import type { KategoriOption } from '@/constants/options';

export type KategoriPemesanan = KategoriOption | ''

export interface PemesananData {
  id: string
  createdAt?: string
  updatedAt?: string
  kategori: KategoriPemesanan
  kodePemesanan: string

  namaInstansi: string
  namaPIC: string
  instansiId?: string
  picId?: string
  produkId?: string
  noTelpPIC: string
  emailPIC: string
  nikPIC: string
  noNPWP: string
  alamat: string
  kota: string
  provinsi: string

  quantity?: number
  periodeBerlangganan?: string
  hargaPPN?: string
  statusPesanan?: string
  statusOdoo?: string
  tipeTimbangan?: string
  wilayahPengiriman?: string
  berat?: number
  ekspedisi?: string
  nomorResi?: string
  tanggalBarangDiterima?: string
  harga?: string
  ppn11?: string
  ongkirKUT?: string
  hargaPPN11Ongkir?: string
  totalHargaOngkir?: string
  totalHargaJual?: string
  hargaProdukReseller?: string
  hargaPPN11OngkirReseller?: string
  ppn11Reseller?: string
  ongkirReseller?: string
  hargaPPN11PlusOngkirReseller?: string
  totalHargaOngkirReseller?: string
  totalHargaReseller?: string
  nomorPenyampaianDaftarHarga?: string
  nomorFormulirPembelian?: string
  bulanPengirimanSPH?: string
  nomorSuratPenawaranHarga?: string
  nomorFormulirBerlangganan?: string
  nomorKontrakBerlangganan?: string

  tanggalPesananPO?: string
  nomorPOKUT?: string
  tanggalBAST?: string
  nomorBAST?: string
  nomorInvoiceKUT?: string
  tanggalInvoiceKUT?: string
  nomorInvoiceInaproc?: string
  nsfp?: string
  tanggalUangMasuk?: string
  jumlahUangMasuk?: string
  rekeningPenerima?: string
  kodeBayar?: string
  keterangan?: string
}

import { buildPayloadAndEndpoint, transformOrderToPemesananData } from './pemesanan.transformers';

export const pemesananApi = {
  exportExcel: async (): Promise<Blob> => {
    const res = await apiClient.get('/api/orders/export', { 
      
      responseType: 'blob'
    })
    return res.data
  },
  getAll: async (): Promise<PemesananData[]> => {
    const res = await apiClient.get<BackendResponse<Order[]>>('/api/orders')
    const orders = res.data.data || res.data || []
    
    return orders.map((order: Order) => {
      const calculatedHarga = (order.items && Array.isArray(order.items) && order.items.length > 0)
        ? order.items.reduce((sum: number, item: OrderItem) => sum + (item.subtotal || 0), 0)
        : (order.harga_ppn || 0);

      let kategoriVal = order.kategori_order;
      if (kategoriVal === 'iot_inaproc') kategoriVal = KATEGORI.IOT_INAPROC;
      else if (kategoriVal === 'timbangan_inaproc') kategoriVal = KATEGORI.TIMBANGAN_INAPROC;
      else if (kategoriVal === 'iot_manual') kategoriVal = KATEGORI.IOT_MANUAL;
      else if (kategoriVal === 'timbangan_manual') kategoriVal = KATEGORI.TIMBANGAN_MANUAL;
      else if (kategoriVal === 'rcw_360') kategoriVal = KATEGORI.RCW_360;
      else if (kategoriVal === 'rcw_800w') kategoriVal = KATEGORI.RCW_800W;
      else if (!kategoriVal) {
        kategoriVal = (order.keterangan ? String(order.keterangan).split(' - ')[0] : '') || (String(order.jenis_order).toLowerCase() === 'inaproc' ? KATEGORI.IOT_INAPROC : KATEGORI.IOT_MANUAL);
      }

      const instansiName = order.instansi?.nama_instansi || (order.instansi_id ? String(order.instansi_id) : '');
      const picName = order.pic?.nama_pic || (order.pic_id ? String(order.pic_id) : '');
    
    return {
        id: String(order.id),
        kategori: kategoriVal as KategoriPemesanan,
        kodePemesanan: order.kode_order,
        namaInstansi: instansiName,
        namaPIC: picName,
        createdAt: order.created_at || '',
        updatedAt: order.updated_at || '',
        noTelpPIC: order.pic?.no_hp || "",
        emailPIC: order.pic?.email || "",
        nikPIC: order.pic?.nik || "",
        noNPWP: order.instansi?.npwp || "",
        alamat: order.instansi?.alamat || "",
        kota: order.instansi?.kota_kab || order.instansi?.kota_kab || "",
        provinsi: order.instansi?.provinsi || "",

        quantity: order.qty || (order.items && order.items.length > 0 ? order.items.reduce((sum: number, item: OrderItem) => sum + (item.qty || 0), 0) : 0),
        hargaPPN: String(calculatedHarga),
        statusPesanan: order.status,
        statusOdoo: order.status_odoo,
        tanggalPesananPO: order.tanggal_po || order.tanggal_order,
      }
    })
  },

  getById: async (id: string): Promise<PemesananData> => {
    // 1. Gunakan Promise.any untuk mencoba semua endpoint spesifik secara bersamaan
    // Ini jauh lebih cepat daripada mengunduh SELURUH pesanan (GET /api/orders) hanya untuk mengecek kategori.
    // GET /api/orders/:id di backend saat ini error/panic karena salah Preload("Inaproc").
    const endpoints = [
      `/api/iot-inaproc/${id}`,
      `/api/timbangan/${id}`,
      `/api/iot-manual/${id}`
    ];

    const fetchEndpoint = async (url: string) => {
      const res = await apiClient.get<BackendResponse<Order>>(url);
      if (!res.data || (!res.data.data && res.data.success === false)) {
        throw new Error(`Not found in ${url}`);
      }
      return res;
    };

    let res;
    try {
      res = await Promise.any(endpoints.map(url => fetchEndpoint(url)));
    } catch (_error) {
      throw new Error("Pesanan tidak ditemukan di kategori mana pun", { cause: _error });
    }

    const order = res.data.data || res.data;

    return transformOrderToPemesananData(order);
  },

  create: async (payload: Omit<PemesananData, 'id'>): Promise<PemesananData> => {
    const { endpoint, payloadData } = await buildPayloadAndEndpoint(payload);
    const res = await apiClient.post(endpoint, payloadData);
    return { id: String(res.data.data?.id || res.data?.id), ...payload } as PemesananData;
  },

  update: async (id: string, payload: Partial<PemesananData>): Promise<PemesananData> => {
    const { endpoint, payloadData } = await buildPayloadAndEndpoint(payload);
    await apiClient.put(`${endpoint}/${id}`, payloadData);
    return { id, ...payload } as PemesananData;
  },

  updateOrderStatus: async (id: string, field: 'status' | 'status_odoo', value: string): Promise<void> => {
    let finalValue = value;
    if (field === 'status' && value.toLowerCase() === 'dikirim') {
      finalValue = 'Dikirim';
    }
    
    await apiClient.put(`/api/orders/${id}`, { [field]: finalValue });
  },

  delete: async ({ id, kategori }: { id: string, kategori: string }): Promise<void> => {
    let endpoint = "/api/timbangan";
    if (kategori === KATEGORI.IOT_INAPROC) {
      endpoint = "/api/iot-inaproc";
    } else if (kategori === KATEGORI.IOT_MANUAL) {
      endpoint = "/api/iot-manual";
    }
    await apiClient.delete(`${endpoint}/${id}`);
  }
}

