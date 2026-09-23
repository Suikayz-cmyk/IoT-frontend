import { X, AlertTriangle } from 'lucide-react'
import type { SPJOrder } from '@/types/spj'

interface Props {
  isOpen: boolean
  onClose: () => void
  selectedItem: SPJOrder | null
  onConfirm: (id: number) => void
  isPending: boolean
}

export function SPJDeleteModal({ isOpen, onClose, selectedItem, onConfirm, isPending }: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={20} />
            <h2 className="text-lg font-bold">Hapus Data</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-5 text-gray-600 text-sm">
          Apakah Anda yakin ingin menghapus data SPJ untuk <span className="font-semibold text-gray-800">{selectedItem?.nama_dinkes_pkm || 'ini'}</span>? Tindakan ini tidak dapat dibatalkan.
        </div>

        <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button 
            onClick={() => selectedItem && onConfirm(selectedItem.id)} 
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-70 transition-colors"
          >
            {isPending ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  )
}

