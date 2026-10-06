import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Plus, Search, Eye, ChevronDown } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { spjApi } from '@/api/spj'
import { formatDate } from '@/utils/formatters'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


export default function SPJPage() {
  const navigate = useNavigate()

  const getStatusStyles = (status: string | undefined | null) => {
    if (!status) return 'bg-slate-100 text-slate-700 border-slate-200';
    const s = status.toLowerCase();
    if (s === 'baru') return 'bg-sky-50 text-sky-700 border border-sky-200';
    if (s === 'pending') return 'bg-amber-50 text-amber-700 border border-amber-200';
    if (s === 'diproses' || s === 'proses') return 'bg-orange-50 text-orange-700 border border-orange-200';
    if (s === 'dikirim') return 'bg-blue-50 text-blue-700 border border-blue-200';
    if (s === 'selesai') return 'bg-emerald-50 text-emerald-800 border border-emerald-200';
    if (s === 'batal') return 'bg-rose-50 text-rose-700 border border-rose-200';
    return 'bg-slate-100 text-slate-700 border border-slate-200';
  };

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
          <Table className="w-full text-left border-collapse min-w-200">
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                <TableHead className="py-3 px-5 font-medium whitespace-nowrap">Kode SPJ</TableHead>
                <TableHead className="py-3 px-5 font-medium">Instansi</TableHead>
                <TableHead className="py-3 px-5 font-medium">Kebutuhan SPJ</TableHead>
                <TableHead className="py-3 px-5 font-medium">Tgl Print</TableHead>
                <TableHead className="py-3 px-5 font-medium">PIC Print</TableHead>
                <TableHead className="py-3 px-5 font-medium">Tgl Pengiriman</TableHead>
                <TableHead className="py-3 px-5 font-medium">Status Pesanan</TableHead>
                <TableHead className="py-3 px-5 font-medium text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200 text-sm text-gray-700">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-gray-500">Memuat data...</TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-gray-500">Tidak ada data SPJ.</TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="py-3 px-5 font-medium text-gray-900">
                      <div>{item.kodePemesanan || `SPJ-${item.id}`}</div>
                      <div className="text-xs text-gray-500">{formatDate(item.tanggalOrder)}</div>
                    </TableCell>
                    <TableCell className="py-3 px-5">
                      <div className="font-medium text-gray-800">{item.namaInstansi || `Instansi ID: ${item.namaInstansi}`}</div>
                      <div className="text-xs text-gray-500">PIC: {item.namaPIC || '-'}</div>
                    </TableCell>
                    <TableCell className="py-3 px-5 font-medium text-gray-700">{item.kebutuhanSPJ}</TableCell>
                    <TableCell className="py-3 px-5 text-gray-600">{formatDate(item.tglPrint)}</TableCell>
                    <TableCell className="py-3 px-5 text-gray-600">{item.picPrint}</TableCell>
                    <TableCell className="py-3 px-5 text-gray-600">{formatDate(item.tglPengiriman)}</TableCell>
                    <TableCell className="py-3 px-5">
                      <div className="relative inline-flex items-center">
                        <select 
                          value={(item.statusPesanan || '').toLowerCase()} 
                          onChange={(e) => {
                            if (window.confirm(`Yakin ingin mengubah status SPJ menjadi '${e.target.value}'?`)) {
                              updateStatusMut.mutate({ id: item.id, status: e.target.value })
                            }
                          }}
                          className={`cursor-pointer appearance-none focus:outline-none capitalize pl-2.5 pr-7 py-1 text-xs font-semibold rounded-full transition-colors ${getStatusStyles(item.statusPesanan)}`}
                        >
                          <option className="text-gray-900 bg-white" value="">Pilih Status</option>
                          <option className="text-gray-900 bg-white" value="diproses">Diproses</option>
                          <option className="text-gray-900 bg-white" value="selesai">Selesai</option>
                        </select>
                        <ChevronDown className="absolute right-2 w-3.5 h-3.5 pointer-events-none opacity-60" />
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-5 text-center flex items-center justify-center gap-1">
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
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 border-t border-gray-200 text-sm text-gray-500 flex justify-between items-center">
          <span>Menampilkan {filteredData.length} data</span>
        </div>
      </div>
    </DashboardLayout>
  )
}
