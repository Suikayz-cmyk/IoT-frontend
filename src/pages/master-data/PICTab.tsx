import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Edit2, Plus } from 'lucide-react'
import { masterApi } from '@/api/masterApi'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { toast } from "sonner"
import DeleteButton from './components/DeleteButton'
import Modal from './components/Modal'

export default function PICTab() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  
  const [instansiId, setInstansiId] = useState('')
  const [namaPIC, setNamaPIC] = useState('')
  const [nik, setNik] = useState('')
  const [email, setEmail] = useState('')
  const [noTelp, setNoTelp] = useState('')

  const { data: instansiList = [] } = useQuery({ queryKey: ['master_instansi'], queryFn: masterApi.getInstansi })
  const { data: picList = [] } = useQuery({ queryKey: ['master_pic'], queryFn: masterApi.getPIC })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['master_pic'] })
    closeModal()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onError = (err: any) => {
    const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message
    toast.error('Gagal menyimpan data: ' + msg)
  }

  const addMut = useMutation({ mutationFn: masterApi.addPIC, onSuccess: invalidate, onError })
  const updMut = useMutation({ mutationFn: masterApi.updatePIC, onSuccess: invalidate, onError })
  const delMut = useMutation({ mutationFn: masterApi.deletePIC, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['master_pic'] }), onError })

  const resetForms = () => {
    setEditId(null)
    setInstansiId(''); setNamaPIC(''); setNik(''); setEmail(''); setNoTelp('');
  }

  const openAddModal = () => {
    resetForms(); setIsModalOpen(true)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openEditModal = (item: any) => {
    resetForms()
    setEditId(item.id)
    setInstansiId(item.instansiId); setNamaPIC(item.namaPIC); setNik(item.nik); setEmail(item.email); setNoTelp(item.noTelp);
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    resetForms()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editId) updMut.mutate({ id: editId, instansiId, namaPIC, nik, email, noTelp })
    else addMut.mutate({ instansiId, namaPIC, nik, email, noTelp })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-base font-semibold text-gray-800">Daftar PIC</h2>
        <Button variant="default" onClick={openAddModal}>
          <Plus size={16} /> Tambah PIC
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table className="w-full text-left text-sm text-gray-600">
          <TableHeader className="bg-gray-50 text-gray-800 font-semibold border-b border-gray-200">
            <TableRow>
              <TableHead className="px-4 py-3 w-12 text-center">No</TableHead>
              <TableHead className="px-4 py-3">Instansi</TableHead>
              <TableHead className="px-4 py-3">Nama PIC</TableHead>
              <TableHead className="px-4 py-3">NIK</TableHead>
              <TableHead className="px-4 py-3">Email</TableHead>
              <TableHead className="px-4 py-3">Telepon</TableHead>
              <TableHead className="px-4 py-3 w-24 text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100">
            {picList.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8">Belum ada data</TableCell></TableRow>}
            {picList.map((item, idx) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell className="px-4 py-3 text-center">{idx + 1}</TableCell>
                <TableCell className="px-4 py-3 text-xs text-gray-600">{instansiList.find(i => i.id === item.instansiId)?.namaInstansi || 'Unknown'}</TableCell>
                <TableCell className="px-4 py-3 font-medium text-gray-800">{item.namaPIC}</TableCell>
                <TableCell className="px-4 py-3 font-mono text-xs text-gray-500">{item.nik || '-'}</TableCell>
                <TableCell className="px-4 py-3 text-xs text-gray-600">{item.email || '-'}</TableCell>
                <TableCell className="px-4 py-3 font-mono text-xs text-gray-600">{item.noTelp || '-'}</TableCell>
                <TableCell className="px-4 py-3 text-center flex items-center justify-center gap-2">
                  <Button variant="outline" onClick={() => openEditModal(item)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded"><Edit2 size={16}/></Button>
                  <DeleteButton onConfirm={() => delMut.mutate(item.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={`${editId ? 'Edit' : 'Tambah'} PIC`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select required value={instansiId} onChange={e => setInstansiId(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none bg-white">
            <option value="" disabled>Pilih Instansi</option>
            {instansiList.map(i => <option key={i.id} value={i.id}>{i.namaInstansi}</option>)}
          </select>
          <input required placeholder="Nama PIC" value={namaPIC} onChange={e => setNamaPIC(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
          <input required placeholder="NIK" value={nik} onChange={e => setNik(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
          <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
          <input required placeholder="Nomor Telepon" value={noTelp} onChange={e => setNoTelp(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
          <div className="pt-4 flex gap-3">
            <Button variant="outline" type="button" onClick={closeModal}>Batal</Button>
            <Button variant="default" type="submit">{editId ? 'Simpan Perubahan' : 'Simpan Data'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
