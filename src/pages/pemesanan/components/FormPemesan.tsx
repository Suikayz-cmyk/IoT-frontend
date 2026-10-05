/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormContext } from 'react-hook-form';
import type { FormValues } from '../types';

interface FormPemesanProps {
  instansiList: any[];
}

export default function FormPemesan({ instansiList }: FormPemesanProps) {
  const { register, watch } = useFormContext<FormValues>();
  const watchKategori = watch("kategori");
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-[#eef5f5] px-6 py-3 border-b border-gray-200 flex items-center gap-2 text-teal-800 font-semibold">
                <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">i</span>
                Data Pemesan
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nama Instansi Pemesan <span className="text-red-500">*</span></label>
                  <select 
                    {...register("instansi")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e] bg-white"
                    required
                  >
                    <option value="" disabled>Pilih Instansi Pemesan</option>
                    {instansiList.map(item => <option key={item.id} value={item.namaInstansi}>{item.namaInstansi}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nama PIC <span className="text-red-500">*</span></label>
                  <input type="text" {...register("pic")} className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />
                  <p className="text-xs text-gray-500">Terisi otomatis dari instansi, bebas diubah</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nomor Telepon PIC <span className="text-red-500">*</span></label>
                  <input type="text" {...register("telp")} className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />
                  <p className="text-xs text-gray-500">Terisi otomatis dari instansi, bebas diubah</p>
                </div>
                {watchKategori !== 'IoT Inaproc' && (
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">E-Mail <span className="text-red-500">*</span></label>
                    <input type="text" {...register("email")} className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">NIK PIC <span className="text-red-500">*</span></label>
                  <input type="text" {...register("nik")} className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nomor NPWP <span className="text-red-500">*</span></label>
                  <input type="text" {...register("npwp")} className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />
                  <p className="text-xs text-gray-500">Terisi otomatis, bisa diubah</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Alamat <span className="text-red-500">*</span></label>
                  <input type="text" {...register("alamat")} className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />
                  <p className="text-xs text-gray-500">Terisi otomatis, bisa diubah</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Kota/Kabupaten <span className="text-red-500">*</span></label>
                  <input type="text" {...register("kota")} className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />
                  <p className="text-xs text-gray-500">Terisi otomatis, bisa diubah</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Provinsi <span className="text-red-500">*</span></label>
                  <input type="text" {...register("provinsi")} className="w-full border border-gray-300 bg-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f766e]" />
                  <p className="text-xs text-gray-500">Terisi otomatis, bisa diubah</p>
                </div>
              </div>
            </div>
  );
}
