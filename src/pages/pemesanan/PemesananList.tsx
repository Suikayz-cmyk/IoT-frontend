import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Plus, Search, Eye } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { pemesananApi } from '@/api/pemesanan'
import { formatDate } from '@/utils/formatters'

export default function PemesananList() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const { data: pemesananList, isLoading, refetch } = useQuery({
    queryKey: ['pemesanan'],
    queryFn: pemesananApi.getAll
  })

  const updateMut = useMutation({
    mutationFn: ({ id, payload }: { id: string, payload: Record<string, string> }) => pemesananApi.update(id, payload),
    onSuccess: () => refetch(),
    onError: (err: Error) => alert('Gagal update status: ' + err.message)
  })

  const deleteMut = useMutation({
    mutationFn: pemesananApi.delete,
    onSuccess: () => refetch(),
    onError: (err: Error) => alert('Gagal menghapus: ' + err.message)
  })

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus pesanan ini beserta semua data Inaproc/Manual terkait?')) {
      deleteMut.mutate(id)
    }
  }

  const filteredData = pemesananList?.filter(item => 
    item.kodePemesanan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.namaInstansi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.namaPIC.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kategori.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  return (
    <DashboardLayout 
      title="Data Pemesanan" 
      onExport={() => alert('Fitur Export dalam pengembangan')}
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Cari Instansi, PIC, Kategori atau Kode..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4871f7] focus:border-transparent"
            />
          </div>
          
          <button 
            onClick={() => navigate('/pemesanan/add')}
            className="flex items-center gap-2 bg-[#0f766e] hover:bg-[#115e59] text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shrink-0"
          >
            <Plus size={20} />
            <span>Tambah Data</span>
          </button>
        </div>

        <div className="overflow-x-auto min-h-100">
          <table className="w-full text-left border-collapse min-w-200">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                <th className="py-3 px-5 font-medium whitespace-nowrap">Kode Pemesanan</th>
                  <th className="py-3 px-5 font-medium whitespace-nowrap">Tanggal PO</th>
                <th className="py-3 px-5 font-medium">Instansi</th>
                <th className="py-3 px-5 font-medium">Produk & Qty</th>
                                <th className="py-3 px-5 font-medium">Status Pesanan</th>
                <th className="py-3 px-5 font-medium">Status Odoo</th>
                  <th className="py-3 px-5 font-medium whitespace-nowrap">Dibuat Pada</th>
                  <th className="py-3 px-5 font-medium whitespace-nowrap">Terakhir Update</th>
                <th className="py-3 px-5 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-500">Memuat data...</td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-gray-500">Tidak ada data pemesanan.</td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-5 font-medium text-gray-900">{item.kodePemesanan}</td>
                      <td className="py-3 px-5">{formatDate(item.tanggalPesananPO)}</td>
                    <td className="py-3 px-5">{item.namaInstansi}</td>
                    <td className="py-3 px-5">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">{item.kategori}</span>
                        <span className="text-xs text-gray-500">Qty: {item.quantity || 1}</span>
                      </div>
                    </td>
                    
                    <td className="py-3 px-5">
                      <select 
                        value={item.statusPesanan || ''} 
                        onChange={(e) => updateMut.mutate({ id: item.id, payload: { statusPesanan: e.target.value } })}
                        className={`text-sm font-medium border rounded px-2 py-1 outline-none ${item.statusPesanan === 'LUNAS' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}
                      >
                        <option value="">Pilih Status</option>
                        <option value="Sudah Pembayaran">Sudah Pembayaran</option>
                        <option value="Belum Pembayaran">Belum Pembayaran</option>
                        <option value="Proses">Proses</option>
                        <option value="Selesai">Selesai</option>
                        <option value="LUNAS">LUNAS</option>
                      </select>
                    </td>
                    <td className="py-3 px-5">
                      <select 
                        value={item.statusOdoo || ''} 
                        onChange={(e) => updateMut.mutate({ id: item.id, payload: { statusOdoo: e.target.value } })}
                        className="text-sm border rounded px-2 py-1 outline-none bg-gray-50 text-gray-700 border-gray-300"
                      >
                        <option value="">Pilih Status</option>
                        <option value="Sudah Ada">Sudah Ada</option>
                        <option value="Belum Ada">Belum Ada</option>
                        <option value="Draft">Draft</option>
                        <option value="Done">Done</option>
                      </select>
                    </td>
                    <td className="py-3 px-5">{formatDate(item.createdAt)}</td>
                      <td className="py-3 px-5">{formatDate(item.updatedAt)}</td>
                      <td className="py-3 px-5 text-center flex items-center justify-center gap-1">
                      <button 
                        onClick={() => navigate(`/pemesanan/${item.id}`)}
                        className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => navigate(`/pemesanan/edit/${item.id}`)}
                        className="text-amber-600 hover:bg-amber-50 p-1.5 rounded transition-colors"
                        title="Edit Data"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        disabled={deleteMut.isPending}
                        className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors disabled:opacity-50"
                        title="Hapus Data"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
          <span>Menampilkan {filteredData.length} data</span>
        </div>
      </div>
    </DashboardLayout>
  )
}

