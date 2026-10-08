import { Card } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { pemesananApi } from '@/api/pemesanan'
import type { PemesananData, KategoriPemesanan } from '@/api/pemesanan'
import { masterApi } from '@/api/masterApi'
import { ChevronLeft } from 'lucide-react'
import { formSchema, type FormValues } from './types'
import { KATEGORI_OPTIONS } from '@/constants/options'

import FormPemesan from './components/FormPemesan'
import FormDetailKategori from './components/FormDetailKategori'
import FormPurchaseOrder from './components/FormPurchaseOrder'
import { toast } from "sonner";

export default function PemesananAdd() {
  const navigate = useNavigate()
  const { id } = useParams()
  const queryClient = useQueryClient()
  
  const { data: editData, isError, error } = useQuery({
    queryKey: ['pemesanan', id],
    queryFn: () => pemesananApi.getById(id!),
    enabled: !!id
  })

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kategori: "", kodePemesanan: "", instansi: "", pic: ""
    }
  });
  const { register, handleSubmit, watch, setValue, reset } = methods;

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchKategori = watch("kategori");
  const watchInstansi = watch("instansi");
  const watchPIC = watch("pic");

  const { data: instansiList = [] } = useQuery({ queryKey: ["master_instansi"], queryFn: masterApi.getInstansi })
  const { data: picList = [] } = useQuery({ queryKey: ["master_pic"], queryFn: masterApi.getPIC })
  const { data: wilayahList = [] } = useQuery({ queryKey: ["master_wilayah"], queryFn: masterApi.getWilayah })
  const { data: ekspedisiList = [] } = useQuery({ queryKey: ["master_ekspedisi"], queryFn: masterApi.getEkspedisi })

  useEffect(() => {
    if (watchInstansi) {
      const found = instansiList.find(item => item.namaInstansi === watchInstansi)
      if (found) {
        setValue("npwp", found.npwp || "")
        setValue("alamat", found.alamat || "")
        setValue("kota", found.kotaKab || "")
        setValue("provinsi", found.provinsi || "")
        const relatedPICs = picList.filter(p => p.instansiId === found.id)
        if (relatedPICs.length > 0) {
          setValue("pic", relatedPICs[0].namaPIC || "")
        }
      }
    }
  }, [watchInstansi, instansiList, picList, setValue])

  useEffect(() => {
    if (watchPIC) {
      const found = picList.find(item => item.namaPIC === watchPIC)
      if (found) {
        setValue("nik", found.nik || "")
        setValue("telp", found.noTelp || "")
        setValue("email", found.email || "")
      }
    }
  }, [watchPIC, picList, setValue])

  useEffect(() => {
    if (editData) {
      reset({
        ...editData,
        instansi: editData.namaInstansi,
        pic: editData.namaPIC,
      });
    }
  }, [editData, reset]);

  const saveMutation = useMutation({
    mutationFn: id ? (payload: Omit<PemesananData, 'id'>) => pemesananApi.update(id, payload as Partial<PemesananData>) : pemesananApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pemesanan'] })
      toast.success('Data berhasil disimpan!')
      navigate('/pemesanan')
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      const backendError = err.response?.data?.error || err.message;
      toast.error('Gagal menyimpan data: ' + backendError)
    }
  })

  const onSubmit = (data: FormValues) => {
    const { kategori, kodePemesanan, instansi, pic, telp, email, nik, npwp, alamat, kota, provinsi, ...detail } = data;
    const instansiItem = instansiList.find(i => i.namaInstansi === instansi);
    const picItem = picList.find(p => p.namaPIC === pic);

    const payload: Omit<PemesananData, "id"> = {
      kategori: kategori as KategoriPemesanan,
      kodePemesanan,
      namaInstansi: instansiItem ? String(instansiItem.id) : instansi,
      namaPIC: picItem ? String(picItem.id) : pic,
      noTelpPIC: telp || "",
      emailPIC: email || "",
      nikPIC: nik || "",
      noNPWP: npwp || "",
      alamat: alamat || "",
      kota: kota || "",
      provinsi: provinsi || "",
      ...detail
    };
    saveMutation.mutate(payload);
  }


  return (
    <DashboardLayout title="">
      
      <div className="mb-6 flex items-center gap-4 sticky top-0 bg-[#f8f9fa] z-10 pt-4 pb-4 border-b border-gray-100">
        <Button variant="outline" onClick={() => navigate('/pemesanan')}
          className="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors inline-flex shadow-sm"
          title="Kembali"
        >
          <ChevronLeft size={20} />
        </Button>
        <h2 className="text-xl font-semibold text-gray-800">{id ? 'Form Edit Data' : 'Form Tambah Data'}</h2>
      </div>
        {isError && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6 overflow-auto">
            <p className="font-bold">Gagal mengambil data API untuk di-edit:</p>
            <p className="mt-2 text-sm text-red-700">Pesan: {(error as Error)?.message || "Unknown error"}</p>
          </div>
        )}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-12">
          
          <Card className="w-full border-y md:border md:rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Pilih Kategori <span className="text-red-500">*</span></label>
              <select 
                {...register("kategori")}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>Pilih Kategori</option>
                {KATEGORI_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Kode Pemesanan <span className="text-red-500">*</span></label>
              <Input type="text" 
                {...register("kodePemesanan")}
                placeholder="Masukkan Kode"
                
                required
              />
            </div>
          </Card>

          {watchKategori && (
            <>
              <FormPemesan instansiList={instansiList}  />
              <FormDetailKategori wilayahList={wilayahList} ekspedisiList={ekspedisiList} />
              <FormPurchaseOrder />

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-8">
                <Button variant="outline" type="button" 
                  onClick={() => navigate('/pemesanan')}
                  className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </Button>
                <Button variant="default" type="submit" 
                  disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? 'Menyimpan...' : 'Lanjut / Simpan'}
                </Button>
              </div>
            </>
          )}
        </form>
      </FormProvider>
    </DashboardLayout>
  )
}
