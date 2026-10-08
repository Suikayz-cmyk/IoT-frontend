import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DeleteButton } from '@/components/common/DeleteButton';
import { StatusSelect } from '@/components/common/StatusSelect';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Plus, Search, Eye} from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { spjApi } from '@/api/spj'
import { formatDate } from '@/utils/formatters'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Pagination } from '@/components/common/Pagination';



export default function SPJPage() {
  const navigate = useNavigate()

    const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const { data: spjList, isLoading, refetch } = useQuery({
    queryKey: ['spj'],
    queryFn: spjApi.findAll
  })

  
  const updateStatusMut = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => spjApi.updateStatus(id, status),
    onSuccess: () => refetch(),
    onError: (err: Error) => toast.error('Gagal update status: ' + err.message)
  })

  const deleteMut = useMutation({
    mutationFn: spjApi.delete,
    onSuccess: () => refetch(),
    onError: (err: Error) => toast.error('Gagal menghapus: ' + err.message)
  })



  const filteredData = spjList?.filter(item => 
    item.kodePemesanan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.namaInstansi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.namaPIC?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  return (
    <DashboardLayout 
      title="Data SPJ" 
      onExport={() => toast('Fitur Export dalam pengembangan')}
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input type="text" 
              placeholder="Cari Instansi, PIC, atau Kode..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4871f7] focus:border-transparent"
            />
          </div>
          
          <Button variant="outline" onClick={() => navigate('/spj/add')}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shrink-0"
          >
            <Plus size={20} />
            <span>Tambah Data</span>
          </Button>
        </div>

        <div className="overflow-x-auto min-h-100">
          <Table className="w-full text-left border-collapse min-w-200" style={{ zoom: "0.9" }}>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200 text-[13px] text-gray-500">
                <TableHead className="py-2.5 px-3 font-medium whitespace-nowrap text-center">Kode SPJ</TableHead>
                <TableHead className="py-2.5 px-3 font-medium text-center">Instansi</TableHead>
                <TableHead className="py-2.5 px-3 font-medium text-center">Kebutuhan SPJ</TableHead>
                <TableHead className="py-2.5 px-3 font-medium text-center">Tgl Print</TableHead>
                <TableHead className="py-2.5 px-3 font-medium text-center">PIC Print</TableHead>
                <TableHead className="py-2.5 px-3 font-medium text-center">Tgl Pengiriman</TableHead>
                <TableHead className="py-2.5 px-3 font-medium text-center">Status Pesanan</TableHead>
                <TableHead className="py-2.5 px-3 font-medium text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200 text-[13px] text-gray-700">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-gray-500">Memuat data...</TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-gray-500">Tidak ada data SPJ.</TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="py-2.5 px-3 font-medium text-gray-900 whitespace-nowrap">
                      <div>{item.kodePemesanan || `SPJ-${item.id}`}</div>
                      <div className="text-xs text-gray-500">{formatDate(item.tanggalOrder)}</div>
                    </TableCell>
                    <TableCell className="py-2.5 px-3 max-w-50 truncate" title={item.namaInstansi || `Instansi ID: ${item.namaInstansi}`}>
                      <div className="font-medium text-gray-800 truncate">{item.namaInstansi || `Instansi ID: ${item.namaInstansi}`}</div>
                      <div className="text-xs text-gray-500 truncate">PIC: {item.namaPIC || '-'}</div>
                    </TableCell>
                    <TableCell className="py-2.5 px-3 font-medium text-gray-700 whitespace-nowrap">{item.kebutuhanSPJ}</TableCell>
                    <TableCell className="py-2.5 px-3 text-center text-gray-600 whitespace-nowrap">{formatDate(item.tglPrint)}</TableCell>
                    <TableCell className="py-2.5 px-3 text-gray-600 whitespace-nowrap">{item.picPrint}</TableCell>
                    <TableCell className="py-2.5 px-3 text-center text-gray-600 whitespace-nowrap">{formatDate(item.tglPengiriman)}</TableCell>
                    <TableCell className="py-2.5 px-3 text-center whitespace-nowrap">
                      <StatusSelect 
                        currentStatus={(item.statusPesanan || '').toLowerCase()} 
                        onStatusChange={(newStatus) => updateStatusMut.mutate({ id: String(item.id), status: newStatus })}
                        options={
                          <>
                            <option className="text-gray-900 bg-white" value="">Pilih Status</option>
                            <option className="text-gray-900 bg-white" value="diproses">Diproses</option>
                            <option className="text-gray-900 bg-white" value="selesai">Selesai</option>
                          </>
                        }
                      />
                    </TableCell>
                    <TableCell className="py-2.5 px-3 text-center flex items-center justify-center gap-1">
                      <Button variant="outline" onClick={() => navigate(`/spj/`)}
                        className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye size={18} />
                      </Button>
                      <Button variant="outline" onClick={() => navigate(`/spj/edit/`)}
                        className="text-amber-600 hover:bg-amber-50 p-1.5 rounded transition-colors"
                        title="Edit Data"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                      </Button>
                      <DeleteButton onConfirm={() => deleteMut.mutate(String(item.id))} isPending={deleteMut.isPending} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
                {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </DashboardLayout>
  )
}



