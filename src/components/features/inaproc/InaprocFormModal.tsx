import { useState } from 'react'
import { X } from 'lucide-react'
import type { InaprocOrder } from '@/types/inaproc'
import { formatDateForInput } from '@/utils/formatters'

interface Props {
  isOpen: boolean
  onClose: () => void
  initialData: InaprocOrder | null
  onSave: (data: Partial<InaprocOrder>) => void
  isPending: boolean
}

export function InaprocFormModal({ isOpen, onClose, initialData, onSave, isPending }: Props) {
  const [formData, setFormData] = useState<Partial<InaprocOrder>>(() => {
    if (initialData) {
      return {
        ...initialData,
        tgl_pesanan: formatDateForInput(initialData.tgl_pesanan)
      }
    }
    return {
      kode: '',
      nama_pic: '',
      puskesmas: '',
      status: 'Draft',
      tgl_pesanan: '',
      qty: 0,
      harga_ppn: 0,
    }
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      qty: Number(formData.qty),
      harga_ppn: Number(formData.harga_ppn)
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">
            {initialData ? 'Edit Data Inaproc' : 'Tambah Data Inaproc'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col overflow-y-auto">
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Kode Tracking</label>
                <input 
                  type="text" required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5145cd]"
                  value={formData.kode || ''} onChange={(e) => setFormData({...formData, kode: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Tanggal Pesanan</label>
                <input 
                  type="date" required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5145cd]"
                  value={formData.tgl_pesanan || ''} onChange={(e) => setFormData({...formData, tgl_pesanan: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Puskesmas</label>
              <input 
                type="text" required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5145cd]"
                value={formData.puskesmas || ''} onChange={(e) => setFormData({...formData, puskesmas: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Nama PIC (Customer)</label>
              <input 
                type="text" required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5145cd]"
                value={formData.nama_pic || ''} onChange={(e) => setFormData({...formData, nama_pic: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Jumlah (Qty)</label>
                <input 
                  type="number" required min="1"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5145cd]"
                  value={formData.qty || 0} onChange={(e) => setFormData({...formData, qty: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Harga PPN (Rp)</label>
                <input 
                  type="number" required min="0"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5145cd]"
                  value={formData.harga_ppn || 0} onChange={(e) => setFormData({...formData, harga_ppn: Number(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select 
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#5145cd]"
                value={formData.status || 'Draft'} onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="Draft">Draft</option>
                <option value="Proses">Proses</option>
                <option value="Selesai">Selesai</option>
                <option value="Batal">Batal</option>
              </select>
            </div>
          </div>

          <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-[#5145cd] rounded-lg hover:bg-[#3b339b] disabled:opacity-70 transition-colors"
            >
              {isPending ? 'Menyimpan...' : 'Simpan Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}