import { KATEGORI } from '@/constants/options';
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PemesananData, KategoriPemesanan } from './pemesanan'
import type { Order } from '@/types/backend'
import apiClient from './client'

export const parseRupiah = (val: unknown): number => {
  if (val === undefined || val === null || val === '') return 0;
  if (typeof val === 'number') return val;
  if (typeof val === 'string' && !isNaN(Number(val)) && val.trim() !== '') return Number(val);
  
  return parseFloat(String(val).replace(/\./g, "").replace(/,/g, ".").replace(/[^0-9.-]+/g, "")) || 0;
}

export const buildPayloadAndEndpoint = async (payload: Partial<PemesananData>) => {
  let endpoint: string;
  let payloadData: Record<string, unknown>;

  const parsedInstansiId = (payload.namaInstansi && !isNaN(Number(payload.namaInstansi))) ? Number(payload.namaInstansi) : 0;
  const parsedPicId = (payload.namaPIC && !isNaN(Number(payload.namaPIC))) ? Number(payload.namaPIC) : 0;

  const baseOrder = {
    kode_order: payload.kodePemesanan || "",
    instansi_id: parsedInstansiId,
    instansi: parsedInstansiId === 0 && payload.namaInstansi ? {
      nama_instansi: payload.namaInstansi,
      npwp: payload.noNPWP || null,
      alamat: payload.alamat || null,
      kota_kab: payload.kota || null,
      provinsi: payload.provinsi || null
    } : undefined,
    pic_id: parsedPicId,
    pic: parsedPicId === 0 && payload.namaPIC ? {
      nama_pic: payload.namaPIC,
      no_hp: payload.noTelpPIC || null,
      email: payload.emailPIC || null,
      nik: payload.nikPIC || null
    } : undefined,
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

  let validProdukId: number;
  try {
    const produkRes = await apiClient.get("/api/produk");
    if (produkRes.data?.data && produkRes.data.data.length > 0) {
      let selectedProduct = produkRes.data.data[0];
      
      const katStr = payload.kategori?.toUpperCase() || "";
      if (katStr.includes("RCW-360")) {
        const match = produkRes.data.data.find((p: { nama_produk?: string; id?: number }) => p.nama_produk?.toUpperCase().includes("RCW-360"));
        if (match) selectedProduct = match;
      } else if (katStr.includes("RCW-800")) {
        const match = produkRes.data.data.find((p: { nama_produk?: string; id?: number }) => p.nama_produk?.toUpperCase().includes("RCW-800"));
        if (match) selectedProduct = match;
      } else if (katStr.includes("TIMBANGAN")) {
        const match = produkRes.data.data.find((p: { nama_produk?: string; id?: number }) => p.nama_produk?.toUpperCase().includes("TIMBANGAN"));
        if (match) selectedProduct = match;
      } else if (katStr.includes("IOT")) {
        const match = produkRes.data.data.find((p: { nama_produk?: string; id?: number }) => p.nama_produk?.toUpperCase().includes("IOT"));
        if (match) selectedProduct = match;
      }

      validProdukId = selectedProduct.id;
    } else {
      throw new Error("No products found from backend");
    }
  } catch(e) {
    console.warn("Gagal mengambil list produk", e);
    throw new Error("Gagal mengambil produk dari backend", { cause: e });
  }

  const items = [{
    produk_id: validProdukId, 
    qty: payload.quantity ? Number(payload.quantity) : 1,
    harga: 0,
    ppn: 0,
    subtotal: parseRupiah(payload.hargaPPN)
  }];

  let paymentStatus = "LUNAS";
  try {
    const optionsRes = await apiClient.get("/api/options");
    if (optionsRes.data?.data) {
      const paymentOptions = optionsRes.data.data.filter((opt: { kategori?: string; label?: string; value?: string }) => opt.kategori === 'PAYMENT_STATUS');
      const lunasOpt = paymentOptions.find((opt: { kategori?: string; label?: string; value?: string }) => String(opt.label).toUpperCase() === 'LUNAS' || String(opt.value).toUpperCase() === 'LUNAS');
      if (lunasOpt) {
        paymentStatus = lunasOpt.value || lunasOpt.label || "LUNAS";
      }
    }
  } catch (e) {
    console.warn("Gagal mengambil payment status options", e);
  }

  const payment = (payload.tanggalUangMasuk || payload.jumlahUangMasuk || payload.rekeningPenerima) ? {
    jumlah_uang_masuk: parseRupiah(payload.jumlahUangMasuk),
    tanggal_uang_masuk: payload.tanggalUangMasuk || null,
    status: paymentStatus,
    rekening: payload.rekeningPenerima || "",
  } : null;

  const procurement = {
    no_invoice_kut: payload.nomorInvoiceKUT || "",
    tanggal_invoice_kut: payload.tanggalInvoiceKUT || null,
    nomor_surat_penyampaian_daftar_harga: payload.nomorPenyampaianDaftarHarga || "",
    nomor_formulir_pembelian: payload.nomorFormulirPembelian || "",
  };

  if (payload.kategori === KATEGORI.IOT_INAPROC) {
    endpoint = "/api/iot-inaproc";
    payloadData = {
      ...baseOrder,
      kode_bayar: payload.kodeBayar || "",
      no_invoice_inaproc: payload.nomorInvoiceInaproc || "",
      items,
      procurement,
      payment: payment || undefined
    };
  } else if (payload.kategori === KATEGORI.IOT_MANUAL) {
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
    if (payload.kategori === KATEGORI.TIMBANGAN_INAPROC) katOrder = "timbangan_inaproc";
    else if (payload.kategori?.includes("RCW-360")) katOrder = "rcw_360";
    else if (payload.kategori?.includes("RCW-800")) katOrder = "rcw_800w";
    
    payloadData = {
      ...baseOrder,
      jenis_order: payload.kategori === KATEGORI.TIMBANGAN_INAPROC ? "inaproc" : "manual",
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

export const transformOrderToPemesananData = (order: Order): PemesananData => {
  const pricing = order.pricing || ({} as Record<string, any>);
  const procurement = order.procurement || ({} as Record<string, any>);
  const payment = (order.payments && order.payments.length > 0) ? order.payments[0] : ({} as Record<string, any>);
  const shipment = (order.shipments && order.shipments.length > 0) ? order.shipments[0] : ({} as Record<string, any>);

  let kategoriVal = "";
  if (order.kategori_order) {
    if (order.kategori_order === "timbangan_inaproc") kategoriVal = KATEGORI.TIMBANGAN_INAPROC;
    else if (order.kategori_order === "timbangan_manual") kategoriVal = KATEGORI.TIMBANGAN_MANUAL;
    else if (order.kategori_order === "rcw_360") kategoriVal = KATEGORI.RCW_360;
    else if (order.kategori_order === "rcw_800w") kategoriVal = KATEGORI.RCW_800W;
    else if (order.kategori_order === "iot_inaproc") kategoriVal = KATEGORI.IOT_INAPROC;
    else if (order.kategori_order === "iot_manual") kategoriVal = KATEGORI.IOT_MANUAL;
  }
  if (!kategoriVal) {
    kategoriVal = (order.keterangan ? String(order.keterangan).split(' - ')[0] : '') || (String(order.jenis_order).toLowerCase() === 'inaproc' ? KATEGORI.IOT_INAPROC : KATEGORI.IOT_MANUAL);
  }

  return {
    id: String(order.id),
    kategori: kategoriVal as KategoriPemesanan,
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
    nomorBAST: order.no_bast || "",
    tanggalBAST: order.tanggal_bast || "",
    kodeBayar: order.kode_bayar ? String(order.kode_bayar).trim().toUpperCase() : "",
    nomorInvoiceInaproc: order.no_invoice_inaproc || "",
    keterangan: order.keterangan ? (String(order.keterangan).includes(' - ') ? String(order.keterangan).split(' - ')[1].trim() : order.keterangan) : '',
    tanggalPesananPO: order.tanggal_po || order.tanggal_order || "",
    nomorPOKUT: procurement.no_po_kut || order.no_po || "",
    periodeBerlangganan: order.periode_langganan || "",

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

    nomorInvoiceKUT: procurement.no_invoice_kut || "",
    tanggalInvoiceKUT: procurement.tanggal_invoice_kut || "",
    nomorPenyampaianDaftarHarga: procurement.nomor_surat_penyampaian_daftar_harga || "",
    nomorFormulirPembelian: procurement.nomor_formulir_pembelian || "",

    nomorFormulirBerlangganan: (order.manual && order.manual.nomor_formulir_berlangganan) || "",
    nomorSuratPenawaranHarga: (order.manual && (order.manual.nomor_surat_penawaran_harga || order.manual.nama_surat)) || "",
    bulanPengirimanSPH: (order.manual && (order.manual.bulan_pengiriman_sph || order.manual.waktu_pengiriman)) || "",
    nomorKontrakBerlangganan: (order.manual && order.manual.nomor_kontrak_berlangganan) || "",

    tanggalUangMasuk: payment.tanggal_uang_masuk || "",
    jumlahUangMasuk: payment.jumlah_uang_masuk != null ? String(payment.jumlah_uang_masuk) : "",
    rekeningPenerima: payment.rekening || "",

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
}
