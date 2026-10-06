import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Plus, Search, Eye } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { spjApi } from '@/api/spj'
import { formatDate } from '@/utils/formatters'

export default function SPJPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const { data: spjList, isLoading, refetch } = useQuery({
    queryKey: ['spj'],
    queryFn: spjApi.findAll
  })

  
  const updateStatusMut = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => spjApi.updateStatus(id, status),
    onSuccess: () => refetch(),
    onError: (err: Error) => alert('Gagal update status: ' + err.message)
  })

  const deleteMut = useMutation({
    mutationFn: spjApi.delete,
    onSuccess: () => refetch(),
    onError: (err: Error) => alert('Gagal menghapus: ' + err.message)
  })

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus dokumen SPJ ini?')) {
      deleteMut.mutate(id)
    }
  }

  const filteredData = spjList?.filter(item => 
    item.kodePemesanan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.namaInstansi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.namaPIC?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  return (
    <DashboardLayout 
      title="Data SPJ" 
      onExport={() => alert('Fitur Export dalam pengembangan')}
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input type="text" 
              placeholder="Cari Instansi, PIC, atau Kode..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4871f7] focus:border-transparent"
            />
          </div>
          
          <Button variant="outline" onClick={() => navigate('/spj/add')}
            className="flex items-center gap-2 bg-[#0f766e] hover:bg-[#115e59] text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shrink-0"
          >
            <Plus size={20} />
            <span>Tambah Data</span>
          </Button>
        </div>

        <div className="overflow-x-auto min-h-100">
          <table className="w-full text-left border-collapse min-w-200">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                <th className="py-3 px-5 font-medium whitespace-nowrap">Kode SPJ</th>
                <th className="py-3 px-5 font-medium">Instansi</th>
                <th className="py-3 px-5 font-medium">Kebutuhan SPJ</th>
                <th className="py-3 px-5 font-medium">Tgl Print</th>
                <th className="py-3 px-5 font-medium">PIC Print</th>
                <th className="py-3 px-5 font-medium">Tgl Pengiriman</th>
                <th className="py-3 px-5 font-medium">Status Pesanan</th>
                <th className="py-3 px-5 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">Memuat data...</td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">Tidak ada data SPJ.</td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-5 font-medium text-gray-900">
                      <div>{item.kodePemesanan || `SPJ-${item.id}`}</div>
                      <div className="text-xs text-gray-500">{formatDate(item.tanggalOrder)}</div>
                    </td>
                    <td className="py-3 px-5">
                      <div className="font-medium text-gray-800">{item.namaInstansi || `Instansi ID: ${item.namaInstansi}`}</div>
                      <div className="text-xs text-gray-500">PIC: {item.namaPIC || '-'}</div>
                    </td>
                    <td className="py-3 px-5 font-medium text-gray-700">{item.kebutuhanSPJ}</td>
                    <td className="py-3 px-5 text-gray-600">{formatDate(item.tglPrint)}</td>
                    <td className="py-3 px-5 text-gray-600">{item.picPrint}</td>
                    <td className="py-3 px-5 text-gray-600">{formatDate(item.tglPengiriman)}</td>
                    <td className="py-3 px-5">
                      <select 
                        value={(item.statusPesanan || '').toLowerCase()} 
                        onChange={(e) => {
                          if (window.confirm(`Yakin ingin mengubah status SPJ menjadi '${e.target.value}'?`)) {
                            updateStatusMut.mutate({ id: item.id, status: e.target.value })
                          }
                        }}
                        className={`text-sm font-medium border rounded px-2 py-1 outline-none ${(item.statusPesanan || '').toLowerCase() === 'selesai' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}
                      >
                        <option value="">Pilih Status</option>
                        <option value="diproses">Diproses</option>
                        <option value="selesai">Selesai</option>
                      </select>
                    </td>
                    <td className="py-3 px-5 text-center flex items-center justify-center gap-1">
                      <Button variant="outline" onClick={() => navigate(`/spj/${item.id}`)}
                        className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye size={18} />
                      </Button>
                      <Button variant="outline" onClick={() => navigate(`/spj/edit/${item.id}`)}
                        className="text-amber-600 hover:bg-amber-50 p-1.5 rounded transition-colors"
                        title="Edit Data"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                      </Button>
                      <Button variant="outline" onClick={() => handleDelete(item.id)}
                        disabled={deleteMut.isPending}
                        className="text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors disabled:opacity-50"
                        title="Hapus Data"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-200 text-sm text-gray-500 flex justify-between items-center">
          <span>Menampilkan {filteredData.length} data</span>
        </div>
      </div>
    </DashboardLayout>
  )
}
