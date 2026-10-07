import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { ChevronLeft } from 'lucide-react'
import { formatDate } from '@/utils/formatters'
import { useQuery } from '@tanstack/react-query'
import { spjApi } from '@/api/spj'

const ReadOnlyField = ({ label, value, helperText }: { label: string, value: string | number | undefined, helperText?: string }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <Input type="text" value={value || '-'} readOnly  />
    {helperText && <p className="text-xs text-gray-400">{helperText}</p>}
  </div>
)

export default function SPJDetail() {
  const navigate = useNavigate()
  const { id } = useParams()

  const { data: data, isLoading, isError } = useQuery({
    queryKey: ['spj', id],
    queryFn: () => spjApi.findById(id as string),
    enabled: !!id
  })

  if (isLoading) return <DashboardLayout title="Detail SPJ"><div className="p-4">Loading...</div></DashboardLayout>;
  if (isError || !data) return <DashboardLayout title="Detail SPJ"><div className="p-4">Terjadi kesalahan atau data tidak ditemukan.</div></DashboardLayout>;

  return (
    <DashboardLayout title="">
      <div className="mb-6 flex items-center gap-4 sticky top-0 bg-[#f8f9fa] z-10 pt-4.25 pb-4">
        <Button variant="outline" onClick={() => navigate('/spj')}
          className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors inline-flex shadow-sm"
          title="Kembali"
        >
          <ChevronLeft size={20} />
        </Button>
        <h2 className="text-xl font-semibold text-gray-800">Lihat Detail</h2>
      </div>

      <div className="space-y-6 pb-12">
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReadOnlyField label="Kategori" value={data.kategori} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#eef5f5] px-6 py-3 border-b border-gray-200 flex flex-row items-center gap-2 space-y-0 text-teal-800 font-semibold">
            <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">i</span>
            <span className="text-base font-semibold">Data Pemesan</span>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <ReadOnlyField label="Nama Instansi Pemesan" value={data.namaInstansi} />
            <ReadOnlyField label="Nama PIC" value={data.namaPIC} helperText="Terisi otomatis dari hasil cek, bisa diubah" />
            <ReadOnlyField label="Nomor Telepon PIC" value={data.noTelpPIC} helperText="Terisi otomatis dari hasil cek, bisa diubah" />
            <ReadOnlyField label="Alamat" value={data.alamat} helperText="Terisi otomatis dari hasil cek, bisa diubah" />
            <ReadOnlyField label="Kota/Kabupaten" value={data.kota} helperText="Terisi otomatis dari hasil cek, bisa diubah" />
            <ReadOnlyField label="Provinsi" value={data.provinsi} helperText="Terisi otomatis dari hasil cek, bisa diubah" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#eef5f5] px-6 py-3 border-b border-gray-200 flex flex-row items-center gap-2 space-y-0 text-teal-800 font-semibold">
            <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">i</span>
            <span className="text-base font-semibold">Detail SPJ</span>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <ReadOnlyField label="Tanggal Print" value={formatDate(data.tglPrint)} />
            <ReadOnlyField label="Tanggal Update List" value={formatDate(data.tglUpdateList)} />
            <ReadOnlyField label="Tanggal Tanda Tangan" value={formatDate(data.tglTandaTangan)} />
            <ReadOnlyField label="Tanggal Pengiriman SPJ" value={formatDate(data.tglPengiriman)} />
            <ReadOnlyField label="Tanggal Paraf" value={formatDate(data.tglParaf)} />
            <ReadOnlyField label="Kebutuhan SPJ" value={data.kebutuhanSPJ} />
            <ReadOnlyField label="Jumlah Rangkap" value={data.jumlahRangkap} />
            <ReadOnlyField label="Jenis Kertas" value={data.jenisKertas} />
            <ReadOnlyField label="Jenis File" value={data.jenisFile} />
            <ReadOnlyField label="PIC Print" value={data.picPrint} />
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

