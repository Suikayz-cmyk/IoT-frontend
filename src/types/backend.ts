export interface BaseBackendModel {
  id: number;
  created_at?: string;
  updated_at?: string;
}

export interface MasterInstansi extends BaseBackendModel {
  nama_instansi: string;
  nik?: string;
  npwp?: string;
  alamat?: string;
  provinsi?: string;
  kota_kab?: string;
}

export interface MasterPIC extends BaseBackendModel {
  instansi_id: number;
  nama_pic: string;
  nik?: string;
  email?: string;
  no_hp?: string;
}

export interface MasterProduk extends BaseBackendModel {
  kode_produk: string;
  nama_produk: string;
  jenis_produk: string;
  harga: number;
  status: number;
}

export interface MasterWilayah extends BaseBackendModel {
  provinsi: string;
  kota_kab: string;
  alamat?: string;
}

export interface MasterEkspedisi extends BaseBackendModel {
  nama_ekspedisi: string;
  status: number;
}

export interface OrderItem extends BaseBackendModel {
  order_id: number;
  produk_id: number;
  qty: number;
  harga: number;
  ppn: number;
  subtotal: number;
}

export interface OrderInaproc extends BaseBackendModel {
  order_id: number;
  no_po?: string;
  tanggal_po?: string;
  no_bast?: string;
  tanggal_bast?: string;
  no_invoice_inaproc?: string;
  kode_bayar?: string;
  nsfp?: string;
  no_invoice_kut?: string;
  tanggal_uang_masuk?: string;
  jumlah_uang_masuk?: number;
  rekening?: string;
  bulan_pengiriman?: string;
}

export interface OrderManual extends BaseBackendModel {
  order_id: number;
  nama_surat?: string;
  dokumen_full_sign?: string;
  waktu_pengiriman?: string;
  no_po?: string;
  tanggal_po?: string;
  no_bast?: string;
  tanggal_bast?: string;
  periode_langganan?: string;
  nomor_invoice?: string;
}

export interface OrderProcurement extends BaseBackendModel {
  order_id: number;
  no_po_kut?: string;
  tanggal_invoice_kut?: string;
  nomor_surat_penyampaian_daftar_harga?: string;
  nomor_formulir_pembelian?: string;
  no_invoice_kut?: string;
}

export interface Payment extends BaseBackendModel {
  order_id: number;
  tanggal_uang_masuk?: string;
  jumlah_uang_masuk?: number;
  rekening?: string;
  status?: string;
  bukti_pembayaran?: string | null;
}

export interface SPJ extends BaseBackendModel {
  order_id: number;
  kebutuhan_spj?: string;
  jumlah_rangkap?: number;
  jenis_kertas?: string;
  jenis_file?: string;
  tanggal_print?: string;
  tanggal_update_list?: string;
  tanggal_paraf?: string;
  tanggal_sign?: string;
  tanggal_pengiriman?: string;
  pic_print?: string;
  status?: string;
}

export interface OrderDocument extends BaseBackendModel {
  order_id: number;
  spj_id?: number;
  jenis_dokumen: string;
  nama_file: string;
  file_path: string;
  file_url: string;
}

export interface Shipment extends BaseBackendModel {
  order_id: number;
  [key: string]: unknown;
}

/**
 * Representasi utama Order (Pemesanan) di Backend 3.0
 * Backend 3.0 menggunakan Preload untuk membawa semua relasi data secara langsung.
 */
export interface Order extends BaseBackendModel {
  kode_order: string;
  jenis_order: 'inaproc' | 'manual';
  kategori_order: string;
  instansi_id?: number | null;
  pic_id?: number | null;
  status?: string;
  status_odoo?: string;
  qty?: number;
  harga_ppn?: number;
  tanggal_order?: string;
  keterangan?: string;
  
  // Field tambahan yang ada di tabel utama Order (Backend 3.0)
  nsfp?: string;
  no_bast?: string;
  kode_bayar?: string;
  no_invoice_inaproc?: string;
  tanggal_po?: string;
  no_po?: string;
  periode_langganan?: string;
  tanggal_bast?: string;

  // Relasi Preload (Opsional tergantung query)
  instansi?: MasterInstansi;
  pic?: MasterPIC;
  items?: OrderItem[];
  manual?: OrderManual;
  procurement?: OrderProcurement;
  payments?: Payment[];
  shipments?: Shipment[];
  order_documents?: OrderDocument[];
  spj?: SPJ[];
}

/**
 * Format standar response yang dikembalikan oleh Backend
 */
export interface BackendResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
