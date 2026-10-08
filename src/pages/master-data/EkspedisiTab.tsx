import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Edit2, Plus } from 'lucide-react'
import { masterApi } from '@/api/masterApi'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { toast } from "sonner"
import DeleteButton from './components/DeleteButton'
import Modal from './components/Modal'

export default function EkspedisiTab() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  
  const [namaEkspedisi, setNamaEkspedisi] = useState('')

  const { data: ekspedisiList = [] } = useQuery({ queryKey: ['master_ekspedisi'], queryFn: masterApi.getEkspedisi })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['master_ekspedisi'] })
    closeModal()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (err: any) => {
    const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message
    toast.error('Gagal menyimpan data: ' + msg)
  }

  const addMut = useMutation({ mutationFn: masterApi.addEkspedisi, onSuccess: invalidate, onError })
  const updMut = useMutation({ mutationFn: masterApi.updateEkspedisi, onSuccess: invalidate, onError })
  const delMut = useMutation({ mutationFn: masterApi.deleteEkspedisi, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['master_ekspedisi'] }), onError })

  const resetForms = () => {
    setEditId(null)
    setNamaEkspedisi('');
  }

  const openAddModal = () => {
    resetForms(); setIsModalOpen(true)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openEditModal = (item: any) => {
    resetForms()
    setEditId(item.id)
    setNamaEkspedisi(item.namaEkspedisi);
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    resetForms()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editId) updMut.mutate({ id: editId, namaEkspedisi })
    else addMut.mutate({ namaEkspedisi })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-base font-semibold text-gray-800">Daftar Ekspedisi</h2>
        <Button variant="default" onClick={openAddModal}>
          <Plus size={16} /> Tambah Ekspedisi
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table className="w-full text-left text-sm text-gray-600">
          <TableHeader className="bg-gray-50 text-gray-800 font-semibold border-b border-gray-200">
            <TableRow>
              <TableHead className="px-4 py-3 w-12 text-center">No</TableHead>
              <TableHead className="px-4 py-3">Nama Ekspedisi</TableHead>
              <TableHead className="px-4 py-3 w-24 text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100">
            {ekspedisiList.length === 0 && <TableRow><TableCell colSpan={3} className="text-center py-8">Belum ada data</TableCell></TableRow>}
            {ekspedisiList.map((item, idx) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell className="px-4 py-3 text-center">{idx + 1}</TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-800">{item.namaEkspedisi}</TableCell>
                <TableCell className="px-4 py-3 text-center flex items-center justify-center gap-2">
                  <Button variant="outline" onClick={() => openEditModal(item)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded"><Edit2 size={16}/></Button>
                  <DeleteButton onConfirm={() => delMut.mutate(item.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={`${editId ? 'Edit' : 'Tambah'} Ekspedisi`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Nama Ekspedisi" value={namaEkspedisi} onChange={e => setNamaEkspedisi(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
          <div className="pt-4 flex gap-3">
            <Button variant="outline" type="button" onClick={closeModal}>Batal</Button>
            <Button variant="default" type="submit">{editId ? 'Simpan Perubahan' : 'Simpan Data'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
