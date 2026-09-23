/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'

export type KategoriPemesanan = 'IoT Inaproc' | 'Timbangan Inaproc' | 'IoT Manual' | 'Timbangan Manual' | 'RCW-360 PRO HYBRID (GSM+WIFI)' | 'RCW-800W (LITE)' | ''

export interface PemesananData {
  id: string
  kategori: KategoriPemesanan
  kodePemesanan: string

  // Bagian: Data Pemesan (Umum untuk semua kategori)
  namaInstansi: string
  namaPIC: string
  noTelpPIC: string
  emailPIC: string
  nikPIC: string
  noNPWP: string
  alamat: string
  kota: string
  provinsi: string

  // Bagian: Detail ... (Dinamis berdasarkan kategori)
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
  hargaPPN11OngkirReseller?: string
  ppn11Reseller?: string
  ongkirReseller?: string
  totalHargaOngkirReseller?: string
  totalHargaReseller?: string
  nomorPenyampaianDaftarHarga?: string
  nomorFormulirPembelian?: string
  bulanPengirimanSPH?: string
  nomorSuratPenawaranHarga?: string
  nomorFormulirBerlangganan?: string
  nomorKontrakBerlangganan?: string

  // Bagian: Detail Purchase Order (Umum untuk semua kategori)
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

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const pemesananApi = {
  getAll: async (): Promise<PemesananData[]> => {
    const res = await axios.get('/api/orders', { headers: getAuthHeaders() })
    const orders = res.data.data || res.data || []
    
    return orders.map((order: any) => ({
      id: String(order.id),
      kategori: order.jenis_order === 'INAPROC' ? 'IoT Inaproc' : 'IoT Manual',
      kodePemesanan: order.kode_order,
      namaInstansi: order.instansi_id ? String(order.instansi_id) : '',
      namaPIC: order.pic_id ? String(order.pic_id) : '',
      noTelpPIC: '', emailPIC: '', nikPIC: '', noNPWP: '', alamat: '', kota: '', provinsi: '', // Akan di-map oleh komponen
      quantity: order.qty,
      hargaPPN: String(order.harga_ppn),
      statusPesanan: order.status,
      statusOdoo: order.status_odoo,
      tanggalPesananPO: order.tanggal_order,
    }))
  },

  getById: async (id: string): Promise<PemesananData> => {
    // 1. Fetch Order
    const res = await axios.get(`/api/orders/${id}`, { headers: getAuthHeaders() })
    const order = res.data.data || res.data

    let specificData: any = {}
    
    // 2. Fetch specific detail (Inaproc / Manual)
    try {
      if (order.jenis_order === 'INAPROC') {
        const specRes = await axios.get(`/api/inaproc/order/${id}`, { headers: getAuthHeaders() })
        specificData = specRes.data?.data || {}
      } else {
        const specRes = await axios.get(`/api/manual/order/${id}`, { headers: getAuthHeaders() })
        specificData = specRes.data?.data || {}
      }
    } catch (e) {
      console.warn('Specific detail not found or error', e)
    }

    // 3. Fetch Payment
    let paymentData: any = {}
    try {
      const payRes = await axios.get(`/api/payments/order/${id}`, { headers: getAuthHeaders() })
      paymentData = payRes.data?.data || {}
    } catch (e) {
      console.warn('Payment not found', e)
    }

    return {
      id: String(order.id),
      kategori: order.jenis_order === 'INAPROC' ? 'IoT Inaproc' : 'IoT Manual',
      kodePemesanan: order.kode_order,
      namaInstansi: order.instansi_id ? String(order.instansi_id) : '',
      namaPIC: order.pic_id ? String(order.pic_id) : '',
      noTelpPIC: '', emailPIC: '', nikPIC: '', noNPWP: '', alamat: '', kota: '', provinsi: '',
      quantity: order.qty,
      hargaPPN: String(order.harga_ppn),
      statusPesanan: order.status,
      statusOdoo: order.status_odoo,
      tanggalPesananPO: order.tanggal_order || specificData.tanggal_po,
      nomorPOKUT: specificData.no_po,
      nomorBAST: specificData.no_bast,
      tanggalBAST: specificData.tanggal_bast,
      nomorInvoiceInaproc: specificData.no_invoice_inaproc,
      kodeBayar: specificData.kode_bayar,
      nsfp: specificData.nsfp,
      nomorInvoiceKUT: specificData.no_invoice_kut || specificData.nomor_invoice,
      bulanPengirimanSPH: specificData.bulan_pengiriman,
      nomorSuratPenawaranHarga: specificData.nama_surat,
      periodeBerlangganan: specificData.periode_langganan,
      
      tanggalUangMasuk: paymentData.tanggal_uang_masuk,
      jumlahUangMasuk: String(paymentData.jumlah_uang_masuk || 0),
      rekeningPenerima: paymentData.rekening
    }
  },

  create: async (payload: Omit<PemesananData, 'id'>): Promise<PemesananData> => {
    // 1. Create Order
    const orderData = {
      kode_order: payload.kodePemesanan || `ORD-${Date.now()}`,
      jenis_order: payload.kategori.includes('Inaproc') ? 'INAPROC' : 'MANUAL',
      instansi_id: payload.namaInstansi ? Number(payload.namaInstansi) : null,
      pic_id: payload.namaPIC ? Number(payload.namaPIC) : null,
      status: payload.statusPesanan || '',
      status_odoo: payload.statusOdoo || '',
      qty: payload.quantity ? Number(payload.quantity) : 1,
      harga_ppn: payload.hargaPPN ? parseFloat(payload.hargaPPN.replace(/[^0-9.-]+/g, '')) : 0,
      tanggal_order: new Date().toISOString().split('T')[0],
      keterangan: payload.kategori
    };
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    
    let orderRes;
    try {
      orderRes = await axios.post('/api/orders', orderData, { headers });
    } catch (e) {
      console.error('Failed to create order', e);
      throw new Error('Gagal membuat Order di database', { cause: e });
    }

    const orderId = orderRes.data?.data?.id;
    if (!orderId) throw new Error('Order ID tidak ditemukan dari response');

    // 2. Create Inaproc or Manual
    if (orderData.jenis_order === 'INAPROC') {
      const inaprocData = {
        order_id: orderId,
        no_po: payload.nomorPOKUT || '',
        tanggal_po: payload.tanggalPesananPO || null,
        no_bast: payload.nomorBAST || '',
        tanggal_bast: payload.tanggalBAST || null,
        no_invoice_inaproc: payload.nomorInvoiceInaproc || '',
        kode_bayar: payload.kodeBayar || '',
        nsfp: payload.nsfp || '',
        no_invoice_kut: payload.nomorInvoiceKUT || '',
        bulan_pengiriman: payload.bulanPengirimanSPH || ''
      };
      await axios.post('/api/inaproc', inaprocData, { headers });
    } else {
      const manualData = {
        order_id: orderId,
        nama_surat: payload.nomorSuratPenawaranHarga || '',
        no_po: payload.nomorPOKUT || '',
        tanggal_po: payload.tanggalPesananPO || null,
        no_bast: payload.nomorBAST || '',
        tanggal_bast: payload.tanggalBAST || null,
        periode_langganan: payload.periodeBerlangganan || '',
        nomor_invoice: payload.nomorInvoiceKUT || ''
      };
      await axios.post('/api/manual', manualData, { headers });
    }

    // 3. Create Payment
    if (payload.tanggalUangMasuk || payload.jumlahUangMasuk || payload.rekeningPenerima) {
      const paymentData = {
        order_id: orderId,
        tanggal_uang_masuk: payload.tanggalUangMasuk || null,
        jumlah_uang_masuk: payload.jumlahUangMasuk ? parseFloat(payload.jumlahUangMasuk.replace(/[^0-9.-]+/g, '')) : 0,
        rekening: payload.rekeningPenerima || '',
        status: 'LUNAS',
      };
      await axios.post('/api/payments', paymentData, { headers });
    }

    return orderRes.data;
  },

  update: async (id: string, payload: Partial<PemesananData>): Promise<PemesananData> => {
    const orderData: any = {};
    if (payload.kodePemesanan !== undefined) orderData.kode_order = payload.kodePemesanan;
    if (payload.kategori !== undefined) orderData.jenis_order = payload.kategori.includes('Inaproc') ? 'INAPROC' : 'MANUAL';
    if (payload.namaInstansi !== undefined) orderData.instansi_id = Number(payload.namaInstansi) || null;
    if (payload.namaPIC !== undefined) orderData.pic_id = Number(payload.namaPIC) || null;
    if (payload.statusPesanan !== undefined) orderData.status = payload.statusPesanan;
    if (payload.statusOdoo !== undefined) orderData.status_odoo = payload.statusOdoo;
    if (payload.quantity !== undefined) orderData.qty = Number(payload.quantity);
    if (payload.hargaPPN !== undefined) orderData.harga_ppn = parseFloat(payload.hargaPPN.replace(/[^0-9.-]+/g, ''));

    if (Object.keys(orderData).length > 0) {
      await axios.put(`/api/orders/${id}`, orderData, { headers: getAuthHeaders() });
    }

    // Notice: Updating Inaproc/Manual requires fetching their specific IDs first. 
    // For simplicity, we just trigger order update. 
    // Further complex updates require backend support or sequential ID fetching.
    return { id, ...payload } as any;
  },

  delete: async (id: string): Promise<void> => {
    // Ideally backend handles cascading deletes (Inaproc, Manual, Payment)
    await axios.delete(`/api/orders/${id}`, { headers: getAuthHeaders() });
  }
}
