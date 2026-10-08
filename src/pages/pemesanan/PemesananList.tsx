import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DeleteButton } from '@/components/common/DeleteButton';
import { StatusSelect } from '@/components/common/StatusSelect';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Plus, Search, Eye} from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { pemesananApi } from '@/api/pemesanan'
import { formatDate } from '@/utils/formatters'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from '@/components/common/Pagination';
import { toast } from "sonner";



export default function PemesananList() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const { data: pemesananList, isLoading, refetch } = useQuery({
    queryKey: ['pemesanan'],
    queryFn: pemesananApi.getAll
  })

  
  const deleteMut = useMutation({
    mutationFn: pemesananApi.delete,
    onSuccess: () => { refetch(); toast.success('Data pesanan berhasil dihapus!'); },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      const msg = err.response?.data?.error || err.message;
      toast.error('Gagal menghapus: ' + msg);
    }
  })

  const updateStatusMut = useMutation({
    mutationFn: (data: { id: string, field: 'status' | 'status_odoo', value: string }) => pemesananApi.updateOrderStatus(data.id, data.field, data.value),
    onSuccess: () => refetch(),
    onError: (err: Error) => toast.error('Gagal update status: ' + err.message)
  })

    const exportMut = useMutation({
    mutationFn: pemesananApi.exportExcel,
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const formattedDate = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
      a.download = `data-pesanan-${formattedDate}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  })



  const filteredData = pemesananList?.filter(item => 
    item.kodePemesanan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.namaInstansi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.namaPIC.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kategori.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  // Pagination Logic
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)


  return (
    <DashboardLayout 
      title="Data Pemesanan" 
      onExport={() => exportMut.mutate()}
      isExporting={exportMut.isPending}
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input type="text" 
              placeholder="Cari Instansi, PIC, Kategori atau Kode..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4871f7] focus:border-transparent"
            />
          </div>
          
          <Button variant="outline" onClick={() => navigate('/pemesanan/add')}
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
                <TableHead className="py-2.5 px-3 font-medium whitespace-nowrap text-center">Kode Pemesanan</TableHead>
                <TableHead className="py-2.5 px-3 font-medium whitespace-nowrap text-center">Tanggal PO</TableHead>
                <TableHead className="py-2.5 px-3 font-medium text-center">Instansi</TableHead>
                <TableHead className="py-2.5 px-3 font-medium text-center">Produk & Qty</TableHead>
                <TableHead className="py-2.5 px-3 font-medium text-center">Status Pesanan</TableHead>
                <TableHead className="py-2.5 px-3 font-medium text-center">Status Odoo</TableHead>
                <TableHead className="py-2.5 px-3 font-medium whitespace-nowrap text-center">Dibuat Pada</TableHead>
                <TableHead className="py-2.5 px-3 font-medium whitespace-nowrap text-center">Terakhir Update</TableHead>
                <TableHead className="py-2.5 px-3 font-medium text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200 text-[13px] text-gray-700">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-8 text-center text-gray-500">Memuat data...</TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-8 text-center text-gray-500">Tidak ada data pemesanan.</TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="py-2.5 px-3 font-medium text-gray-900 whitespace-nowrap">{item.kodePemesanan}</TableCell>
                    <TableCell className="py-2.5 px-3 text-center whitespace-nowrap">{formatDate(item.tanggalPesananPO)}</TableCell>
                    <TableCell className="py-2.5 px-3 max-w-50 truncate" title={item.namaInstansi}>{item.namaInstansi}</TableCell>
                    <TableCell className="py-2.5 px-3 text-center whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">{item.kategori}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5 px-3 text-center whitespace-nowrap">
                      <StatusSelect 
                        currentStatus={(item.statusPesanan || '').toLowerCase()} 
                        onStatusChange={(newStatus) => updateStatusMut.mutate({ id: item.id as string, field: 'status', value: newStatus })}
                        title="Status Pesanan"
                        options={
                          <>
                            <option className="text-gray-900 bg-white" value="">Pilih Status</option>
                            <option className="text-gray-900 bg-white" value="pending">Pending</option>
                            <option className="text-gray-900 bg-white" value="baru">Baru</option>
                            <option className="text-gray-900 bg-white" value="diproses">Diproses</option>
                            <option className="text-gray-900 bg-white" value="dikirim">Dikirim</option>
                            <option className="text-gray-900 bg-white" value="selesai">Selesai</option>
                            <option className="text-gray-900 bg-white" value="batal">Batal</option>
                          </>
                        }
                      />
                    </TableCell>
                    <TableCell className="py-2.5 px-3 text-center whitespace-nowrap">
                      <StatusSelect 
                        currentStatus={(item.statusOdoo || '').toLowerCase()} 
                        onStatusChange={(newStatus) => updateStatusMut.mutate({ id: item.id as string, field: 'status_odoo', value: newStatus })}
                        title="Status Odoo"
                        options={
                          <>
                            <option className="text-gray-900 bg-white" value="">Pilih Status</option>
                            <option className="text-gray-900 bg-white" value="draft">Draft</option>
                            <option className="text-gray-900 bg-white" value="confirmed">Confirmed</option>
                          </>
                        }
                      />
                    </TableCell>
                    <TableCell className="py-2.5 px-3 text-center whitespace-nowrap">{formatDate(item.createdAt)}</TableCell>
                    <TableCell className="py-2.5 px-3 text-center whitespace-nowrap">{formatDate(item.updatedAt)}</TableCell>
                    <TableCell className="py-2.5 px-3 text-center flex items-center justify-center gap-1">
                      <Button variant="outline" onClick={() => navigate(`/pemesanan/${item.id}`)}
                        className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye size={18} />
                      </Button>
                      <Button variant="outline" onClick={() => navigate(`/pemesanan/edit/${item.id}`)}
                        className="text-amber-600 hover:bg-amber-50 p-1.5 rounded transition-colors"
                        title="Edit Data"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                      </Button>
                      <DeleteButton onConfirm={() => deleteMut.mutate({ id: item.id, kategori: item.kategori })} isPending={deleteMut.isPending} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        

        
                {/* Pagination Controls */}
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
