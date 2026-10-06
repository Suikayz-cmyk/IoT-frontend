import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useQuery } from '@tanstack/react-query'
import { pemesananApi } from '@/api/pemesanan'
import { masterApi } from '@/api/masterApi'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { formatDate } from '@/utils/formatters'
const ReadOnlyField = ({ label, value }: { label: string, value: string | number | undefined }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <Input type="text" value={value || '-'} readOnly  />
  </div>
)

export default function PemesananDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['pemesanan', id],
    queryFn: () => pemesananApi.getById(id!),
    enabled: !!id
  })

  const { data: wilayahList = [] } = useQuery({ queryKey: ["master_wilayah"], queryFn: masterApi.getWilayah })
  const { data: ekspedisiList = [] } = useQuery({ queryKey: ["master_ekspedisi"], queryFn: masterApi.getEkspedisi })

  if (isLoading) {
    return (
      <DashboardLayout title="Detail Pemesanan">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
        </div>
      </DashboardLayout>
    )
  }

  if (isError) {
    return (
      <DashboardLayout title="Detail Pemesanan">
        <div className="bg-red-50 text-red-500 p-4 rounded-md overflow-auto">
          <p className="font-bold">Terjadi Kesalahan API (getById):</p>
          <pre className="text-sm mt-2 whitespace-pre-wrap">{JSON.stringify(error, null, 2)}</pre>
          <p className="mt-2">Pesan: {error instanceof Error ? error.message : String(error)}</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!data) {
    return (
      <DashboardLayout title="Detail Pemesanan">
        <div className="bg-red-50 text-red-500 p-4 rounded-md">Data tidak ditemukan</div>
      </DashboardLayout>
    )
  }

  const { kategori } = data
  const isTimbangan = kategori === 'Timbangan Inaproc' || kategori === 'Timbangan Manual' || kategori?.startsWith('RCW')
  const isIoT = kategori === 'IoT Inaproc' || kategori === 'IoT Manual'
  const isManual = kategori === 'IoT Manual' || kategori === 'Timbangan Manual'

  return (
    <DashboardLayout title="">
      
      <div className="mb-6 flex items-center gap-4 sticky top-0 bg-[#f8f9fa] z-10 pt-4.25 pb-4">
        <Button variant="outline" onClick={() => navigate('/pemesanan')}
          className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors inline-flex shadow-sm"
          title="Kembali"
        >
          <ChevronLeft size={20} />
        </Button>
        <h2 className="text-xl font-semibold text-gray-800">Lihat Detail</h2>
      </div>

      <div className="space-y-6 pb-12">

        <Card className="p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReadOnlyField label="Kategori" value={data.kategori} />
          <ReadOnlyField label="Kode Pemesanan" value={data.kodePemesanan} />
        </Card>

        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="bg-[#eef5f5] px-6 py-3 border-b flex flex-row items-center gap-2 space-y-0 text-teal-800 font-semibold">
            <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">i</span>
            <CardTitle className="text-base font-semibold">Data Pemesan</CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <ReadOnlyField label="Nama Instansi Pemesan" value={data.namaInstansi} />
            <ReadOnlyField label="Nama PIC" value={data.namaPIC} />
            <ReadOnlyField label="Nomor Telepon PIC" value={data.noTelpPIC} />
            {data.kategori !== 'IoT Inaproc' && <ReadOnlyField label="E-Mail" value={data.emailPIC} />}
            <ReadOnlyField label="NIK PIC" value={data.nikPIC} />
            <ReadOnlyField label="Nomor NPWP" value={data.noNPWP} />
            <ReadOnlyField label="Alamat" value={data.alamat} />
            <ReadOnlyField label="Kota/Kabupaten" value={data.kota} />
            <ReadOnlyField label="Provinsi" value={data.provinsi} />
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="bg-[#eef5f5] px-6 py-3 border-b flex flex-row items-center gap-2 space-y-0 text-teal-800 font-semibold">
            <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">i</span>
            <CardTitle className="text-base font-semibold">Detail {kategori}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            
            {isIoT && (
              <>
                <ReadOnlyField label="Quantity" value={data.quantity} />
                <ReadOnlyField label="Periode Berlangganan" value={data.periodeBerlangganan} />
                <ReadOnlyField label="Harga + PPN" value={data.hargaPPN} />
              </>
            )}

            {isTimbangan && (
              <>
                <ReadOnlyField label="Tipe Timbangan Produk" value={data.tipeTimbangan} />
                <ReadOnlyField label="Quantity" value={data.quantity} />
                <ReadOnlyField label="Wilayah Pengiriman" value={wilayahList.find(w => String(w.id) === String(data.wilayahPengiriman))?.namaWilayah || data.wilayahPengiriman} />
                <ReadOnlyField label="Berat (KG)" value={data.berat} />
                <ReadOnlyField label="Ekspedisi" value={ekspedisiList.find(e => String(e.id) === String(data.ekspedisi))?.namaEkspedisi || data.ekspedisi} />
                <ReadOnlyField label="Nomor Resi" value={data.nomorResi} />
                <ReadOnlyField label="Tanggal Barang Diterima" value={formatDate(data.tanggalBarangDiterima)} />
                <div className="hidden md:block"></div> 
                <ReadOnlyField label="Harga" value={data.harga} />
                <ReadOnlyField label="PPN 11%" value={data.ppn11} />
                <ReadOnlyField label="Ongkir KUT" value={data.ongkirKUT} />
                <ReadOnlyField label="Harga PPN 11% + Ongkir" value={data.hargaPPN11Ongkir} />
                <ReadOnlyField label="Total Harga + Ongkir" value={data.totalHargaOngkir} />
                <ReadOnlyField label="Total Harga Jual" value={data.totalHargaJual} />
                <ReadOnlyField label="Harga Produk Reseller" value={data.hargaProdukReseller} />
                <ReadOnlyField label="PPN 11% Reseller" value={data.ppn11Reseller} />
                <ReadOnlyField label="Ongkir Reseller" value={data.ongkirReseller} />
                <ReadOnlyField label="Harga PPN 11% + Ongkir Reseller" value={data.hargaPPN11OngkirReseller} />
                <ReadOnlyField label="Total Harga + Ongkir Reseller" value={data.totalHargaOngkirReseller} />
                <ReadOnlyField label="Total Harga Reseller" value={data.totalHargaReseller} />
              </>
            )}

            <ReadOnlyField label="Status Pesanan" value={data.statusPesanan} />
            <ReadOnlyField label="Status Odoo" value={data.statusOdoo} />

            {data.kategori === 'IoT Manual' && (
              <>
                <ReadOnlyField label="Bulan Pengiriman SPH" value={data.bulanPengirimanSPH} />
                <ReadOnlyField label="Nomor Surat Penawaran Harga" value={data.nomorSuratPenawaranHarga} />
                <ReadOnlyField label="Nomor Kontrak Berlangganan" value={data.nomorKontrakBerlangganan} />
              </>
            )}

            {isTimbangan && (
              <>
                <ReadOnlyField label="Nomor Penyampaian Daftar Harga" value={data.nomorPenyampaianDaftarHarga} />
                <ReadOnlyField label="Nomor Formulir Pembelian" value={data.nomorFormulirPembelian} />
              </>
            )}

            {isManual && isIoT && (
               <ReadOnlyField label="Nomor Formulir Berlangganan" value={data.nomorFormulirBerlangganan} />
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-sm">
          <CardHeader className="bg-[#eef5f5] px-6 py-3 border-b flex flex-row items-center gap-2 space-y-0 text-teal-800 font-semibold">
            <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">i</span>
            <CardTitle className="text-base font-semibold">Detail Purchase Order</CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <ReadOnlyField label="Tanggal Pesanan PO" value={formatDate(data.tanggalPesananPO)} />
            {isTimbangan && (
              <ReadOnlyField label="Nomor PO KUT" value={data.nomorPOKUT} />
            )}
            <ReadOnlyField label="Tanggal BAST" value={formatDate(data.tanggalBAST)} />
            <ReadOnlyField label="Nomor BAST" value={data.nomorBAST} />
            <ReadOnlyField label="Nomor Invoice KUT" value={data.nomorInvoiceKUT} />
            <ReadOnlyField label="Tanggal Invoice KUT" value={formatDate(data.tanggalInvoiceKUT)} />
            {data.kategori !== 'IoT Manual' && (
              <ReadOnlyField label="Nomor Invoice Inaproc" value={data.nomorInvoiceInaproc} />
            )}
            <ReadOnlyField label="NSFP" value={data.nsfp} />
            <ReadOnlyField label="Tanggal Uang Masuk" value={formatDate(data.tanggalUangMasuk)} />
            <ReadOnlyField label="Jumlah Uang Masuk" value={data.jumlahUangMasuk} />
            <ReadOnlyField label="Rekening Penerima" value={data.rekeningPenerima} />
            {data.kategori !== 'IoT Manual' && (
              <ReadOnlyField label="Kode Bayar" value={data.kodeBayar} />
            )}
            <div className="md:col-span-2">
              <ReadOnlyField label="Keterangan" value={data.keterangan} />
            </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  )
}

