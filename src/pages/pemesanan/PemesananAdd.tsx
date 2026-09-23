/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useMutation, useQuery } from '@tanstack/react-query'
import { pemesananApi } from '@/api/pemesanan'
import type { KategoriPemesanan, PemesananData } from '@/api/pemesanan'
import { masterApi } from '@/api/dummyMasterData'
import { ChevronLeft } from 'lucide-react'
import CustomDatePicker from '@/components/ui/CustomDatePicker'

export default function PemesananAdd() {
  const navigate = useNavigate()
  const { id } = useParams()
  
  // Ambil data pemesanan jika mode Edit
  const { data: editData } = useQuery({
    queryKey: ['pemesanan', id],
    queryFn: () => pemesananApi.getById(id!),
    enabled: !!id
  })
  
  // Ambil data master
  const { data: instansiList = [] } = useQuery({ queryKey: ['master_instansi'], queryFn: masterApi.getInstansi })
  const { data: picList = [] } = useQuery({ queryKey: ['master_pic'], queryFn: masterApi.getPIC })

  // State Utama
  const [kategori, setKategori] = useState<KategoriPemesanan>('')
  const [kodePemesanan, setKodePemesanan] = useState('')

  // State Data Pemesan
  const [instansi, setInstansi] = useState('')
  const [pic, setPic] = useState('')
  const [telp, setTelp] = useState('')
  const [email, setEmail] = useState('')
  const [nik, setNik] = useState('')
  const [npwp, setNpwp] = useState('')
  const [alamat, setAlamat] = useState('')
  const [kota, setKota] = useState('')
  const [provinsi, setProvinsi] = useState('')

  // State Detail Dinamis
  const [detail, setDetail] = useState<Partial<PemesananData>>({})

  // Edit mode pre-fill
  useEffect(() => {
    if (editData) {
      setKategori(editData.kategori)
      setKodePemesanan(editData.kodePemesanan)
      setInstansi(editData.namaInstansi)
      setPic(editData.namaPIC)
      
      const newDetail: Partial<PemesananData> = { ...editData }
      setDetail(newDetail)
    }
  }, [editData])

  // Mutation
  const saveMutation = useMutation({
    mutationFn: id ? (payload) => pemesananApi.update(id, payload) : pemesananApi.create,
    onSuccess: () => {
      alert('Data berhasil disimpan!')
      navigate('/pemesanan')
    },
    onError: (err) => {
      alert('Gagal menyimpan data: ' + (err as Error).message)
    }
  })

  // Handlers
  const handleInstansiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setInstansi(val)
    const found = instansiList.find(item => item.namaInstansi === val)
    if (found) {
      setNpwp(found.npwp)
      setAlamat(found.alamat)
      setKota(found.kotaKab)
      setProvinsi(found.provinsi)
      
      // Auto-select first available PIC
      const relatedPICs = picList.filter(p => p.instansiId === found.id)
      if (relatedPICs.length > 0) {
        setPic(relatedPICs[0].namaPIC)
        setTelp(relatedPICs[0].noTelp)
        setEmail(relatedPICs[0].email)
        setNik(relatedPICs[0].nik)
      } else {
        setPic(''); setTelp(''); setEmail(''); setNik('');
      }
    } else {
      setPic(''); setTelp(''); setEmail(''); setNik(''); setNpwp(''); setAlamat(''); setKota(''); setProvinsi('');
    }
  }

  const handleDetailChange = (field: keyof PemesananData, value: string | number) => {
    setDetail(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!kategori) {
      alert('Silakan pilih kategori terlebih dahulu')
      return
    }

    const payload: Omit<PemesananData, 'id'> = {
      kategori,
      kodePemesanan,
      namaInstansi: instansi,
      namaPIC: pic,
      noTelpPIC: telp,
      emailPIC: email,
      nikPIC: nik,
      noNPWP: npwp,
      alamat,
      kota,
      provinsi,
      ...detail
    }

    saveMutation.mutate(payload)
  }

  const isTimbangan = kategori === 'Timbangan Inaproc' || kategori === 'Timbangan Manual' || kategori?.startsWith('RCW')
  const isIoT = kategori === 'IoT Inaproc' || kategori === 'IoT Manual'
  const isManual = kategori === 'IoT Manual' || kategori === 'Timbangan Manual'

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

      <form onSubmit={handleSubmit} className="space-y-6 pb-12">
        
        {/* Bagian 1: Kategori & Kode */}
        <div className="w-full bg-white p-6 shadow-sm border-y border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Pilih Kategori <span className="text-red-500">*</span></label>
            <select 
              value={kategori}
              onChange={(e) => setKategori(e.target.value as KategoriPemesanan)}
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
              value={kodePemesanan}
              onChange={(e) => setKodePemesanan(e.target.value)}
              placeholder="Masukkan Kode"
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {kategori && (
          <>
            {/* Bagian 2: Data Pemesan */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-[#eef5f5] px-6 py-3 border-b border-gray-200 flex items-center gap-2 text-teal-800 font-semibold">
                <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">i</span>
                Data Pemesan
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nama Instansi Pemesan <span className="text-red-500">*</span></label>
                  <select 
                    value={instansi}
                    onChange={handleInstansiChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e] bg-white"
                    required
                  >
                    <option value="" disabled>Pilih Instansi Pemesan</option>
                    {instansiList.map(item => <option key={item.id} value={item.namaInstansi}>{item.namaInstansi}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nama PIC <span className="text-red-500">*</span></label>
                  <input type="text" value={pic} onChange={e => setPic(e.target.value)} className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />
                  <p className="text-xs text-gray-500">Terisi otomatis dari instansi, bebas diubah</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nomor Telepon PIC <span className="text-red-500">*</span></label>
                  <input type="text" value={telp} onChange={e => setTelp(e.target.value)} className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />
                  <p className="text-xs text-gray-500">Terisi otomatis dari instansi, bebas diubah</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">E-Mail <span className="text-red-500">*</span></label>
                  <input type="text" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">NIK PIC <span className="text-red-500">*</span></label>
                  <input type="text" value={nik} onChange={e => setNik(e.target.value)} className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nomor NPWP <span className="text-red-500">*</span></label>
                  <input type="text" value={npwp} onChange={e => setNpwp(e.target.value)} className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />
                  <p className="text-xs text-gray-500">Terisi otomatis, bisa diubah</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Alamat <span className="text-red-500">*</span></label>
                  <input type="text" value={alamat} onChange={e => setAlamat(e.target.value)} className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />
                  <p className="text-xs text-gray-500">Terisi otomatis, bisa diubah</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Kota/Kabupaten <span className="text-red-500">*</span></label>
                  <input type="text" value={kota} onChange={e => setKota(e.target.value)} className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />
                  <p className="text-xs text-gray-500">Terisi otomatis, bisa diubah</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Provinsi <span className="text-red-500">*</span></label>
                  <input type="text" value={provinsi} onChange={e => setProvinsi(e.target.value)} className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />
                  <p className="text-xs text-gray-500">Terisi otomatis, bisa diubah</p>
                </div>
              </div>
            </div>

            {/* Bagian 3: Detail Dinamis */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-[#eef5f5] px-6 py-3 border-b border-gray-200 flex items-center gap-2 text-teal-800 font-semibold">
                <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">i</span>
                Detail {kategori}
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                
                {isIoT && (
                  <>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Quantity <span className="text-red-500">*</span></label>
                      <input type="number" onChange={e => handleDetailChange('quantity', parseInt(e.target.value))} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Periode Berlangganan <span className="text-red-500">*</span></label>
                      <select onChange={e => handleDetailChange('periodeBerlangganan', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                        <option value="">Pilih Periode</option>
                        <option value="1 Tahun">1 Tahun</option>
                        <option value="2 Tahun">2 Tahun</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Harga + PPN <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Rp" onChange={e => handleDetailChange('hargaPPN', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                  </>
                )}

                {isTimbangan && (
                  <>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Tipe Timbangan Produk <span className="text-red-500">*</span></label>
                      <select onChange={e => handleDetailChange('tipeTimbangan', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                        <option value="">Pilih Tipe</option>
                        <option value="Tipe A">Tipe A</option>
                        <option value="Tipe B">Tipe B</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Quantity <span className="text-red-500">*</span></label>
                      <input type="number" onChange={e => handleDetailChange('quantity', parseInt(e.target.value))} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Wilayah Pengiriman <span className="text-red-500">*</span></label>
                      <select onChange={e => handleDetailChange('wilayahPengiriman', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                        <option value="">Pilih Wilayah</option>
                        <option value="Jawa">Jawa</option>
                        <option value="Luar Jawa">Luar Jawa</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Berat (KG) <span className="text-red-500">*</span></label>
                      <input type="number" onChange={e => handleDetailChange('berat', parseInt(e.target.value))} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Ekspedisi <span className="text-red-500">*</span></label>
                      <select onChange={e => handleDetailChange('ekspedisi', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                        <option value="">Pilih Ekspedisi</option>
                        <option value="JNE">JNE</option>
                        <option value="JNT">JNT</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Nomor Resi <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Masukkan Nomor" onChange={e => handleDetailChange('nomorResi', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Tanggal Barang Diterima <span className="text-red-500">*</span></label>
                      <CustomDatePicker value={(detail.tanggalBarangDiterima as string) || ''} onChange={e => handleDetailChange('tanggalBarangDiterima', e.target.value)} />
                    </div>
                    {/* Placeholder div to align next item correctly if odd number of fields */}
                    <div className="hidden md:block"></div> 

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Harga <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Rp" onChange={e => handleDetailChange('harga', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">PPN 11% <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Rp" onChange={e => handleDetailChange('ppn11', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Ongkir KUT <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Rp" onChange={e => handleDetailChange('ongkirKUT', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Harga PPN 11% Ongkir <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Rp" onChange={e => handleDetailChange('hargaPPN11Ongkir', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Total Harga + Ongkir <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Rp" onChange={e => handleDetailChange('totalHargaOngkir', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Total Harga Jual <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Rp" onChange={e => handleDetailChange('totalHargaJual', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Harga PPN 11% Ongkir Reseller <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Rp" onChange={e => handleDetailChange('hargaPPN11OngkirReseller', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">PPN 11% Reseller <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Rp" onChange={e => handleDetailChange('ppn11Reseller', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Ongkir Reseller <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Rp" onChange={e => handleDetailChange('ongkirReseller', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    {/* Placeholder */}
                    <div className="hidden md:block"></div>
                    
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Total Harga + Ongkir Reseller <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Rp" onChange={e => handleDetailChange('totalHargaOngkirReseller', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Total Harga Reseller <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Rp" onChange={e => handleDetailChange('totalHargaReseller', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Status Pesanan <span className="text-red-500">*</span></label>
                  <select onChange={e => handleDetailChange('statusPesanan', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option value="">Pilih Status</option>
                    <option value="Proses">Proses</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Status Odoo <span className="text-red-500">*</span></label>
                  <select onChange={e => handleDetailChange('statusOdoo', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option value="">Pilih Status</option>
                    <option value="Draft">Draft</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                {isManual && (
                  <>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Bulan Pengiriman SPH <span className="text-red-500">*</span></label>
                      <select onChange={e => handleDetailChange('bulanPengirimanSPH', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                        <option value="">Pilih Bulan</option>
                        <option value="Januari">Januari</option>
                        <option value="Februari">Februari</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Nomor Surat Penawaran Harga <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Masukkan Nomor" onChange={e => handleDetailChange('nomorSuratPenawaranHarga', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Nomor Kontrak Berlangganan <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Masukkan Nomor" onChange={e => handleDetailChange('nomorKontrakBerlangganan', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                  </>
                )}

                {isTimbangan && (
                  <>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Nomor Penyampaian Daftar Harga <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Masukkan Nomor" onChange={e => handleDetailChange('nomorPenyampaianDaftarHarga', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Nomor Formulir Pembelian <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Masukkan Nomor" onChange={e => handleDetailChange('nomorFormulirPembelian', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                    </div>
                  </>
                )}

                {isManual && isIoT && (
                   <div className="space-y-1">
                     <label className="text-sm font-medium text-gray-700">Nomor Formulir Berlangganan <span className="text-red-500">*</span></label>
                     <input type="text" placeholder="Masukkan Nomor" onChange={e => handleDetailChange('nomorFormulirBerlangganan', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                   </div>
                )}
              </div>
            </div>

            {/* Bagian 4: Detail Purchase Order */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-[#eef5f5] px-6 py-3 border-b border-gray-200 flex items-center gap-2 text-teal-800 font-semibold">
                <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">i</span>
                Detail Purchase Order
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Tanggal Pesanan PO <span className="text-red-500">*</span></label>
                  <CustomDatePicker value={(detail.tanggalPesananPO as string) || ''} onChange={e => handleDetailChange('tanggalPesananPO', e.target.value)} />
                </div>
                {isTimbangan && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Nomor PO KUT <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Masukkan Nomor" onChange={e => handleDetailChange('nomorPOKUT', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Tanggal BAST <span className="text-red-500">*</span></label>
                  <CustomDatePicker value={(detail.tanggalBAST as string) || ''} onChange={e => handleDetailChange('tanggalBAST', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nomor BAST <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Masukkan Nomor" onChange={e => handleDetailChange('nomorBAST', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nomor Invoice KUT <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Masukkan Nomor" onChange={e => handleDetailChange('nomorInvoiceKUT', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Tanggal Invoice KUT <span className="text-red-500">*</span></label>
                  <CustomDatePicker value={(detail.tanggalInvoiceKUT as string) || ''} onChange={e => handleDetailChange('tanggalInvoiceKUT', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nomor Invoice Inaproc <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Masukkan Nomor" onChange={e => handleDetailChange('nomorInvoiceInaproc', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">NSFP <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Masukkan NSFP" onChange={e => handleDetailChange('nsfp', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Tanggal Uang Masuk <span className="text-red-500">*</span></label>
                  <CustomDatePicker value={(detail.tanggalUangMasuk as string) || ''} onChange={e => handleDetailChange('tanggalUangMasuk', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Jumlah Uang Masuk <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Rp0" onChange={e => handleDetailChange('jumlahUangMasuk', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Rekening Penerima <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Masukkan Nomor Rekening Penerima" onChange={e => handleDetailChange('rekeningPenerima', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Kode Bayar <span className="text-red-500">*</span></label>
                  <select onChange={e => handleDetailChange('kodeBayar', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option value="">Pilih Kode Bayar</option>
                    <option value="KOD-001">KOD-001</option>
                    <option value="KOD-002">KOD-002</option>
                  </select>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Keterangan <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Masukkan Keterangan" onChange={e => handleDetailChange('keterangan', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                </div>
              </div>
            </div>

            {/* Actions */}
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

