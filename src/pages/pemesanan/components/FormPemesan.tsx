import { Input } from '@/components/ui/input';
import { Combobox } from "@/components/ui/combobox";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormContext } from 'react-hook-form';
import type { FormValues } from '../types';

interface FormPemesanProps {
  instansiList: any[];
}

export default function FormPemesan({ instansiList }: FormPemesanProps) {
  const { register, watch, setValue } = useFormContext<FormValues>();
  const watchKategori = watch("kategori");
  const watchInstansi = watch("instansi");

  const instansiOptions = instansiList.map(item => ({
    value: item.namaInstansi,
    label: item.namaInstansi
  }));
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-[#eef5f5] px-6 py-3 border-b border-gray-200 flex items-center gap-2 text-teal-800 font-semibold">
        <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">i</span>
        <span className="text-base font-semibold">Data Pemesan</span>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Nama Instansi Pemesan <span className="text-red-500">*</span></label>
          <Combobox 
            options={instansiOptions}
            value={watchInstansi}
            onChange={(val) => setValue("instansi", val, { shouldValidate: true })}
            placeholder="Pilih atau ketik instansi..."
          />
          <input type="hidden" {...register("instansi")} />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Nama PIC <span className="text-red-500">*</span></label>
          <Input type="text" {...register("pic")}  />
          <p className="text-xs text-gray-500">Terisi otomatis dari instansi, bebas diubah</p>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Nomor Telepon PIC <span className="text-red-500">*</span></label>
          <Input type="text" {...register("telp")}  />
          <p className="text-xs text-gray-500">Terisi otomatis dari instansi, bebas diubah</p>
        </div>
        {watchKategori !== 'IoT Inaproc' && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">E-Mail <span className="text-red-500">*</span></label>
            <Input type="text" {...register("email")}  />
          </div>
        )}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">NIK PIC <span className="text-red-500">*</span></label>
          <Input type="text" {...register("nik")}  />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Nomor NPWP <span className="text-red-500">*</span></label>
          <Input type="text" {...register("npwp")}  />
          <p className="text-xs text-gray-500">Terisi otomatis, bisa diubah</p>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Alamat <span className="text-red-500">*</span></label>
          <Input type="text" {...register("alamat")}  />
          <p className="text-xs text-gray-500">Terisi otomatis, bisa diubah</p>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Kota/Kabupaten <span className="text-red-500">*</span></label>
          <Input type="text" {...register("kota")}  />
          <p className="text-xs text-gray-500">Terisi otomatis, bisa diubah</p>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Provinsi <span className="text-red-500">*</span></label>
          <Input type="text" {...register("provinsi")}  />
          <p className="text-xs text-gray-500">Terisi otomatis, bisa diubah</p>
        </div>
      </div>
    </div>
  );
}
