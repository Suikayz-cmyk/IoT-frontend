import { useState } from 'react'
import { X } from 'lucide-react'
import type { SPJOrder } from '@/types/spj'
import { formatDateForInput } from '@/utils/formatters'

interface Props {
  isOpen: boolean
  onClose: () => void
  initialData: SPJOrder | null
  onSave: (data: Partial<SPJOrder>) => void
  isPending: boolean
}

export function SPJFormModal({ isOpen, onClose, initialData, onSave, isPending }: Props) {
  const [formData, setFormData] = useState<Partial<SPJOrder>>(() => {
    if (initialData) {
      return {
        ...initialData,
        tgl_print: initialData.tgl_print ? formatDateForInput(initialData.tgl_print) : '',
        tgl_paraf: initialData.tgl_paraf ? formatDateForInput(initialData.tgl_paraf) : '',
        tgl_sign: initialData.tgl_sign ? formatDateForInput(initialData.tgl_sign) : '',
        tgl_kirim: initialData.tgl_kirim ? formatDateForInput(initialData.tgl_kirim) : ''
      }
    }
    return {
      nama_dinkes_pkm: '',
      pic_print: '',
      kebutuhan_spj: '',
      jumlah_rangkap: 1,
      status_pengiriman: 'Proses',
      tgl_print: '',
      kertas: 'A4',
      jenis_file: 'PDF'
    }
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      jumlah_rangkap: Number(formData.jumlah_rangkap)
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">
            {initialData ? 'Edit Data SPJ' : 'Tambah Data SPJ'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col overflow-y-auto">
          <div className="p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Nama Dinkes / PKM</label>
              <input 
                type="text" required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f766e]"
                value={formData.nama_dinkes_pkm || ''} onChange={(e) => setFormData({...formData, nama_dinkes_pkm: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Kebutuhan SPJ</label>
              <input 
                type="text" required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f766e]"
                value={formData.kebutuhan_spj || ''} onChange={(e) => setFormData({...formData, kebutuhan_spj: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">PIC Print</label>
                <input 
                  type="text" required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f766e]"
                  value={formData.pic_print || ''} onChange={(e) => setFormData({...formData, pic_print: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Tgl Print</label>
                <input 
                  type="date" required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f766e]"
                  value={formData.tgl_print || ''} onChange={(e) => setFormData({...formData, tgl_print: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Jumlah Rangkap</label>
                <input 
                  type="number" required min="1"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f766e]"
                  value={formData.jumlah_rangkap || 1} onChange={(e) => setFormData({...formData, jumlah_rangkap: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Status Pengiriman</label>
                <select 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f766e]"
                  value={formData.status_pengiriman || 'Proses'} onChange={(e) => setFormData({...formData, status_pengiriman: e.target.value})}
                >
                  <option value="Proses">Proses</option>
                  <option value="Sudah Dikirim">Sudah Dikirim</option>
                  <option value="Batal">Batal</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-[#0f766e] rounded-lg hover:bg-[#115e59] disabled:opacity-70 transition-colors"
            >
              {isPending ? 'Menyimpan...' : 'Simpan Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

