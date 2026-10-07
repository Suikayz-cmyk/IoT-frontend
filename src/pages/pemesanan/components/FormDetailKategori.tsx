import { Input } from '@/components/ui/input';
import { useEffect } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormContext } from 'react-hook-form';
import type { FormValues } from '../types';
import CustomDatePicker from '@/components/ui/CustomDatePicker';

const TIMBANGAN_PRICES: Record<string, { produk: number, reseller: number }> = {
  "Sonic Opsi A": { produk: 4500000, reseller: 4500000 },
  "Sonic Opsi B": { produk: 6750000, reseller: 6750000 },
  "Sonic Opsi C": { produk: 12000000, reseller: 12000000 },
  "Sonic Opsi D": { produk: 15950000, reseller: 15950000 },
  "Quattro Opsi A": { produk: 5000000, reseller: 4500000 },
  "Quattro Opsi B": { produk: 5000000, reseller: 4500000 },
  "Quattro Opsi C": { produk: 5000000, reseller: 4500000 },
};

export default function FormDetailKategori({ wilayahList = [], ekspedisiList = [] }: { wilayahList?: any[], ekspedisiList?: any[] }) {
  const { register, watch, setValue } = useFormContext<FormValues>();
  const watchKategori = watch("kategori");
  const isTimbangan = watchKategori === 'Timbangan Inaproc' || watchKategori === 'Timbangan Manual' || watchKategori?.startsWith('RCW');
  const isIoT = watchKategori === 'IoT Inaproc' || watchKategori === 'IoT Manual';
  const isManual = watchKategori === 'IoT Manual' || watchKategori === 'Timbangan Manual';
  
  const watchTipeTimbangan = watch("tipeTimbangan");
  const watchOngkirKUT = watch("ongkirKUT");
  const watchQuantity = watch("quantity");

  useEffect(() => {
    if (isTimbangan && watchTipeTimbangan && TIMBANGAN_PRICES[watchTipeTimbangan]) {
      const p = TIMBANGAN_PRICES[watchTipeTimbangan];
      const ongkirStr = String(watchOngkirKUT || '0').replace(/\./g, "").replace(/,/g, "").replace(/[^0-9.-]+/g, "");
      const ongkir = parseFloat(ongkirStr) || 0;
      
      const qtyStr = String(watchQuantity || '1').replace(/[^0-9.-]+/g, "");
      const qty = parseFloat(qtyStr) || 1;

      const baseProduk = p.produk * qty;
      const baseReseller = p.reseller * qty;

      const ppn11 = baseProduk * 0.11;
      const ppnOngkir = ongkir * 0.11;
      
      setValue("harga", String(baseProduk));
      setValue("ppn11", String(ppn11));
      setValue("hargaPPN11Ongkir", String(ppnOngkir));
      setValue("totalHargaOngkir", String(baseProduk + ongkir));
      setValue("totalHargaJual", String(baseProduk + ppn11 + ongkir + ppnOngkir));
      
      const ppnReseller = baseReseller * 0.11;
      setValue("hargaProdukReseller", String(baseReseller));
      setValue("ppn11Reseller", String(ppnReseller));
      setValue("ongkirReseller", String(ongkir));
      setValue("hargaPPN11OngkirReseller", String(ppnOngkir));
      setValue("totalHargaOngkirReseller", String(baseReseller + ongkir));
      setValue("totalHargaReseller", String(baseReseller + ppnReseller + ongkir + ppnOngkir));
    }
  }, [watchTipeTimbangan, watchOngkirKUT, watchQuantity, isTimbangan, setValue]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-[#eef5f5] px-6 py-3 border-b border-gray-200 flex items-center gap-2 text-teal-800 font-semibold">
        <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">i</span>
        <span className="text-base font-semibold">Detail {watchKategori}</span>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

                

                {isIoT && (
                  <>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Quantity <span className="text-red-500">*</span></label>
                      <Input type="number" {...register("quantity")}  />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Periode Berlangganan <span className="text-red-500">*</span></label>
                      <select {...register("periodeBerlangganan")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                        <option value="">Pilih Periode</option>
                        <option value="1 Tahun">1 Tahun</option>
                        <option value="2 Tahun">2 Tahun</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Harga + PPN <span className="text-red-500">*</span></label>
                      <Input type="text" placeholder="Rp" {...register("hargaPPN")}  />
                    </div>
                  </>
                )}

                {isTimbangan && (
                  <>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Tipe Timbangan Produk <span className="text-red-500">*</span></label>
                      <select {...register("tipeTimbangan")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                        <option value="">Pilih Tipe</option>
                        <option value="Sonic Opsi A">Sonic Opsi A</option>
                        <option value="Sonic Opsi B">Sonic Opsi B</option>
                        <option value="Sonic Opsi C">Sonic Opsi C</option>
                        <option value="Sonic Opsi D">Sonic Opsi D</option>
                        <option value="Quattro Opsi A">Quattro Opsi A</option>
                        <option value="Quattro Opsi B">Quattro Opsi B</option>
                        <option value="Quattro Opsi C">Quattro Opsi C</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Quantity <span className="text-red-500">*</span></label>
                      <Input type="number" {...register("quantity")}  />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Wilayah Pengiriman <span className="text-red-500">*</span></label>
                      <select {...register("wilayahPengiriman")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                        <option value="">Pilih Wilayah</option>
                        {wilayahList.map(item => (
                          <option key={item.id} value={item.id}>{item.namaWilayah}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Berat (KG) <span className="text-red-500">*</span></label>
                      <select {...register("berat")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                        <option value="">Pilih Berat</option>
                        <option value="1">1 KG</option>
                        <option value="3">3 KG</option>
                        <option value="13">13 KG</option>
                        <option value="31">31 KG</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Ekspedisi</label>
                      <select {...register("ekspedisi")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                        <option value="">Pilih Ekspedisi</option>
                        {ekspedisiList.map(item => (
                          <option key={item.id} value={item.id}>{item.namaEkspedisi}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Nomor Resi</label>
                      <Input type="text" placeholder="Masukkan Nomor" {...register("nomorResi")}  />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Tanggal Barang Diterima</label>
                      <CustomDatePicker  {...register("tanggalBarangDiterima")} />
                    </div>
                    
                    <div className="hidden md:block"></div> 

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Harga <span className="text-red-500">*</span></label>
                      <Input type="text" placeholder="Rp" {...register("harga")}  />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">PPN 11% <span className="text-red-500">*</span></label>
                      <Input type="text" placeholder="Rp" {...register("ppn11")}  />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Ongkir KUT <span className="text-red-500">*</span></label>
                      <Input type="text" placeholder="Rp" {...register("ongkirKUT")}  />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Harga PPN 11% + Ongkir <span className="text-red-500">*</span></label>
                      <Input type="text" placeholder="Rp" {...register("hargaPPN11Ongkir")}  />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Total Harga + Ongkir <span className="text-red-500">*</span></label>
                      <Input type="text" placeholder="Rp" {...register("totalHargaOngkir")}  />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Total Harga Jual <span className="text-red-500">*</span></label>
                      <Input type="text" placeholder="Rp" {...register("totalHargaJual")}  />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Harga Produk Reseller <span className="text-red-500">*</span></label>
                      <Input type="text" placeholder="Rp" {...register("hargaProdukReseller")}  />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">PPN 11% Reseller <span className="text-red-500">*</span></label>
                      <Input type="text" placeholder="Rp" {...register("ppn11Reseller")}  />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Ongkir Reseller <span className="text-red-500">*</span></label>
                      <Input type="text" placeholder="Rp" {...register("ongkirReseller")}  />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Harga PPN 11% + Ongkir Reseller <span className="text-red-500">*</span></label>
                      <Input type="text" placeholder="Rp" {...register("hargaPPN11OngkirReseller")}  />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Total Harga + Ongkir Reseller <span className="text-red-500">*</span></label>
                      <Input type="text" placeholder="Rp" {...register("totalHargaOngkirReseller")}  />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Total Harga Reseller <span className="text-red-500">*</span></label>
                      <Input type="text" placeholder="Rp" {...register("totalHargaReseller")}  />
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Status Pesanan <span className="text-red-500">*</span></label>
                  <select {...register("statusPesanan")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option value="">Pilih Status</option>
                    <option value="pending">Pending</option>
                    <option value="baru">Baru</option>
                    <option value="diproses">Diproses</option>
                    <option value="Dikirim">Dikirim</option>
                    <option value="selesai">Selesai</option>
                    <option value="batal">Batal</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Status Odoo <span className="text-red-500">*</span></label>
                  <select {...register("statusOdoo")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option value="">Pilih Status</option>
                    <option value="draft">Draft</option>
                    <option value="confirmed">Confirmed</option>
                  </select>
                </div>

                {watchKategori === 'IoT Manual' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Bulan Pengiriman SPH <span className="text-red-500">*</span></label>
                      <select {...register("bulanPengirimanSPH")} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                        <option value="">Pilih Bulan</option>
                        <option value="Januari">Januari</option>
                        <option value="Februari">Februari</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Nomor Surat Penawaran Harga <span className="text-red-500">*</span></label>
                      <Input type="text" placeholder="Masukkan Nomor" {...register("nomorSuratPenawaranHarga")}  />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Nomor Kontrak Berlangganan <span className="text-red-500">*</span></label>
                      <Input type="text" placeholder="Masukkan Nomor" {...register("nomorKontrakBerlangganan")}  />
                    </div>
                  </>
                )}

                {isTimbangan && (
                  <>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Nomor Penyampaian Daftar Harga</label>
                      <Input type="text" placeholder="Masukkan Nomor" {...register("nomorPenyampaianDaftarHarga")}  />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Nomor Formulir Pembelian</label>
                      <Input type="text" placeholder="Masukkan Nomor" {...register("nomorFormulirPembelian")}  />
                    </div>
                  </>
                )}

                {isManual && isIoT && (
                   <div className="space-y-1">
                     <label className="text-sm font-medium text-gray-700">Nomor Formulir Berlangganan <span className="text-red-500">*</span></label>
                     <Input type="text" placeholder="Masukkan Nomor" {...register("nomorFormulirBerlangganan")}  />
                   </div>
                )}
               </div>
             </div>
  );
}
