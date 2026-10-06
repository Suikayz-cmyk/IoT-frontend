import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

﻿/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormContext } from 'react-hook-form';
import type { FormValues } from '../types';

interface FormPemesanProps {
  instansiList: any[];
}

export default function FormPemesan({ instansiList }: FormPemesanProps) {
  const { register, watch } = useFormContext<FormValues>();
  const watchKategori = watch("kategori");
  
  return (
    <Card className="overflow-hidden shadow-sm">
              <CardHeader className="bg-[#eef5f5] px-6 py-3 border-b flex flex-row items-center gap-2 space-y-0 text-teal-800 font-semibold">
                <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">i</span>
                <CardTitle className="text-base font-semibold">Data Pemesan</CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
              </CardContent>
            </Card>
  );
}
