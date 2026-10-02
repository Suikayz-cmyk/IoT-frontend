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
  const [currentPage, setCurrentPage] = useState(1)

  const { data: pemesananList, isLoading, refetch } = useQuery({
    queryKey: ['pemesanan'],
    queryFn: pemesananApi.getAll
  })

  
  const deleteMut = useMutation({
    mutationFn: pemesananApi.delete,
    onSuccess: () => refetch(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      const msg = err.response?.data?.error || err.message;
      alert('Gagal menghapus: ' + msg);
    }
  })

  const handleDelete = (id: string, kategori: string) => {
    if (confirm('Yakin ingin menghapus pesanan ini beserta semua data terkait?')) {
      deleteMut.mutate({ id, kategori })
    }
  }

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
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
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
                <th className="py-3 px-5 font-medium whitespace-nowrap text-center">Kode Pemesanan</th>
                  <th className="py-3 px-5 font-medium whitespace-nowrap text-center">Tanggal PO</th>
                <th className="py-3 px-5 font-medium text-center">Instansi</th>
                <th className="py-3 px-5 font-medium text-center">Produk & Qty</th>
                                <th className="py-3 px-5 font-medium text-center">Status Pesanan</th>
                <th className="py-3 px-5 font-medium text-center">Status Odoo</th>
                  <th className="py-3 px-5 font-medium whitespace-nowrap text-center">Dibuat Pada</th>
                  <th className="py-3 px-5 font-medium whitespace-nowrap text-center">Terakhir Update</th>
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
                paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-5 font-medium text-gray-900">{item.kodePemesanan}</td>
                      <td className="py-3 px-5">{formatDate(item.tanggalPesananPO)}</td>
                    <td className="py-3 px-5">{item.namaInstansi}</td>
                    <td className="py-3 px-5">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">{item.kategori}</span>
                      </div>
                    </td>
                    
                    <td className="py-3 px-5 text-center">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold capitalize ${
                          item.statusPesanan === 'selesai' ? 'bg-green-100 text-green-800' : 
                        item.statusPesanan === 'batal' ? 'bg-red-100 text-red-800' :
                        item.statusPesanan === 'Dikirim' ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {item.statusPesanan || '-'}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-center">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold capitalize ${
                          item.statusOdoo === 'confirmed' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.statusOdoo || '-'}
                      </span>
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
                        onClick={() => handleDelete(item.id, item.kategori)}
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
        

        
        {/* Pagination Controls */}
        {totalPages > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Menampilkan <span className="font-medium">{startIndex + 1}</span> hingga <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredData.length)}</span> dari <span className="font-medium">{filteredData.length}</span> hasil
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, idx) => {
                    const page = idx + 1;
                    // Tampilkan maksimal 5 halaman di sekitar current page
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === page ? 'z-10 bg-teal-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600' : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'}`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">...</span>;
                    }
                    return null;
                  })}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>

  )
}

