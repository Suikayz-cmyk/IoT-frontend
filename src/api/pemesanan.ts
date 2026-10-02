/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type { BackendResponse, Order } from '@/types/backend';

export type KategoriPemesanan = 'IoT Inaproc' | 'Timbangan Inaproc' | 'IoT Manual' | 'Timbangan Manual' | 'RCW-360 PRO HYBRID (GSM+WIFI)' | 'RCW-800W (LITE)' | ''

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

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const parseRupiah = (val: any): number => {
  if (!val) return 0;
  return parseFloat(String(val).replace(/\./g, "").replace(/,/g, ".").replace(/[^0-9.-]+/g, "")) || 0;
}

const buildPayloadAndEndpoint = async (payload: Partial<PemesananData>) => {
  let endpoint: string;
  let payloadData: any;

  const baseOrder = {
    kode_order: payload.kodePemesanan || "",
    instansi_id: (payload.namaInstansi && !isNaN(Number(payload.namaInstansi))) ? Number(payload.namaInstansi) : null,
    pic_id: (payload.namaPIC && !isNaN(Number(payload.namaPIC))) ? Number(payload.namaPIC) : null,
    status: payload.statusPesanan || "diproses",
    status_odoo: payload.statusOdoo || "",
    nsfp: payload.nsfp || "",
    no_bast: payload.nomorBAST || "",
    keterangan: (payload.kategori || "") + (payload.keterangan ? " - " + payload.keterangan : ""),
    tanggal_po: payload.tanggalPesananPO || null,
    no_po: payload.nomorPOKUT || "",
    periode_langganan: payload.periodeBerlangganan || "",
    tanggal_bast: payload.tanggalBAST || null,
  };

  let validProdukId = 1;
  try {
    const produkRes = await axios.get("/api/produk", { headers: getAuthHeaders() });
    if (produkRes.data?.data && produkRes.data.data.length > 0) {
      let selectedProduct = produkRes.data.data[0];
      
      const katStr = payload.kategori?.toUpperCase() || "";
      if (katStr.includes("RCW-360")) {
        const match = produkRes.data.data.find((p: any) => p.nama_produk?.toUpperCase().includes("RCW-360"));
        if (match) selectedProduct = match;
      } else if (katStr.includes("RCW-800")) {
        const match = produkRes.data.data.find((p: any) => p.nama_produk?.toUpperCase().includes("RCW-800"));
        if (match) selectedProduct = match;
      } else if (katStr.includes("TIMBANGAN")) {
        const match = produkRes.data.data.find((p: any) => p.nama_produk?.toUpperCase().includes("TIMBANGAN"));
        if (match) selectedProduct = match;
      } else if (katStr.includes("IOT")) {
        const match = produkRes.data.data.find((p: any) => p.nama_produk?.toUpperCase().includes("IOT"));
        if (match) selectedProduct = match;
      }

      validProdukId = selectedProduct.id;
    }
  } catch(e) {
    console.warn("Gagal mengambil list produk dummy", e);
  }

  const items = [{
    produk_id: validProdukId, 
    qty: payload.quantity ? Number(payload.quantity) : 1,
    harga: 0,
    ppn: 0,
    subtotal: parseRupiah(payload.hargaPPN)
  }];

  const payment = (payload.tanggalUangMasuk || payload.jumlahUangMasuk || payload.rekeningPenerima) ? {
    jumlah_uang_masuk: parseRupiah(payload.jumlahUangMasuk),
    tanggal_uang_masuk: payload.tanggalUangMasuk || null,
    status: "LUNAS",
    rekening: payload.rekeningPenerima || "",
  } : null;

  const procurement = {
    no_invoice_kut: payload.nomorInvoiceKUT || "",
    tanggal_invoice_kut: payload.tanggalInvoiceKUT || null,
    nomor_surat_penyampaian_daftar_harga: payload.nomorPenyampaianDaftarHarga || "",
    nomor_formulir_pembelian: payload.nomorFormulirPembelian || "",
  };

  if (payload.kategori === "IoT Inaproc") {
    endpoint = "/api/iot-inaproc";
    payloadData = {
      ...baseOrder,
      kode_bayar: payload.kodeBayar || "",
      no_invoice_inaproc: payload.nomorInvoiceInaproc || "",
      items,
      procurement,
      payment: payment || undefined
    };
  } else if (payload.kategori === "IoT Manual") {
    endpoint = "/api/iot-manual";
    payloadData = {
      ...baseOrder,
      nomor_formulir_berlangganan: payload.nomorFormulirBerlangganan || "",
      nomor_surat_penawaran_harga: payload.nomorSuratPenawaranHarga || "",
      bulan_pengiriman_sph: payload.bulanPengirimanSPH || "",
      waktu_pengiriman: payload.bulanPengirimanSPH || "",
      nama_surat: payload.nomorSuratPenawaranHarga || "",
      nomor_kontrak_berlangganan: payload.nomorKontrakBerlangganan || "",
      items,
      procurement,
      payment: payment || undefined
    };
  } else {
    endpoint = "/api/timbangan";
    let katOrder = "timbangan_manual";
    if (payload.kategori === "Timbangan Inaproc") katOrder = "timbangan_inaproc";
    else if (payload.kategori?.includes("RCW-360")) katOrder = "rcw_360";
    else if (payload.kategori?.includes("RCW-800")) katOrder = "rcw_800w";
    
    payloadData = {
      ...baseOrder,
      jenis_order: payload.kategori === "Timbangan Inaproc" ? "inaproc" : "manual",
      kategori_order: katOrder,
      kode_bayar: payload.kodeBayar || "",
      no_invoice_inaproc: payload.nomorInvoiceInaproc || "",
      items,
      pricing: {
        tipe_timbangan: payload.tipeTimbangan || "",
        harga_produk: parseRupiah(payload.harga),
        harga_ppn: parseRupiah(payload.ppn11),
        harga_ongkir_kut: parseRupiah(payload.ongkirKUT),
        harga_ppn_ongkir: parseRupiah(payload.hargaPPN11Ongkir),
        total_harga_ongkir: parseRupiah(payload.totalHargaOngkir),
        total_harga_jual: parseRupiah(payload.totalHargaJual),
        harga_produk_reseller: parseRupiah(payload.hargaProdukReseller),
        harga_ppn_reseller: parseRupiah(payload.ppn11Reseller),
        harga_ongkir_reseller: parseRupiah(payload.ongkirReseller),
        harga_ppn_ongkir_reseller: parseRupiah(payload.hargaPPN11OngkirReseller),
        total_harga_ongkir_reseller: parseRupiah(payload.totalHargaOngkirReseller),
        total_harga_reseller: parseRupiah(payload.totalHargaReseller)
      },
      payment: payment || undefined,
      shipment: {
        wilayah_id: payload.wilayahPengiriman ? Number(payload.wilayahPengiriman) : null,
        ekspedisi_id: payload.ekspedisi ? Number(payload.ekspedisi) : null,
        resi: payload.nomorResi || "",
        berat: payload.berat ? Number(payload.berat) : 0,
        ongkir: parseRupiah(payload.ongkirKUT),
        tanggal_diterima: payload.tanggalBarangDiterima || null
      },
      procurement
    };
  }

  return { endpoint, payloadData };
};

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
      else if (kategoriVal === 'rcw_360') kategoriVal = 'RCW-360 PRO HYBRID (GSM+WIFI)';
      else if (kategoriVal === 'rcw_800w') kategoriVal = 'RCW-800W (LITE)';
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
    // 1. Fetch from list to get category because backend GET /api/orders/:id panics
    const listRes = await axios.get<BackendResponse<any>>(`/api/orders`, { headers: getAuthHeaders() })
    const listOrders = listRes.data.data || listRes.data || []
    const baseOrder = listOrders.find((o: any) => String(o.id) === String(id))
    if (!baseOrder) throw new Error("Pesanan tidak ditemukan")

    const katOrder = baseOrder.kategori_order || ""
    const jenisOrder = baseOrder.jenis_order || ""
    const isTimbangan = katOrder.includes("timbangan") || katOrder.includes("rcw")
    const isIoTManual = katOrder === "iot_manual" || (!isTimbangan && jenisOrder === "manual")

    let endpoint = `/api/iot-inaproc/${id}`
    if (isTimbangan) endpoint = `/api/timbangan/${id}`
    else if (isIoTManual) endpoint = `/api/iot-manual/${id}`

    // 2. Fetch from specific endpoint to get nested relations
    const res = await axios.get<BackendResponse<any>>(endpoint, { headers: getAuthHeaders() })
    const order = res.data.data || res.data

    const pricing = order.pricing || {};
    const procurement = order.procurement || {};
    const payment = (order.payments && order.payments.length > 0) ? order.payments[0] : {};
    const shipment = (order.shipments && order.shipments.length > 0) ? order.shipments[0] : {};

    let kategoriVal = "";
    if (order.kategori_order) {
      if (order.kategori_order === "timbangan_inaproc") kategoriVal = "Timbangan Inaproc";
      else if (order.kategori_order === "timbangan_manual") kategoriVal = "Timbangan Manual";
      else if (order.kategori_order === "rcw_360") kategoriVal = "RCW-360 PRO HYBRID (GSM+WIFI)";
      else if (order.kategori_order === "rcw_800w") kategoriVal = "RCW-800W (LITE)";
      else if (order.kategori_order === "iot_inaproc") kategoriVal = "IoT Inaproc";
      else if (order.kategori_order === "iot_manual") kategoriVal = "IoT Manual";
    }
    if (!kategoriVal) {
      kategoriVal = (order.keterangan ? String(order.keterangan).split(' - ')[0] : '') || (String(order.jenis_order).toLowerCase() === 'inaproc' ? 'IoT Inaproc' : 'IoT Manual');
    }

    return {
      id: String(order.id),
      kategori: kategoriVal as any,
      kodePemesanan: order.kode_order || "",
      namaInstansi: order.instansi?.nama_instansi || (order.instansi_id ? String(order.instansi_id) : ''),
      instansiId: order.instansi_id ? String(order.instansi_id) : '',
      noNPWP: order.instansi?.npwp || '',
      alamat: order.instansi?.alamat || '',
      kota: order.instansi?.kota_kab || order.instansi?.kota || '',
      provinsi: order.instansi?.provinsi || '',
      namaPIC: order.pic?.nama_pic || (order.pic_id ? String(order.pic_id) : ''),
      picId: order.pic_id ? String(order.pic_id) : '', 
      noTelpPIC: order.pic?.no_hp || "",
      emailPIC: order.pic?.email || "",
      nikPIC: order.pic?.nik || "",
      createdAt: order.created_at || '',
      updatedAt: order.updated_at || '',

      statusPesanan: order.status || "",
      statusOdoo: order.status_odoo || "",
      nsfp: order.nsfp || "",
      nomorBAST: order.no_bast || baseOrder.no_bast || "",
      tanggalBAST: order.tanggal_bast || baseOrder.tanggal_bast || "",
      kodeBayar: (order.kode_bayar || baseOrder.kode_bayar) ? String(order.kode_bayar || baseOrder.kode_bayar).trim().toUpperCase() : "",
      nomorInvoiceInaproc: order.no_invoice_inaproc || baseOrder.no_invoice_inaproc || "",
      keterangan: order.keterangan ? (String(order.keterangan).includes(' - ') ? String(order.keterangan).split(' - ')[1].trim() : order.keterangan) : '',
      tanggalPesananPO: order.tanggal_po || order.tanggal_order || "",
      nomorPOKUT: procurement.no_po_kut || order.no_po || "",
      periodeBerlangganan: order.periode_langganan || "",

      // Timbangan / Pricing Data
      tipeTimbangan: pricing.tipe_timbangan || "",
      ongkirKUT: pricing.harga_ongkir_kut != null ? String(pricing.harga_ongkir_kut) : "",
      hargaPPN11Ongkir: pricing.harga_ppn_ongkir != null ? String(pricing.harga_ppn_ongkir) : "",
      totalHargaOngkir: pricing.total_harga_ongkir != null ? String(pricing.total_harga_ongkir) : "",
      totalHargaJual: pricing.total_harga_jual != null ? String(pricing.total_harga_jual) : "",
      hargaProdukReseller: pricing.harga_produk_reseller != null ? String(pricing.harga_produk_reseller) : "",
      ppn11Reseller: pricing.harga_ppn_reseller != null ? String(pricing.harga_ppn_reseller) : "",
      ongkirReseller: pricing.harga_ongkir_reseller != null ? String(pricing.harga_ongkir_reseller) : "",
      hargaPPN11OngkirReseller: pricing.harga_ppn_ongkir_reseller != null ? String(pricing.harga_ppn_ongkir_reseller) : "",
      totalHargaOngkirReseller: pricing.total_harga_ongkir_reseller != null ? String(pricing.total_harga_ongkir_reseller) : "",
      totalHargaReseller: pricing.total_harga_reseller != null ? String(pricing.total_harga_reseller) : "",

      // Procurement
      nomorInvoiceKUT: procurement.no_invoice_kut || "",
      tanggalInvoiceKUT: procurement.tanggal_invoice_kut || "",
      nomorPenyampaianDaftarHarga: procurement.nomor_surat_penyampaian_daftar_harga || "",
      nomorFormulirPembelian: procurement.nomor_formulir_pembelian || "",

      // Manual IoT
      nomorFormulirBerlangganan: (order.manual && order.manual.nomor_formulir_berlangganan) || "",
      nomorSuratPenawaranHarga: (order.manual && (order.manual.nomor_surat_penawaran_harga || order.manual.nama_surat)) || "",
      bulanPengirimanSPH: (order.manual && (order.manual.bulan_pengiriman_sph || order.manual.waktu_pengiriman)) || "",
      nomorKontrakBerlangganan: (order.manual && order.manual.nomor_kontrak_berlangganan) || "",

      // Payment
      tanggalUangMasuk: payment.tanggal_uang_masuk || "",
      jumlahUangMasuk: payment.jumlah_uang_masuk != null ? String(payment.jumlah_uang_masuk) : "",
      rekeningPenerima: payment.rekening || "",

      // Shipment
      wilayahPengiriman: shipment.wilayah_id != null ? String(shipment.wilayah_id) : "",
      ekspedisi: shipment.ekspedisi_id != null ? String(shipment.ekspedisi_id) : "",
      nomorResi: shipment.resi || "",
      berat: shipment.berat != null ? Number(shipment.berat) : 0,
      tanggalBarangDiterima: shipment.tanggal_diterima || "",

      quantity: order.items && order.items.length > 0 ? order.items[0].qty : 1,
      hargaPPN: pricing.total_harga_jual != null ? String(pricing.total_harga_jual) : (order.items && order.items.length > 0 ? String(order.items[0].subtotal || 0) : ""),
      harga: pricing.harga_produk != null ? String(pricing.harga_produk) : (order.items && order.items.length > 0 ? String(order.items[0].harga || 0) : ""),
      ppn11: pricing.harga_ppn != null ? String(pricing.harga_ppn) : (order.items && order.items.length > 0 ? String(order.items[0].ppn || 0) : ""),
    }
  },

  create: async (payload: Omit<PemesananData, 'id'>): Promise<PemesananData> => {
    const { endpoint, payloadData } = await buildPayloadAndEndpoint(payload);
    const res = await axios.post(endpoint, payloadData, { headers: getAuthHeaders() });
    return { id: String(res.data.data?.id || res.data?.id), ...payload } as any;
  },

  update: async (id: string, payload: Partial<PemesananData>): Promise<PemesananData> => {
    const { endpoint, payloadData } = await buildPayloadAndEndpoint(payload);
    await axios.put(`${endpoint}/${id}`, payloadData, { headers: getAuthHeaders() });
    return { id, ...payload } as any;
  },

  delete: async ({ id, kategori }: { id: string, kategori: string }): Promise<void> => {
    let endpoint = "/api/timbangan";
    if (kategori === "IoT Inaproc") {
      endpoint = "/api/iot-inaproc";
    } else if (kategori === "IoT Manual") {
      endpoint = "/api/iot-manual";
    }
    await axios.delete(`${endpoint}/${id}`, { headers: getAuthHeaders() });
  }
}
