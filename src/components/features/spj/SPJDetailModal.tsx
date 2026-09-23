import { X } from 'lucide-react'
import type { SPJOrder } from '@/types/spj'
import { formatDate } from '@/utils/formatters'

interface Props {
  isOpen: boolean
  onClose: () => void
  data: SPJOrder | null
}

const DetailRow = ({ label, value }: { label: string, value: React.ReactNode }) => (
  <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100 last:border-0">
    <span className="text-sm font-medium text-gray-500">{label}</span>
    <span className="col-span-2 text-sm text-gray-900 font-medium">{value || '-'}</span>
  </div>
)

export function SPJDetailModal({ isOpen, onClose, data }: Props) {
  if (!isOpen || !data) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Detail SPJ</h2>
            <p className="text-sm text-gray-500 mt-1">Dinkes / PKM: {data.nama_dinkes_pkm}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex flex-col overflow-y-auto p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            
            <div>
              <h3 className="text-xs font-bold text-[#0f766e] uppercase tracking-wider mb-3 mt-4">Informasi Umum</h3>
              <DetailRow label="Nama Dinkes / PKM" value={data.nama_dinkes_pkm} />
              <DetailRow label="Status Pengiriman" value={
                <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs border border-gray-200">
                  {data.status_pengiriman}
                </span>
              } />
              <DetailRow label="Kebutuhan SPJ" value={data.kebutuhan_spj} />
              <DetailRow label="UP/No.Telp/Alamat" value={data.up_nomor_telepon_alamat} />
            </div>

            <div>
              <h3 className="text-xs font-bold text-[#0f766e] uppercase tracking-wider mb-3 mt-4">Timeline</h3>
              <DetailRow label="Tanggal Print" value={formatDate(data.tgl_print)} />
              <DetailRow label="Tanggal Paraf" value={formatDate(data.tgl_paraf)} />
              <DetailRow label="Tanggal Sign" value={formatDate(data.tgl_sign)} />
              <DetailRow label="Tanggal Kirim" value={formatDate(data.tgl_kirim)} />
            </div>

            <div className="md:col-span-1">
              <h3 className="text-xs font-bold text-[#0f766e] uppercase tracking-wider mb-3 mt-6">Spesifikasi Dokumen</h3>
              <DetailRow label="Kertas" value={data.kertas} />
              <DetailRow label="Jenis File" value={data.jenis_file} />
              <DetailRow label="Jumlah Rangkap" value={`${data.jumlah_rangkap} Rangkap`} />
              <DetailRow label="PIC Print" value={data.pic_print} />
            </div>

            <div className="md:col-span-2 mt-4">
              <DetailRow label="Keterangan" value={data.keterangan} />
            </div>

          </div>
        </div>

        <div className="p-5 border-t border-gray-100 flex justify-end bg-gray-50">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}

