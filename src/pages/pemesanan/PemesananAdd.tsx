import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { pemesananApi } from '@/api/pemesanan'
import type { PemesananData, KategoriPemesanan } from '@/api/pemesanan'
import { masterApi } from '@/api/masterApi'
import { ChevronLeft } from 'lucide-react'
import CustomDatePicker from '@/components/ui/CustomDatePicker'

const formSchema = z.object({
  kategori: z.string().min(1, "Pilih Kategori"),
  kodePemesanan: z.string().min(1, "Kode Pemesanan wajib diisi"),
  instansi: z.string().min(1, "Pilih Instansi"),
  pic: z.string().min(1, "PIC wajib diisi"),
  telp: z.string().optional(),
  email: z.string().optional(),
  nik: z.string().optional(),
  npwp: z.string().optional(),
  alamat: z.string().optional(),
  kota: z.string().optional(),
  provinsi: z.string().optional(),
  quantity: z.any().optional(),
  periodeBerlangganan: z.string().optional(),
  hargaPPN: z.string().optional(),
  tipeTimbangan: z.string().optional(),
  wilayahPengiriman: z.string().optional(),
  berat: z.any().optional(),
  ekspedisi: z.string().optional(),
  nomorResi: z.string().optional(),
  tanggalBarangDiterima: z.string().optional(),
  harga: z.string().optional(),
  ppn11: z.string().optional(),
  ongkirKUT: z.string().optional(),
  hargaPPN11Ongkir: z.string().optional(),
  totalHargaOngkir: z.string().optional(),
  totalHargaJual: z.string().optional(),
  hargaProdukReseller: z.string().optional(),
  ppn11Reseller: z.string().optional(),
  ongkirReseller: z.string().optional(),
  hargaPPN11OngkirReseller: z.string().optional(),
  totalHargaOngkirReseller: z.string().optional(),
  nomorSuratPenawaranHarga: z.string().optional(),
  bulanPengirimanSPH: z.string().optional(),
  nomorPOKUT: z.string().optional(),
  tanggalPesananPO: z.string().optional(),
  nomorBAST: z.string().optional(),
  tanggalBAST: z.string().optional(),
  nomorInvoiceKUT: z.string().optional(),
  tanggalInvoiceKUT: z.string().optional(),
  nomorInvoiceInaproc: z.string().optional(),
  nsfp: z.string().optional(),
  tanggalUangMasuk: z.string().optional(),
  jumlahUangMasuk: z.string().optional(),
  rekeningPenerima: z.string().optional(),
  kodeBayar: z.string().optional(),
  keterangan: z.string().optional(),
  nomorPenyampaianDaftarHarga: z.string().optional(),
  nomorFormulirPembelian: z.string().optional(),
  nomorFormulirBerlangganan: z.string().optional(),
  nomorKontrakBerlangganan: z.string().optional(),

  totalHargaReseller: z.string().optional(),
  statusPesanan: z.string().optional(),
  statusOdoo: z.string().optional(),

});
type FormValues = z.infer<typeof formSchema>;

