import FormKeuangan from './FormKeuangan';
import { useFormContext } from 'react-hook-form';
import type { FormValues } from '../types';
import CustomDatePicker from '@/components/ui/CustomDatePicker';

export default function FormPurchaseOrder() {
  const { register, watch } = useFormContext<FormValues>();
  const watchKategori = watch("kategori");
  const isTimbangan = watchKategori === 'Timbangan Inaproc' || watchKategori === 'Timbangan Manual' || watchKategori?.startsWith('RCW');
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-[#eef5f5] px-6 py-3 border-b border-gray-200 flex items-center gap-2 text-teal-800 font-semibold">
                <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">i</span>
                Detail Purchase Order
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Tanggal Pesanan PO <span className="text-red-500">*</span></label>
                  <CustomDatePicker  {...register("tanggalPesananPO")} />
                </div>
                {isTimbangan && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Nomor PO KUT <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Masukkan Nomor" {...register("nomorPOKUT")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Tanggal BAST <span className="text-red-500">*</span></label>
                  <CustomDatePicker  {...register("tanggalBAST")} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nomor BAST <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Masukkan Nomor" {...register("nomorBAST")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nomor Invoice KUT <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Masukkan Nomor" {...register("nomorInvoiceKUT")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Tanggal Invoice KUT <span className="text-red-500">*</span></label>
                  <CustomDatePicker  {...register("tanggalInvoiceKUT")} />
                </div>
                {watchKategori !== 'IoT Manual' && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Nomor Invoice Inaproc <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Masukkan Nomor" {...register("nomorInvoiceInaproc")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">NSFP <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Masukkan NSFP" {...register("nsfp")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <FormKeuangan />
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">Keterangan <span className="text-red-500">*</span></label>
                  <textarea placeholder="Masukkan Keterangan" {...register("keterangan")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" rows={3}></textarea>
                </div>
              </div>
            </div>
  );
}
