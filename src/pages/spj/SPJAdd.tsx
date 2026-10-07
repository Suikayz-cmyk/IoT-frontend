/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { ChevronLeft } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { masterApi } from '@/api/masterApi'
import { spjApi } from '@/api/spj'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CustomDatePicker from '@/components/ui/CustomDatePicker'
import { Combobox } from '@/components/ui/combobox'
import { toast } from "sonner";

export default function SPJAdd() {
  const navigate = useNavigate()
  const { id } = useParams()
  const queryClient = useQueryClient()

  // Ambil data SPJ jika mode Edit
  const { data: editData } = useQuery({
    queryKey: ['spj', id],
    queryFn: () => spjApi.findById(id!),
    enabled: !!id
  })

  // Ambil data master
  const { data: instansiList = [] } = useQuery({ queryKey: ['master_instansi'], queryFn: masterApi.getInstansi })
  const { data: picList = [] } = useQuery({ queryKey: ['master_pic'], queryFn: masterApi.getPIC })

  // Bagian 1: Kategori
  const [kategori] = useState('SPJ')

  // Bagian 2: Data Pemesan
  const [namaInstansi, setNamaInstansi] = useState('')
  const [namaPIC, setNamaPIC] = useState('')
  const [noTelpPIC, setNoTelpPIC] = useState('')
  const [alamat, setAlamat] = useState('')
  const [kota, setKota] = useState('')
  const [provinsi, setProvinsi] = useState('')

  // Bagian 3: Detail SPJ
  const [tglPrint, setTglPrint] = useState('')
  const [tglUpdateList, setTglUpdateList] = useState('')
  const [tglTandaTangan, setTglTandaTangan] = useState('')
  const [tglPengiriman, setTglPengiriman] = useState('')
  const [tglParaf, setTglParaf] = useState('')
  const [kebutuhanSPJ, setKebutuhanSPJ] = useState('')
  const [jumlahRangkap, setJumlahRangkap] = useState('1')
  const [jenisKertas, setJenisKertas] = useState('')
  const [jenisFile, setJenisFile] = useState('')
  const [picPrint, setPicPrint] = useState('')

  // Edit mode pre-fill
  useEffect(() => {
    if (editData) {
      setNamaInstansi(editData.namaInstansi)
      setNamaPIC(editData.namaPIC)
      setNoTelpPIC(editData.noTelpPIC || '')
      setAlamat(editData.alamat || '')
      setKota(editData.kota || '')
      setProvinsi(editData.provinsi || '')
      setTglPrint(editData.tglPrint || '')
      setTglUpdateList(editData.tglUpdateList || '')
      setTglTandaTangan(editData.tglSign || '')
      setTglPengiriman(editData.tglPengiriman || '')
      setTglParaf(editData.tglParaf || '')
      setKebutuhanSPJ(editData.kebutuhanSPJ || '')
      setJumlahRangkap(editData.jumlahRangkap || '1')
      setJenisKertas(editData.jenisKertas || '')
      setJenisFile(editData.jenisFile || '')
      setPicPrint(editData.picPrint || '')
    }
  }, [editData])

  const handleInstansiChange = (val: string) => {
    setNamaInstansi(val)
    const found = instansiList.find(item => item.namaInstansi.toLowerCase() === val.toLowerCase())
    if (found) {
      setAlamat(found.alamat || '')
      setKota(found.kotaKab || '')
      setProvinsi(found.provinsi || '')
      
      const relatedPICs = picList.filter(p => String(p.instansiId) === String(found.id))
      if (relatedPICs.length > 0) {
        setNamaPIC(relatedPICs[0].namaPIC)
        setNoTelpPIC(relatedPICs[0].noTelp || '')
      }
    }
  }

  const handlePicChange = (val: string) => {
    setNamaPIC(val)
    const found = picList.find(item => item.namaPIC.toLowerCase() === val.toLowerCase())
    if (found) {
      setNoTelpPIC(found.noTelp || '')
    }
  }

  const saveMutation = useMutation({
    mutationFn: id ? (payload: any) => spjApi.update(id, payload) : spjApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spj'] })
      toast.success('Data SPJ berhasil disimpan!')
      navigate('/spj')
    },
    onError: (err) => toast.error('Gagal menyimpan data SPJ: ' + (err as Error).message)
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const foundInstansi = instansiList.find(item => item.namaInstansi.toLowerCase() === namaInstansi.toLowerCase())
    const foundPic = picList.find(item => item.namaPIC.toLowerCase() === namaPIC.toLowerCase())
    
    saveMutation.mutate({
      namaInstansi: foundInstansi ? String(foundInstansi.id) : namaInstansi,
      namaPIC: foundPic ? String(foundPic.id) : namaPIC,
      tglPrint,
      tglUpdateList,
      tglSign: tglTandaTangan,
      tglPengiriman,
      tglParaf,
      kebutuhanSPJ,
      jumlahRangkap,
      jenisKertas,
      jenisFile,
      picPrint
    })
  }

  return (
    <DashboardLayout title="">
      <div className="mb-6 flex items-center gap-4 sticky top-0 bg-[#f8f9fa] z-10 pt-4 pb-4 border-b border-gray-100">
        <Button variant="outline" type="button" onClick={() => navigate('/spj')} 
          className="p-2 bg-white !rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors inline-flex shadow-sm"
          title="Kembali"
        >
          <ChevronLeft size={20} />
        </Button>
        <h2 className="text-xl font-semibold text-gray-800">{id ? 'Form Edit Data SPJ' : 'Form Tambah Data SPJ'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pb-12">
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Pilih Kategori <span className="text-red-500">*</span></label>
            <select 
              value={kategori}
              disabled
              className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-600 outline-none"
            >
              <option value="SPJ">SPJ</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#eef5f5] px-6 py-3 border-b border-gray-200 flex items-center gap-2 text-teal-800 font-semibold">
            <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">i</span>
            <span className="text-base font-semibold">Data Pemesan</span>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Nama Instansi Pemesan <span className="text-red-500">*</span></label>
              <Combobox 
                options={instansiList.map((item: any) => ({ value: item.namaInstansi, label: item.namaInstansi }))}
                value={namaInstansi}
                onChange={(val) => handleInstansiChange(val)}
                placeholder="Pilih atau ketik instansi..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Nama PIC <span className="text-red-500">*</span></label>
              <Input 
                type="text"
                value={namaPIC}
                onChange={(e) => handlePicChange(e.target.value)}
                placeholder="Ketik nama PIC"
                required
              />
              <p className="text-xs text-gray-500">Terisi otomatis dari hasil cek, bisa diubah</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Nomor Telepon PIC <span className="text-red-500">*</span></label>
              <Input type="text" value={noTelpPIC} onChange={(e) => setNoTelpPIC(e.target.value)} required />
              <p className="text-xs text-gray-500">Terisi otomatis dari hasil cek, bisa diubah</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Alamat <span className="text-red-500">*</span></label>
              <Input type="text" value={alamat} onChange={(e) => setAlamat(e.target.value)} required />
              <p className="text-xs text-gray-500">Terisi otomatis dari hasil cek, bisa diubah</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Kota/Kabupaten <span className="text-red-500">*</span></label>
              <Input type="text" value={kota} onChange={(e) => setKota(e.target.value)} required />
              <p className="text-xs text-gray-500">Terisi otomatis dari hasil cek, bisa diubah</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Provinsi <span className="text-red-500">*</span></label>
              <Input type="text" value={provinsi} onChange={(e) => setProvinsi(e.target.value)} required />
              <p className="text-xs text-gray-500">Terisi otomatis dari hasil cek, bisa diubah</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#eef5f5] px-6 py-3 border-b border-gray-200 flex items-center gap-2 text-teal-800 font-semibold">
            <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">i</span>
            <span className="text-base font-semibold">Detail SPJ</span>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Tanggal Print <span className="text-red-500">*</span></label>
              <CustomDatePicker value={tglPrint} onChange={(e) => setTglPrint(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Tanggal Update List <span className="text-red-500">*</span></label>
              <CustomDatePicker value={tglUpdateList} onChange={(e) => setTglUpdateList(e.target.value)} required />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Tanggal Tanda Tangan <span className="text-red-500">*</span></label>
              <CustomDatePicker value={tglTandaTangan} onChange={(e) => setTglTandaTangan(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Tanggal Pengiriman SPJ <span className="text-red-500">*</span></label>
              <CustomDatePicker value={tglPengiriman} onChange={(e) => setTglPengiriman(e.target.value)} required />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Tanggal Paraf <span className="text-red-500">*</span></label>
              <CustomDatePicker value={tglParaf} onChange={(e) => setTglParaf(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Kebutuhan SPJ <span className="text-red-500">*</span></label>
              <Input type="text" value={kebutuhanSPJ} onChange={(e) => setKebutuhanSPJ(e.target.value)} required placeholder="Masukkan Keterangan" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Jumlah Rangkap <span className="text-red-500">*</span></label>
              <select value={jumlahRangkap} onChange={(e) => setJumlahRangkap(e.target.value)} required className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f766e] transition-all">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Jenis Kertas <span className="text-red-500">*</span></label>
              <select value={jenisKertas} onChange={(e) => setJenisKertas(e.target.value)} required className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f766e] transition-all">
                <option value="">Pilih Jenis</option>
                <option value="A4">A4</option>
                <option value="F4">F4</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Jenis File <span className="text-red-500">*</span></label>
              <select value={jenisFile} onChange={(e) => setJenisFile(e.target.value)} required className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f766e] transition-all">
                <option value="">Pilih Jenis</option>
                <option value="PDF">PDF</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">PIC Print <span className="text-red-500">*</span></label>
              <Input type="text" value={picPrint} onChange={(e) => setPicPrint(e.target.value)} required placeholder="Masukkan Nama" />
            </div>

          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-8">
          <Button variant="outline" type="button" 
            onClick={() => navigate('/spj')}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Batal
          </Button>
          <Button variant="default" type="submit" disabled={saveMutation.isPending}>
            {saveMutation.isPending ? 'Menyimpan...' : 'Lanjut / Simpan'}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  )
}

