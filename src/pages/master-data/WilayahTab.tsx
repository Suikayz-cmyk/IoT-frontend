import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Edit2, Plus } from 'lucide-react'
import { masterApi } from '@/api/masterApi'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { toast } from "sonner"
import DeleteButton from './components/DeleteButton'
import Modal from './components/Modal'

export default function WilayahTab() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  
  const [provinsi, setProvinsi] = useState('')
  const [kotaKab, setKotaKab] = useState('')
  const [alamat, setAlamat] = useState('')

  const { data: wilayahList = [] } = useQuery({ queryKey: ['master_wilayah'], queryFn: masterApi.getWilayah })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['master_wilayah'] })
    closeModal()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (err: any) => {
    const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message
    toast.error('Gagal menyimpan data: ' + msg)
  }

  const addMut = useMutation({ mutationFn: masterApi.addWilayah, onSuccess: invalidate, onError })
  const updMut = useMutation({ mutationFn: masterApi.updateWilayah, onSuccess: invalidate, onError })
  const delMut = useMutation({ mutationFn: masterApi.deleteWilayah, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['master_wilayah'] }), onError })

  const resetForms = () => {
    setEditId(null)
    setProvinsi(''); setKotaKab(''); setAlamat('');
  }

  const openAddModal = () => {
    resetForms(); setIsModalOpen(true)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openEditModal = (item: any) => {
    resetForms()
    setEditId(item.id)
    setProvinsi(item.provinsi || ''); setKotaKab(item.kotaKab || ''); setAlamat(item.alamat || '');
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    resetForms()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editId) updMut.mutate({ id: editId, namaWilayah: '', provinsi, kotaKab, alamat })
    else addMut.mutate({ namaWilayah: '', provinsi, kotaKab, alamat })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-base font-semibold text-gray-800">Daftar Wilayah</h2>
        <Button variant="default" onClick={openAddModal}>
          <Plus size={16} /> Tambah Wilayah
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table className="w-full text-left text-sm text-gray-600">
          <TableHeader className="bg-gray-50 text-gray-800 font-semibold border-b border-gray-200">
            <TableRow>
              <TableHead className="px-4 py-3 w-12 text-center">No</TableHead>
              <TableHead className="px-4 py-3">Provinsi</TableHead>
              <TableHead className="px-4 py-3">Kota/Kabupaten</TableHead>
              <TableHead className="px-4 py-3">Alamat</TableHead>
              <TableHead className="px-4 py-3 w-24 text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100">
            {wilayahList.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8">Belum ada data</TableCell></TableRow>}
            {wilayahList.map((item, idx) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell className="px-4 py-3 text-center">{idx + 1}</TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-800">{item.provinsi}</TableCell>
                <TableCell className="px-4 py-3 text-gray-800">{item.kotaKab}</TableCell>
                <TableCell className="px-4 py-3 text-xs text-gray-500">{item.alamat || '-'}</TableCell>
                <TableCell className="px-4 py-3 text-center flex items-center justify-center gap-2">
                  <Button variant="outline" onClick={() => openEditModal(item)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded"><Edit2 size={16}/></Button>
                  <DeleteButton onConfirm={() => delMut.mutate(item.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={`${editId ? 'Edit' : 'Tambah'} Wilayah`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Provinsi" value={provinsi} onChange={e => setProvinsi(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
          <input required placeholder="Kota/Kabupaten" value={kotaKab} onChange={e => setKotaKab(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
          <textarea placeholder="Alamat (Opsional)" value={alamat} onChange={e => setAlamat(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none h-20" />
          <div className="pt-4 flex gap-3">
            <Button variant="outline" type="button" onClick={closeModal}>Batal</Button>
            <Button variant="default" type="submit">{editId ? 'Simpan Perubahan' : 'Simpan Data'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
