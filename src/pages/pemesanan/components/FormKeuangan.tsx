import { useFormContext } from 'react-hook-form';
import type { FormValues } from '../types';
import CustomDatePicker from '@/components/ui/CustomDatePicker';

export default function FormKeuangan() {
  const { register, watch } = useFormContext<FormValues>();
  const watchKategori = watch('kategori');
  
  return (
    <>
<div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Tanggal Uang Masuk <span className="text-red-500">*</span></label>
                  <CustomDatePicker  {...register("tanggalUangMasuk")} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Jumlah Uang Masuk <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Rp0" {...register("jumlahUangMasuk")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Rekening Penerima <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Masukkan Nomor Rekening Penerima" {...register("rekeningPenerima")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                </div>
                {watchKategori !== 'IoT Manual' && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Kode Bayar <span className="text-red-500">*</span></label>
                  <select {...register("kodeBayar")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option value="">Pilih Kode Bayar</option>
                    <option value="UP">UP</option>
                    <option value="LS">LS</option>
                  </select>
                </div>
              )}
    </>
  );
}
