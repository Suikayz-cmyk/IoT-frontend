export interface SPJOrder {
  id: number
  tgl_print: string
  tgl_paraf: string
  tgl_sign: string
  tgl_kirim: string
  nama_dinkes_pkm: string
  kertas: string
  kebutuhan_spj: string
  jumlah_rangkap: number
  jenis_file: string
  up_nomor_telepon_alamat: string
  status_pengiriman: string
  keterangan: string
  pic_print: string
  created_at?: string
  updated_at?: string
}

