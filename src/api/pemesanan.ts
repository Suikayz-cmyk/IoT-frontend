/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type { BackendResponse, Order, OrderProcurement, Payment, OrderInaproc, OrderManual } from '@/types/backend';

export type KategoriPemesanan = 'IoT Inaproc' | 'Timbangan Inaproc' | 'IoT Manual' | 'Timbangan Manual' | 'RCW-360 PRO HYBRID (GSM+WIFI)' | 'RCW-800W (LITE)' | ''

export interface PemesananData {
  id: string
  createdAt?: string
  updatedAt?: string
  kategori: KategoriPemesanan
  kodePemesanan: string

  namaInstansi: string
  namaPIC: string
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

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const pemesananApi = {
  getAll: async (): Promise<PemesananData[]> => {
    const res = await axios.get<BackendResponse<Order[]>>('/api/orders', { headers: getAuthHeaders() })
    const orders = res.data.data || res.data || []
    
    return orders.map((order: Order) => {
      const calculatedHarga = (order.items && Array.isArray(order.items) && order.items.length > 0)
        ? order.items.reduce((sum: number, item: any) => sum + (item.subtotal || 0), 0)
        : (order.harga_ppn || 0);

      let kategoriVal = order.kategori_order;
      if (kategoriVal === 'iot_inaproc') kategoriVal = 'IoT Inaproc';
      else if (kategoriVal === 'timbangan_inaproc') kategoriVal = 'Timbangan Inaproc';
      else if (kategoriVal === 'iot_manual') kategoriVal = 'IoT Manual';
      else if (kategoriVal === 'timbangan_manual') kategoriVal = 'Timbangan Manual';
      else if (!kategoriVal) {
        kategoriVal = (order.keterangan ? String(order.keterangan).split(' - ')[0] : '') || (String(order.jenis_order).toLowerCase() === 'inaproc' ? 'IoT Inaproc' : 'IoT Manual');
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
        kota: order.instansi?.kota_kab || (order.instansi as any)?.kota || "",
        provinsi: order.instansi?.provinsi || "",

        quantity: order.qty || (order.items && order.items.length > 0 ? order.items.reduce((sum: number, item: any) => sum + (item.qty || 0), 0) : 0),
        hargaPPN: String(calculatedHarga),
        statusPesanan: order.status,
        statusOdoo: order.status_odoo,
        tanggalPesananPO: order.tanggal_po || order.tanggal_order,
      }
    })
  },

  getById: async (id: string): Promise<PemesananData> => {
    const res = await axios.get<BackendResponse<Order>>(`/api/orders/${id}`, { headers: getAuthHeaders() })
    const order = res.data.data || res.data

    let specificData: Partial<OrderInaproc & OrderManual> = {}
    
    try {
      if (order.jenis_order?.toUpperCase() === 'INAPROC' || order.jenis_order === 'inaproc') {
        const specRes = await axios.get<BackendResponse<OrderInaproc>>(`/api/inaproc/order/${id}`, { headers: getAuthHeaders() })
        specificData = specRes.data?.data || {}
      } else {
        const specRes = await axios.get<BackendResponse<OrderManual>>(`/api/manual/order/${id}`, { headers: getAuthHeaders() })
        specificData = specRes.data?.data || {}
      }
    } catch (e) {
      console.warn('Specific detail not found or error', e)
    }

    let paymentData: Partial<Payment> = {}
    try {
      const payRes = await axios.get<BackendResponse<Payment[] | Payment>>(`/api/payments/order/${id}`, { headers: getAuthHeaders() })
        const pd = payRes.data?.data || {}
        paymentData = Array.isArray(pd) ? (pd[0] || {}) : pd
    } catch (e) {
      console.warn('Payment not found', e)
    }
      let procurementData: Partial<OrderProcurement> = {}
      try {
        const procRes = await axios.get<BackendResponse<OrderProcurement[] | OrderProcurement>>(`/api/order-procurement/order/${id}`, { headers: getAuthHeaders() })
        const prd = procRes.data?.data || procRes.data || {}
        procurementData = Array.isArray(prd) ? (prd[0] || {}) : prd
      } catch (e) {
        console.warn('Procurement not found', e)
      }

    return {
      id: String(order.id),
      kategori: ((order.keterangan ? String(order.keterangan).split(' - ')[0] : '') || (String(order.jenis_order).toLowerCase() === 'inaproc' ? 'IoT Inaproc' : 'IoT Manual')) as KategoriPemesanan,
      kodePemesanan: order.kode_order,
      namaInstansi: order.instansi?.nama_instansi || (order.instansi_id ? String(order.instansi_id) : ''),
        noNPWP: order.instansi?.npwp || '',
        alamat: order.instansi?.alamat || '',
        kota: order.instansi?.kota_kab || (order.instansi as any)?.kota || '',
        provinsi: order.instansi?.provinsi || '',
      namaPIC: order.pic?.nama_pic || (order.pic_id ? String(order.pic_id) : ''),
      createdAt: order.created_at || '',
      updatedAt: order.updated_at || '',
      noTelpPIC: order.pic?.no_hp || "",
        emailPIC: order.pic?.email || "",
        nikPIC: order.pic?.nik || "",

      quantity: order.qty || (order.items && order.items.length > 0 ? order.items.reduce((sum: number, item: any) => sum + (item.qty || 0), 0) : 0),
      hargaPPN: String(order.harga_ppn || (order.items && order.items.length > 0 ? order.items.reduce((sum: number, item: any) => sum + (item.subtotal || 0), 0) : 0)),
      statusPesanan: order.status,
      statusOdoo: order.status_odoo,
      tanggalPesananPO: order.tanggal_po || order.tanggal_order || specificData.tanggal_po,
      nomorPOKUT: procurementData.no_po_kut || order.no_po || specificData.no_po,
      nomorBAST: order.no_bast || specificData.no_bast,
      tanggalBAST: order.tanggal_bast || specificData.tanggal_bast,
      nomorInvoiceInaproc: order.no_invoice_inaproc || specificData.no_invoice_inaproc,
      kodeBayar: order.kode_bayar || specificData.kode_bayar,
      nsfp: order.nsfp || specificData.nsfp,
      nomorInvoiceKUT: procurementData.no_invoice_kut || (order as any).no_invoice_kut || specificData.no_invoice_kut || specificData.nomor_invoice,
        tanggalInvoiceKUT: procurementData.tanggal_invoice_kut,
        nomorPenyampaianDaftarHarga: procurementData.nomor_surat_penyampaian_daftar_harga,
        nomorFormulirPembelian: procurementData.nomor_formulir_pembelian,
      bulanPengirimanSPH: (order as any).bulan_pengiriman || specificData.bulan_pengiriman,
      nomorSuratPenawaranHarga: (order as any).nama_surat || specificData.nama_surat,
      periodeBerlangganan: order.periode_langganan || specificData.periode_langganan,
      
      tanggalUangMasuk: paymentData.tanggal_uang_masuk,
      jumlahUangMasuk: String(paymentData.jumlah_uang_masuk || 0),
      rekeningPenerima: paymentData.rekening,
      keterangan: order.keterangan ? (String(order.keterangan).includes(' - ') && String(order.keterangan).split(' - ')[0].includes('IoT') ? String(order.keterangan).split(' - ').slice(1).join(' - ') : order.keterangan) : ''
    }
  },

  create: async (payload: Omit<PemesananData, 'id'>): Promise<PemesananData> => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    let endpoint: string;
    let payloadData: any;

    const baseOrder = {
      kode_order: payload.kodePemesanan,
      instansi_id: (payload.namaInstansi && !isNaN(Number(payload.namaInstansi))) ? Number(payload.namaInstansi) : null,
      pic_id: (payload.namaPIC && !isNaN(Number(payload.namaPIC))) ? Number(payload.namaPIC) : null,
      status: payload.statusPesanan || 'Diproses',
      status_odoo: payload.statusOdoo || '',
      nsfp: payload.nsfp || '',
      no_bast: payload.nomorBAST || '',
      keterangan: payload.kategori + (payload.keterangan ? ' - ' + payload.keterangan : ''),
      tanggal_po: payload.tanggalPesananPO || null,
      no_po: payload.nomorPOKUT || '',
      periode_langganan: payload.periodeBerlangganan || '',
      tanggal_bast: payload.tanggalBAST || null,
    };

    const items = payload.produkId ? [{
      produk_id: Number(payload.produkId),
      qty: payload.quantity ? Number(payload.quantity) : 1,
      harga: 0,
      ppn: 0,
      subtotal: payload.hargaPPN ? parseFloat(payload.hargaPPN.replace(/[^0-9.-]+/g, '')) : 0
    }] : [];

    const payment = (payload.tanggalUangMasuk || payload.jumlahUangMasuk || payload.rekeningPenerima) ? {
      jumlah_uang_masuk: payload.jumlahUangMasuk ? parseFloat(payload.jumlahUangMasuk.replace(/[^0-9.-]+/g, '')) : 0,
      tanggal_uang_masuk: payload.tanggalUangMasuk || null,
      status: 'LUNAS',
      rekening: payload.rekeningPenerima || '',
    } : null;

    const procurement = {
      no_invoice_kut: payload.nomorInvoiceKUT || '',
      tanggal_invoice_kut: payload.tanggalInvoiceKUT || null
    };

    if (payload.kategori === 'IoT Inaproc') {
      endpoint = '/api/iot-inaproc';
      payloadData = {
        ...baseOrder,
        kode_bayar: payload.kodeBayar || '',
        no_invoice_inaproc: payload.nomorInvoiceInaproc || '',
        items,
        procurement,
        payment: payment || undefined
      };
    } else if (payload.kategori === 'IoT Manual') {
      endpoint = '/api/iot-manual';
      payloadData = {
        ...baseOrder,
        nomor_formulir_berlangganan: payload.nomorFormulirBerlangganan || '',
        nomor_surat_penawaran_harga: payload.nomorSuratPenawaranHarga || '',
        bulan_pengiriman_sph: payload.bulanPengirimanSPH || '',
        waktu_pengiriman: payload.bulanPengirimanSPH || '',
        nama_surat: payload.nomorSuratPenawaranHarga || '',
        nomor_kontrak_berlangganan: payload.nomorKontrakBerlangganan || '',
        items,
        procurement,
        payment: payment || undefined
      };
    } else {
      endpoint = '/api/timbangan';
      let katOrder = 'timbangan_manual';
      if (payload.kategori === 'Timbangan Inaproc') katOrder = 'timbangan_inaproc';
      else if (payload.kategori?.includes('RCW-360')) katOrder = 'rcw_360';
      else if (payload.kategori?.includes('RCW-800')) katOrder = 'rcw_800';

      payloadData = {
        ...baseOrder,
        jenis_order: payload.kategori?.toLowerCase().includes('inaproc') ? 'inaproc' : 'manual',
        kategori_order: katOrder,
        kode_bayar: payload.kodeBayar || '',
        no_invoice_inaproc: payload.nomorInvoiceInaproc || '',
        items,
        procurement: {
          ...procurement,
          no_po_kut: payload.nomorPOKUT || '',
          nomor_surat_penyampaian_daftar_harga: payload.nomorPenyampaianDaftarHarga || '',
          nomor_formulir_pembelian: payload.nomorFormulirPembelian || ''
        },
        pricing: {
          tipe_timbangan: payload.tipeTimbangan || '',
          harga_produk: payload.harga ? parseFloat(payload.harga.replace(/[^0-9.-]+/g, '')) : 0,
          harga_ppn: payload.ppn11 ? parseFloat(payload.ppn11.replace(/[^0-9.-]+/g, '')) : 0,
          harga_ongkir_kut: (payload as any).ongkosKirimKUT ? parseFloat((payload as any).ongkosKirimKUT.replace(/[^0-9.-]+/g, '')) : 0,
          harga_ppn_ongkir: (payload as any).ppnOngkir ? parseFloat((payload as any).ppnOngkir.replace(/[^0-9.-]+/g, '')) : 0,
          total_harga_ongkir: (payload as any).totalOngkir ? parseFloat((payload as any).totalOngkir.replace(/[^0-9.-]+/g, '')) : 0,
          total_harga_jual: (payload as any).totalHargaJual ? parseFloat((payload as any).totalHargaJual.replace(/[^0-9.-]+/g, '')) : 0,
          harga_produk_reseller: (payload as any).hargaProdukReseller ? parseFloat((payload as any).hargaProdukReseller.replace(/[^0-9.-]+/g, '')) : 0,
          harga_ppn_reseller: (payload as any).ppn11Reseller ? parseFloat((payload as any).ppn11Reseller.replace(/[^0-9.-]+/g, '')) : 0,
          harga_ongkir_reseller: (payload as any).ongkirReseller ? parseFloat((payload as any).ongkirReseller.replace(/[^0-9.-]+/g, '')) : 0,
          harga_ppn_ongkir_reseller: (payload as any).ppnOngkirReseller ? parseFloat((payload as any).ppnOngkirReseller.replace(/[^0-9.-]+/g, '')) : 0,
          total_harga_ongkir_reseller: (payload as any).totalOngkirReseller ? parseFloat((payload as any).totalOngkirReseller.replace(/[^0-9.-]+/g, '')) : 0,
          total_harga_reseller: (payload as any).totalHargaReseller ? parseFloat((payload as any).totalHargaReseller.replace(/[^0-9.-]+/g, '')) : 0
        },
        payment: payment || undefined,
        shipment: {
          wilayah_id: (payload as any).provinsiId ? Number((payload as any).provinsiId) : null,
          ekspedisi_id: (payload as any).ekspedisiId ? Number((payload as any).ekspedisiId) : null,
          resi: (payload as any).resi || '',
          berat: payload.berat ? Number(payload.berat) : 0,
          ongkir: (payload as any).ongkosKirimKUT ? parseFloat((payload as any).ongkosKirimKUT.replace(/[^0-9.-]+/g, '')) : 0,
          tanggal_kirim: (payload as any).tanggalKirim || null,
          tanggal_diterima: (payload as any).tanggalDiterima || null,
          status_pengiriman: (payload as any).statusPengiriman || ''
        }
      };
    }

    let orderRes;
    try {
      orderRes = await axios.post(endpoint, payloadData, { headers });
    } catch (e) {
      console.error('Failed to create order', e);
      throw new Error('Gagal membuat Order di database', { cause: e });
    }

    return (orderRes.data?.data || {}) as PemesananData;
  },
  update: async (id: string, payload: Partial<PemesananData>): Promise<PemesananData> => {
    const orderData: any = {};
    if (payload.kodePemesanan !== undefined) orderData.kode_order = payload.kodePemesanan;
    if (payload.kategori !== undefined) orderData.jenis_order = payload.kategori.includes('Inaproc') ? 'inaproc' : 'manual';
    if (payload.namaInstansi !== undefined) orderData.instansi_id = !isNaN(Number(payload.namaInstansi)) ? Number(payload.namaInstansi) : null;
    if (payload.namaPIC !== undefined) orderData.pic_id = !isNaN(Number(payload.namaPIC)) ? Number(payload.namaPIC) : null;
    if (payload.statusPesanan !== undefined) orderData.status = payload.statusPesanan;
    if (payload.statusOdoo !== undefined) orderData.status_odoo = payload.statusOdoo;
    if (payload.quantity !== undefined) orderData.qty = Number(payload.quantity);
    if (payload.hargaPPN !== undefined) orderData.harga_ppn = parseFloat(payload.hargaPPN.replace(/[^0-9.-]+/g, ''));

    if (Object.keys(orderData).length > 0) {
      await axios.put(`/api/orders/${id}`, orderData, { headers: getAuthHeaders() });
    }
    
    return { id, ...payload } as any;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`/api/orders/${id}`, { headers: getAuthHeaders() });
  }
}