export default function PemesananAdd() {
  const navigate = useNavigate()
  const { id } = useParams()
  const queryClient = useQueryClient()
  
  const { data: editData, isError, error } = useQuery({
    queryKey: ['pemesanan', id],
    queryFn: () => pemesananApi.getById(id!),
    enabled: !!id
  })

  const { register, handleSubmit, watch, setValue, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kategori: "", kodePemesanan: "", instansi: "", pic: ""
    }
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchKategori = watch("kategori");
  const watchInstansi = watch("instansi");
  const watchPIC = watch("pic");

  const { data: instansiList = [] } = useQuery({ queryKey: ["master_instansi"], queryFn: masterApi.getInstansi })
  const { data: picList = [] } = useQuery({ queryKey: ["master_pic"], queryFn: masterApi.getPIC })
  const { data: wilayahList = [] } = useQuery({ queryKey: ["master_wilayah"], queryFn: masterApi.getWilayah })
  const { data: ekspedisiList = [] } = useQuery({ queryKey: ["master_ekspedisi"], queryFn: masterApi.getEkspedisi })
  const { data: options = {} as Record<string, string[]> } = useQuery({ queryKey: ["master_options"], queryFn: masterApi.getOptions })

  useEffect(() => {
    if (watchInstansi) {
      const found = instansiList.find(item => item.namaInstansi === watchInstansi)
      if (found) {
        setValue("npwp", found.npwp || "")
        setValue("alamat", found.alamat || "")
        setValue("kota", found.kotaKab || "")
        setValue("provinsi", found.provinsi || "")
        const relatedPICs = picList.filter(p => p.instansiId === found.id)
        if (relatedPICs.length > 0) {
          setValue("pic", relatedPICs[0].namaPIC || "")
        }
      }
    }
  }, [watchInstansi, instansiList, picList, setValue])

  useEffect(() => {
    if (watchPIC) {
      const found = picList.find(item => item.namaPIC === watchPIC)
      if (found) {
        setValue("nik", found.nik || "")
        setValue("telp", found.noTelp || "")
        setValue("email", found.email || "")
      }
    }
  }, [watchPIC, picList, setValue])

  useEffect(() => {
    if (editData) {
      reset({
        ...editData,
        instansi: editData.namaInstansi,
        pic: editData.namaPIC,
      });
    }
  }, [editData, reset]);

  const saveMutation = useMutation({
    mutationFn: id ? (payload: Omit<PemesananData, 'id'>) => pemesananApi.update(id, payload as Partial<PemesananData>) : pemesananApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pemesanan'] })
      alert('Data berhasil disimpan!')
      navigate('/pemesanan')
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      const backendError = err.response?.data?.error || err.message;
      alert('Gagal menyimpan data: ' + backendError)
    }
  })

  const onSubmit = (data: FormValues) => {
    const { kategori, kodePemesanan, instansi, pic, telp, email, nik, npwp, alamat, kota, provinsi, ...detail } = data;
    const instansiItem = instansiList.find(i => i.namaInstansi === instansi);
    const picItem = picList.find(p => p.namaPIC === pic);

    const payload: Omit<PemesananData, "id"> = {
      kategori: kategori as KategoriPemesanan,
      kodePemesanan,
      namaInstansi: instansiItem ? String(instansiItem.id) : instansi,
      namaPIC: picItem ? String(picItem.id) : pic,
      noTelpPIC: telp || "",
      emailPIC: email || "",
      nikPIC: nik || "",
      noNPWP: npwp || "",
      alamat: alamat || "",
      kota: kota || "",
      provinsi: provinsi || "",
      ...detail
    };
    saveMutation.mutate(payload);
  }

  const isTimbangan = watchKategori === 'Timbangan Inaproc' || watchKategori === 'Timbangan Manual' || watchKategori?.startsWith('RCW')
  const isIoT = watchKategori === 'IoT Inaproc' || watchKategori === 'IoT Manual'
  const isManual = watchKategori === 'IoT Manual' || watchKategori === 'Timbangan Manual'

  return (
    <DashboardLayout title="">
      
      <div className="mb-6 flex items-center gap-4 sticky top-0 bg-[#f8f9fa] z-10 pt-4 pb-4 border-b border-gray-100">
        <button 
          onClick={() => navigate('/pemesanan')}
          className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors inline-flex shadow-sm"
          title="Kembali"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">{id ? 'Form Edit Data' : 'Form Tambah Data'}</h2>
      </div>
        {isError && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6 overflow-auto">
            <p className="font-bold">Gagal mengambil data API untuk di-edit:</p>
            <p className="mt-2 text-sm text-red-700">Pesan: {(error as Error)?.message || "Unknown error"}</p>
          </div>
        )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-12">

        <div className="w-full bg-white p-6 shadow-sm border-y border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Pilih Kategori <span className="text-red-500">*</span></label>
            <select 
              
              {...register("kategori")}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Pilih Kategori</option>
              <option value="IoT Inaproc">IoT Inaproc</option>
              <option value="Timbangan Inaproc">Timbangan Inaproc</option>
              <option value="IoT Manual">IoT Manual</option>
              <option value="Timbangan Manual">Timbangan Manual</option>
              <option value="RCW-360 PRO HYBRID (GSM+WIFI)">RCW-360 PRO HYBRID (GSM+WIFI)</option>
              <option value="RCW-800W (LITE)">RCW-800W (LITE)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Kode Pemesanan <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              
              {...register("kodePemesanan")}
              placeholder="Masukkan Kode"
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {watchKategori && (
          <>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-[#eef5f5] px-6 py-3 border-b border-gray-200 flex items-center gap-2 text-teal-800 font-semibold">
                <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">i</span>
                Data Pemesan
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nama Instansi Pemesan <span className="text-red-500">*</span></label>
                  <select 
                    
                    {...register("instansi")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e] bg-white"
                    required
                  >
                    <option value="" disabled>Pilih Instansi Pemesan</option>
                    {instansiList.map(item => <option key={item.id} value={item.namaInstansi}>{item.namaInstansi}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nama PIC <span className="text-red-500">*</span></label>
                  <input type="text" {...register("pic")} className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />
                  <p className="text-xs text-gray-500">Terisi otomatis dari instansi, bebas diubah</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nomor Telepon PIC <span className="text-red-500">*</span></label>
                  <input type="text" {...register("telp")} className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />
                  <p className="text-xs text-gray-500">Terisi otomatis dari instansi, bebas diubah</p>
                </div>
                {watchKategori !== 'IoT Inaproc' && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">E-Mail <span className="text-red-500">*</span></label>
                    <input type="text" {...register("email")} className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">NIK PIC <span className="text-red-500">*</span></label>
                  <input type="text" {...register("nik")} className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nomor NPWP <span className="text-red-500">*</span></label>
                  <input type="text" {...register("npwp")} className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />
                  <p className="text-xs text-gray-500">Terisi otomatis, bisa diubah</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Alamat <span className="text-red-500">*</span></label>
                  <input type="text" {...register("alamat")} className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />
                  <p className="text-xs text-gray-500">Terisi otomatis, bisa diubah</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Kota/Kabupaten <span className="text-red-500">*</span></label>
                  <input type="text" {...register("kota")} className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />
                  <p className="text-xs text-gray-500">Terisi otomatis, bisa diubah</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Provinsi <span className="text-red-500">*</span></label>
                  <input type="text" {...register("provinsi")} className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />
                  <p className="text-xs text-gray-500">Terisi otomatis, bisa diubah</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-[#eef5f5] px-6 py-3 border-b border-gray-200 flex items-center gap-2 text-teal-800 font-semibold">
                <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">i</span>
                Detail {watchKategori}
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">


                {isIoT && (
                  <>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Quantity <span className="text-red-500">*</span></label>
                      <input type="number" {...register("quantity")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Periode Berlangganan <span className="text-red-500">*</span></label>
                      <select {...register("periodeBerlangganan")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                        <option value="">Pilih Periode</option>
                        <option value="1 Tahun">1 Tahun</option>
                        <option value="2 Tahun">2 Tahun</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Harga + PPN <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Rp" {...register("hargaPPN")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                  </>
                )}

                {isTimbangan && (
                  <>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Tipe Timbangan Produk <span className="text-red-500">*</span></label>
                      <select {...register("tipeTimbangan")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                          <option value="">Pilih Tipe</option>
                          {options.tipe_timbangan?.map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Quantity <span className="text-red-500">*</span></label>
                      <input type="number" {...register("quantity")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Wilayah Pengiriman <span className="text-red-500">*</span></label>
                      <select {...register("wilayahPengiriman")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                        <option value="">Pilih Wilayah</option>
                        {wilayahList.map(item => (
                          <option key={item.id} value={item.id}>{item.namaWilayah}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Berat (KG) <span className="text-red-500">*</span></label>
                      <input type="number" {...register("berat")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Ekspedisi</label>
                      <select {...register("ekspedisi")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                        <option value="">Pilih Ekspedisi</option>
                        {ekspedisiList.map(item => (
                          <option key={item.id} value={item.id}>{item.namaEkspedisi}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Nomor Resi</label>
                      <input type="text" placeholder="Masukkan Nomor" {...register("nomorResi")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Tanggal Barang Diterima</label>
                      <CustomDatePicker  {...register("tanggalBarangDiterima")} />
                    </div>
                    
                    <div className="hidden md:block"></div> 

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Harga <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Rp" {...register("harga")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">PPN 11% <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Rp" {...register("ppn11")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Ongkir KUT <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Rp" {...register("ongkirKUT")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Harga PPN 11% + Ongkir <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Rp" {...register("hargaPPN11Ongkir")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Total Harga + Ongkir <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Rp" {...register("totalHargaOngkir")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Total Harga Jual <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Rp" {...register("totalHargaJual")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Harga Produk Reseller <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Rp" {...register("hargaProdukReseller")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">PPN 11% Reseller <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Rp" {...register("ppn11Reseller")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Ongkir Reseller <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Rp" {...register("ongkirReseller")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Harga PPN 11% + Ongkir Reseller <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Rp" {...register("hargaPPN11OngkirReseller")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Total Harga + Ongkir Reseller <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Rp" {...register("totalHargaOngkirReseller")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Total Harga Reseller <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Rp" {...register("totalHargaReseller")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Status Pesanan <span className="text-red-500">*</span></label>
                  <select {...register("statusPesanan")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e] bg-white">
                    <option value="">Pilih Status</option>
                    {options.status_pesanan?.map((opt: string) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Status Odoo <span className="text-red-500">*</span></label>
                  <select {...register("statusOdoo")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e] bg-white">
                    <option value="">Pilih Status</option>
                    {options.status_odoo?.map((opt: string) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {watchKategori === 'IoT Manual' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Bulan Pengiriman SPH <span className="text-red-500">*</span></label>
                      <select {...register("bulanPengirimanSPH")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                        <option value="">Pilih Bulan</option>
                        <option value="Januari">Januari</option>
                        <option value="Februari">Februari</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Nomor Surat Penawaran Harga <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Masukkan Nomor" {...register("nomorSuratPenawaranHarga")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Nomor Kontrak Berlangganan <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Masukkan Nomor" {...register("nomorKontrakBerlangganan")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                  </>
                )}

                {isTimbangan && (
                  <>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Nomor Penyampaian Daftar Harga</label>
                      <input type="text" placeholder="Masukkan Nomor" {...register("nomorPenyampaianDaftarHarga")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Nomor Formulir Pembelian</label>
                      <input type="text" placeholder="Masukkan Nomor" {...register("nomorFormulirPembelian")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                  </>
                )}

                {isManual && isIoT && (
                   <div className="space-y-1">
                     <label className="text-sm font-medium text-gray-700">Nomor Formulir Berlangganan <span className="text-red-500">*</span></label>
                     <input type="text" placeholder="Masukkan Nomor" {...register("nomorFormulirBerlangganan")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                   </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-[#eef5f5] px-6 py-3 border-b border-gray-200 flex items-center gap-2 text-teal-800 font-semibold">
                <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">i</span>
                Detail Purchase Order
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Tanggal Pesanan PO <span className="text-red-500">*</span></label>
                  <CustomDatePicker  {...register("tanggalPesananPO")} />
                </div>
                {isTimbangan && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Nomor PO KUT <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Masukkan Nomor" {...register("nomorPOKUT")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Tanggal BAST <span className="text-red-500">*</span></label>
                  <CustomDatePicker  {...register("tanggalBAST")} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nomor BAST <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Masukkan Nomor" {...register("nomorBAST")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nomor Invoice KUT <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Masukkan Nomor" {...register("nomorInvoiceKUT")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Tanggal Invoice KUT <span className="text-red-500">*</span></label>
                  <CustomDatePicker  {...register("tanggalInvoiceKUT")} />
                </div>
                {watchKategori !== 'IoT Manual' && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Nomor Invoice Inaproc <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Masukkan Nomor" {...register("nomorInvoiceInaproc")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">NSFP <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Masukkan NSFP" {...register("nsfp")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Tanggal Uang Masuk <span className="text-red-500">*</span></label>
                  <CustomDatePicker  {...register("tanggalUangMasuk")} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Jumlah Uang Masuk <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Rp0" {...register("jumlahUangMasuk")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Rekening Penerima <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Masukkan Nomor Rekening Penerima" {...register("rekeningPenerima")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                </div>
                {watchKategori !== 'IoT Manual' && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Kode Bayar <span className="text-red-500">*</span></label>
                    <select {...register("kodeBayar")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                        <option value="">Pilih Kode Bayar</option>
                        {options.kode_bayar?.map((opt: string) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                  </div>
                )}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Keterangan <span className="text-red-500">*</span></label>
                  <textarea placeholder="Masukkan Keterangan" {...register("keterangan")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" rows={3}></textarea>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button 
                type="button" 
                onClick={() => navigate('/pemesanan')}
                className="px-6 py-2.5 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit" 
                disabled={saveMutation.isPending}
                className="px-6 py-2.5 bg-teal-700 text-white font-medium rounded-lg hover:bg-teal-800 transition-colors disabled:opacity-70"
              >
                {saveMutation.isPending ? 'Menyimpan...' : 'Lanjut / Simpan'}
              </button>
            </div>
          </>
        )}
      </form>
    </DashboardLayout>
  )
}






