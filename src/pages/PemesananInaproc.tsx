import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, Plus, Edit, Trash2, ArrowUpDown } from 'lucide-react'

// Imports terpisah (modular)
import type { InaprocOrder } from '@/types/inaproc'
import { inaprocApi } from '@/api/inaproc'
import { formatRupiah, formatDate } from '@/utils/formatters'
import { InaprocFormModal } from '@/components/features/inaproc/InaprocFormModal'
import { InaprocDeleteModal } from '@/components/features/inaproc/InaprocDeleteModal'

export default function PemesananInaproc() {
  const queryClient = useQueryClient()
  
  // UI States
  const [searchTerm, setSearchTerm] = useState('')
  const [entries, setEntries] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InaprocOrder | null>(null)

  // Queries & Mutations
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['inaproc'],
    queryFn: inaprocApi.findAll,
  })

  const createMutation = useMutation({
    mutationFn: inaprocApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inaproc'] })
      setIsFormOpen(false)
    },
    onError: (err) => alert(axios.isAxiosError(err) ? err.response?.data?.message : err.message)
  })

  const updateMutation = useMutation({
    mutationFn: inaprocApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inaproc'] })
      setIsFormOpen(false)
    },
    onError: (err) => alert(axios.isAxiosError(err) ? err.response?.data?.message : err.message)
  })

  const deleteMutation = useMutation({
    mutationFn: inaprocApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inaproc'] })
      setIsDeleteOpen(false)
      setSelectedItem(null)
    },
    onError: (err) => alert(axios.isAxiosError(err) ? err.response?.data?.message : err.message)
  })

  // Filter & Pagination Logic
  const filteredData = data?.filter((item) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      item.kode?.toLowerCase().includes(searchLower) ||
      item.nama_pic?.toLowerCase().includes(searchLower) ||
      item.puskesmas?.toLowerCase().includes(searchLower)
    )
  }) || []

  const totalPages = Math.ceil(filteredData.length / entries)
  const paginatedData = filteredData.slice((currentPage - 1) * entries, currentPage * entries)

  // Status Badge / Select Helper
  const getStatusSelect = (item: InaprocOrder) => {
    const s = item.status?.toLowerCase() || ''
    let baseClass = "px-3 py-1 rounded-full text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5145cd] transition-colors disabled:opacity-50 border"
    
    if (s.includes('selesai') || s.includes('delivered')) {
      baseClass += " bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
    } else if (s.includes('proses') || s.includes('process')) {
      baseClass += " bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
    } else if (s.includes('batal') || s.includes('canceled')) {
      baseClass += " bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
    } else {
      baseClass += " bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
    }

    return (
      <select 
        value={item.status || 'Draft'}
        onChange={(e) => {
          updateMutation.mutate({ 
            id: item.id, 
            data: { ...item, status: e.target.value } 
          })
        }}
        disabled={updateMutation.isPending}
        className={baseClass}
      >
        <option value="Draft" className="bg-white text-gray-800">Draft</option>
        <option value="Proses" className="bg-white text-gray-800">Proses</option>
        <option value="Selesai" className="bg-white text-gray-800">Selesai</option>
        <option value="Batal" className="bg-white text-gray-800">Batal</option>
      </select>
    )
  }

  // Handlers
  const handleSaveForm = (payload: Partial<InaprocOrder>) => {
    if (selectedItem) {
      updateMutation.mutate({ id: selectedItem.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  return (
    <DashboardLayout title="Pemesanan Inaproc">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        
        {/* Top Toolbar */}
        <div className="flex justify-between items-center w-full mb-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
              <span>Show</span>
              <select 
                className="border border-gray-200 rounded-md px-2 py-1.5 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#5145cd] cursor-pointer"
                value={entries}
                onChange={(e) => { setEntries(Number(e.target.value)); setCurrentPage(1) }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-1 focus:ring-[#5145cd] transition-shadow"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
              />
            </div>
          </div>

          <button onClick={() => { setSelectedItem(null); setIsFormOpen(true) }} className="bg-[#5145cd] hover:bg-[#3b339b] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm">
            <Plus size={16} strokeWidth={3} />
            Add
          </button>
        </div>

        {/* Loading / Error States */}
        {isLoading && <div className="py-12 text-center text-gray-500">Memuat data...</div>}
        {isError && (
          <div className="py-12 text-center text-red-500">
            Terjadi kesalahan: {axios.isAxiosError(error) ? error.response?.data?.message || error.message : error?.message}
          </div>
        )}

        {/* Data Table */}
        {!isLoading && !isError && (
          <div className="overflow-x-auto min-h-100">
            <Table>
              <TableHeader>
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="font-extrabold text-black h-12 w-30">Tracking ID</TableHead>
                  <TableHead className="font-extrabold text-black"><div className="flex items-center gap-2 cursor-pointer">Puskesmas <ArrowUpDown size={14} className="text-gray-400" /></div></TableHead>
                  <TableHead className="font-extrabold text-black"><div className="flex items-center gap-2 cursor-pointer">Customer <ArrowUpDown size={14} className="text-gray-400" /></div></TableHead>
                  <TableHead className="font-extrabold text-black"><div className="flex items-center gap-2 cursor-pointer">Date <ArrowUpDown size={14} className="text-gray-400" /></div></TableHead>
                  <TableHead className="font-extrabold text-black"><div className="flex items-center gap-2 cursor-pointer">Amount <ArrowUpDown size={14} className="text-gray-400" /></div></TableHead>
                  <TableHead className="font-extrabold text-black"><div className="flex items-center gap-2 cursor-pointer">Qty</div></TableHead>
                  <TableHead className="font-extrabold text-black"><div className="flex items-center gap-2 cursor-pointer">Status <ArrowUpDown size={14} className="text-gray-400" /></div></TableHead>
                  <TableHead className="font-extrabold text-black text-center w-25">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Tidak ada data yang cocok.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item) => (
                    <TableRow key={item.id} className="border-none odd:bg-white even:bg-[#f9fafb] hover:bg-gray-50/80 transition-colors">
                      <TableCell className="font-medium text-gray-800 py-4">{item.kode || `#${item.id}`}</TableCell>
                      <TableCell className="font-medium text-gray-700">{item.puskesmas || '-'}</TableCell>
                      <TableCell className="text-gray-600">{item.nama_pic || '-'}</TableCell>
                      <TableCell className="text-gray-600">{formatDate(item.tgl_pesanan)}</TableCell>
                      <TableCell className="font-medium text-gray-800">{formatRupiah(item.harga_ppn || 0)}</TableCell>
                      <TableCell className="text-gray-600">{item.qty || 0}</TableCell>
                      <TableCell>{getStatusSelect(item)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => { setSelectedItem(item); setIsFormOpen(true) }} className="p-1.5 text-[#5145cd] hover:bg-[#5145cd]/10 rounded transition-colors" title="Edit">
                            <Edit size={18} strokeWidth={2} />
                          </button>
                          <button onClick={() => { setSelectedItem(item); setIsDeleteOpen(true) }} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors" title="Delete">
                            <Trash2 size={18} strokeWidth={2} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination Bottom */}
        {!isLoading && !isError && filteredData.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-8 pb-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="text-gray-400 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium mr-2 transition-colors"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page 
                    ? 'bg-[#5145cd] text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="text-gray-400 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium ml-2 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modals Eksternal */}
      {isFormOpen && (
        <InaprocFormModal 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)}
          initialData={selectedItem}
          onSave={handleSaveForm}
          isPending={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <InaprocDeleteModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        selectedItem={selectedItem}
        onConfirm={(id) => deleteMutation.mutate(id)}
        isPending={deleteMutation.isPending}
      />
    </DashboardLayout>
  )
}