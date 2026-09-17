import { Trash2 } from 'lucide-react'
import type { InaprocOrder } from '@/types/inaproc'

interface Props {
  isOpen: boolean
  onClose: () => void
  selectedItem: InaprocOrder | null
  onConfirm: (id: number) => void
  isPending: boolean
}

export function InaprocDeleteModal({ isOpen, onClose, selectedItem, onConfirm, isPending }: Props) {
  if (!isOpen || !selectedItem) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Data?</h3>
        <p className="text-sm text-gray-500 mb-6">
          Apakah Anda yakin ingin menghapus data dengan kode <strong>{selectedItem.kode}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <button 
            onClick={() => onConfirm(selectedItem.id)}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-70 transition-colors"
          >
            {isPending ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  )
}