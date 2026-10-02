import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Trash2, Plus, Edit2, X } from 'lucide-react'
import { masterApi } from '@/api/masterApi'

type TabType = 'instansi' | 'pic' | 'ekspedisi' | 'wilayah'

export default function MasterData() {
  const [activeTab, setActiveTab] = useState<TabType>('instansi')
  const queryClient = useQueryClient()

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  // Queries
  const { data: instansiList = [] } = useQuery({ queryKey: ['master_instansi'], queryFn: masterApi.getInstansi })
  const { data: picList = [] } = useQuery({ queryKey: ['master_pic'], queryFn: masterApi.getPIC })
    const { data: ekspedisiList = [] } = useQuery({ queryKey: ['master_ekspedisi'], queryFn: masterApi.getEkspedisi })
  const { data: wilayahList = [] } = useQuery({ queryKey: ['master_wilayah'], queryFn: masterApi.getWilayah })

  // Form States
  // Instansi
  const [namaInstansi, setNamaInstansi] = useState('')
  const [npwp, setNpwp] = useState('')
  const [alamat, setAlamat] = useState('')
  const [provinsi, setProvinsi] = useState('')
  const [kotaKab, setKotaKab] = useState('')
  // PIC (shared with Instansi for nik)
  const [instansiId, setInstansiId] = useState('')
  const [namaPIC, setNamaPIC] = useState('')
  const [nik, setNik] = useState('')
  const [email, setEmail] = useState('')
  const [noTelp, setNoTelp] = useState('')
    // Ekspedisi
  const [namaEkspedisi, setNamaEkspedisi] = useState('')
  // Wilayah
  // using provinsi, kotaKab, alamat

  // Mutations
  const invalidate = (key: string) => {
    queryClient.invalidateQueries({ queryKey: [key] })
    closeModal()
  }

  // Add Mutations
  const addInstansiMut = useMutation({ mutationFn: masterApi.addInstansi, onSuccess: () => invalidate('master_instansi') })
  const addPICMut = useMutation({ mutationFn: masterApi.addPIC, onSuccess: () => invalidate('master_pic') })
    const addEkspedisiMut = useMutation({ mutationFn: masterApi.addEkspedisi, onSuccess: () => invalidate('master_ekspedisi') })
  const addWilayahMut = useMutation({ mutationFn: masterApi.addWilayah, onSuccess: () => invalidate('master_wilayah') })

  // Update Mutations
  const updInstansiMut = useMutation({ mutationFn: masterApi.updateInstansi, onSuccess: () => invalidate('master_instansi') })
  const updPICMut = useMutation({ mutationFn: masterApi.updatePIC, onSuccess: () => invalidate('master_pic') })
    const updEkspedisiMut = useMutation({ mutationFn: masterApi.updateEkspedisi, onSuccess: () => invalidate('master_ekspedisi') })
  const updWilayahMut = useMutation({ mutationFn: masterApi.updateWilayah, onSuccess: () => invalidate('master_wilayah') })

  // Delete Mutations
  const delInstansiMut = useMutation({ mutationFn: masterApi.deleteInstansi, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['master_instansi'] }) })
  const delPICMut = useMutation({ mutationFn: masterApi.deletePIC, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['master_pic'] }) })
    const delEkspedisiMut = useMutation({ mutationFn: masterApi.deleteEkspedisi, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['master_ekspedisi'] }) })
  const delWilayahMut = useMutation({ mutationFn: masterApi.deleteWilayah, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['master_wilayah'] }) })

  const resetForms = () => {
    setEditId(null)
    setNamaInstansi(''); setNpwp(''); setAlamat(''); setProvinsi(''); setKotaKab('');
    setInstansiId(''); setNamaPIC(''); setNik(''); setEmail(''); setNoTelp('');
    
    setNamaEkspedisi('');
  }

  const openAddModal = () => {
    resetForms()
    setIsModalOpen(true)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const openEditModal = (item: any) => {
    resetForms()
    setEditId(item.id)
    if (activeTab === 'instansi') {
      setNamaInstansi(item.namaInstansi); setNik(item.nik || ''); setNpwp(item.npwp); setAlamat(item.alamat); setProvinsi(item.provinsi); setKotaKab(item.kotaKab);
    } else if (activeTab === 'pic') {
      setInstansiId(item.instansiId); setNamaPIC(item.namaPIC); setNik(item.nik); setEmail(item.email); setNoTelp(item.noTelp);
    } else if (activeTab === 'ekspedisi') {
      setNamaEkspedisi(item.namaEkspedisi);
    } else if (activeTab === 'wilayah') {
      setProvinsi(item.provinsi || ''); setKotaKab(item.kotaKab || ''); setAlamat(item.alamat || '');
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    resetForms()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (activeTab === 'instansi') {
      if (editId) updInstansiMut.mutate({ id: editId, namaInstansi, nik: '', npwp, alamat, provinsi, kotaKab })
      else addInstansiMut.mutate({ namaInstansi, nik: '', npwp, alamat, provinsi, kotaKab })
    } else if (activeTab === 'pic') {
      if (editId) updPICMut.mutate({ id: editId, instansiId, namaPIC, nik, email, noTelp })
      else addPICMut.mutate({ instansiId, namaPIC, nik, email, noTelp })
    } else if (activeTab === 'ekspedisi') {
      if (editId) updEkspedisiMut.mutate({ id: editId, namaEkspedisi })
      else addEkspedisiMut.mutate({ namaEkspedisi })
    } else if (activeTab === 'wilayah') {
      if (editId) updWilayahMut.mutate({ id: editId, namaWilayah: '', provinsi, kotaKab, alamat })
      else addWilayahMut.mutate({ namaWilayah: '', provinsi, kotaKab, alamat })
    }
  }

  const tabs: { id: TabType, label: string }[] = [
    { id: 'instansi', label: 'Master Instansi' },
    { id: 'pic', label: 'Master PIC' },
        { id: 'ekspedisi', label: 'Master Ekspedisi' },
    { id: 'wilayah', label: 'Master Wilayah' },
  ]

  return (
    <DashboardLayout title="Master Data">
      <div className="space-y-6">
        
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); resetForms(); }}
              className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors relative ${
                activeTab === tab.id ? 'text-[#0f766e]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0f766e]"></div>
              )}
            </button>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-base font-semibold text-gray-800">Daftar {tabs.find(t => t.id === activeTab)?.label}</h2>
            <button onClick={openAddModal} className="bg-[#0f766e] text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-[#115e59] transition-colors">
              <Plus size={16} /> Tambah {tabs.find(t => t.id === activeTab)?.label.replace('Master ', '')}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-800 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">No</th>
                  {activeTab === 'instansi' && <><th className="px-4 py-3">Instansi</th><th className="px-4 py-3">NPWP</th><th className="px-4 py-3">Alamat</th><th className="px-4 py-3">Kota/Kabupaten</th><th className="px-4 py-3">Provinsi</th></>}
                  {activeTab === 'pic' && <><th className="px-4 py-3">Instansi</th><th className="px-4 py-3">Nama PIC</th><th className="px-4 py-3">NIK</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Telepon</th></>}
                  
                  {activeTab === 'ekspedisi' && <th className="px-4 py-3">Nama Ekspedisi</th>}
                  {activeTab === 'wilayah' && <><th className="px-4 py-3">Provinsi</th><th className="px-4 py-3">Kota/Kabupaten</th><th className="px-4 py-3">Alamat</th></>}
                  <th className="px-4 py-3 w-24 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">

                {activeTab === 'instansi' && instansiList.length === 0 && <tr><td colSpan={8} className="text-center py-8">Belum ada data</td></tr>}
                {activeTab === 'instansi' && instansiList.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{item.namaInstansi}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{item.npwp || '-'}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 truncate max-w-50" title={item.alamat}>{item.alamat || '-'}</td>
                    <td className="px-4 py-3 text-xs">{item.kotaKab}</td>
                    <td className="px-4 py-3 text-xs">{item.provinsi}</td>
                    <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                      <button onClick={() => openEditModal(item)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded"><Edit2 size={16}/></button>
                      <button onClick={() => { if(confirm('Yakin ingin menghapus?')) delInstansiMut.mutate(item.id) }} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}

                {activeTab === 'pic' && picList.length === 0 && <tr><td colSpan={7} className="text-center py-8">Belum ada data</td></tr>}
                {activeTab === 'pic' && picList.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center">{idx + 1}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{instansiList.find(i => i.id === item.instansiId)?.namaInstansi || 'Unknown'}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{item.namaPIC}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{item.nik || '-'}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{item.email || '-'}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{item.noTelp || '-'}</td>
                    <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                      <button onClick={() => openEditModal(item)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded"><Edit2 size={16}/></button>
                      <button onClick={() => { if(confirm('Yakin ingin menghapus?')) delPICMut.mutate(item.id) }} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}

                {activeTab === 'ekspedisi' && ekspedisiList.length === 0 && <tr><td colSpan={3} className="text-center py-8">Belum ada data</td></tr>}
                                {activeTab === 'ekspedisi' && ekspedisiList.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{item.namaEkspedisi}</td>
                    <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                      <button onClick={() => openEditModal(item)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded"><Edit2 size={16}/></button>
                      <button onClick={() => { if(confirm('Yakin ingin menghapus?')) delEkspedisiMut.mutate(item.id) }} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}

                {activeTab === 'wilayah' && wilayahList.length === 0 && <tr><td colSpan={5} className="text-center py-8">Belum ada data</td></tr>}
                {activeTab === 'wilayah' && wilayahList.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{item.provinsi}</td>
                    <td className="px-4 py-3 text-gray-800">{item.kotaKab}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{item.alamat || '-'}</td>
                    <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                      <button onClick={() => openEditModal(item)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded"><Edit2 size={16}/></button>
                      <button onClick={() => { if(confirm('Yakin ingin menghapus?')) delWilayahMut.mutate(item.id) }} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 size={16}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                {editId ? 'Edit' : 'Tambah'} {tabs.find(t => t.id === activeTab)?.label}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">

                {activeTab === 'instansi' && (
                  <>
                    <input required placeholder="Nama Instansi" value={namaInstansi} onChange={e => setNamaInstansi(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#0f766e] outline-none" />
                    <input placeholder="NPWP" value={npwp} onChange={e => setNpwp(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#0f766e] outline-none" />
                    <input required placeholder="Provinsi" value={provinsi} onChange={e => setProvinsi(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#0f766e] outline-none" />
                    <input required placeholder="Kota/Kabupaten" value={kotaKab} onChange={e => setKotaKab(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#0f766e] outline-none" />
                    <textarea required placeholder="Alamat Lengkap" value={alamat} onChange={e => setAlamat(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#0f766e] outline-none h-20" />
                  </>
                )}

                {activeTab === 'pic' && (
                  <>
                    <select required value={instansiId} onChange={e => setInstansiId(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#0f766e] outline-none bg-white">
                      <option value="" disabled>Pilih Instansi</option>
                      {instansiList.map(i => <option key={i.id} value={i.id}>{i.namaInstansi}</option>)}
                    </select>
                    <input required placeholder="Nama PIC" value={namaPIC} onChange={e => setNamaPIC(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#0f766e] outline-none" />
                    <input required placeholder="NIK" value={nik} onChange={e => setNik(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#0f766e] outline-none" />
                    <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#0f766e] outline-none" />
                    <input required placeholder="Nomor Telepon" value={noTelp} onChange={e => setNoTelp(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#0f766e] outline-none" />
                  </>
                )}

                
                {activeTab === 'ekspedisi' && (
                  <input required placeholder="Nama Ekspedisi" value={namaEkspedisi} onChange={e => setNamaEkspedisi(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#0f766e] outline-none" />
                )}

                {activeTab === 'wilayah' && (
                  <>
                    <input required placeholder="Provinsi" value={provinsi} onChange={e => setProvinsi(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#0f766e] outline-none" />
                    <input required placeholder="Kota/Kabupaten" value={kotaKab} onChange={e => setKotaKab(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#0f766e] outline-none" />
                    <textarea placeholder="Alamat (Opsional)" value={alamat} onChange={e => setAlamat(e.target.value)} className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#0f766e] outline-none h-20" />
                  </>
                )}

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors">
                    Batal
                  </button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-[#0f766e] text-white hover:bg-[#115e59] rounded-md text-sm font-medium transition-colors">
                    {editId ? 'Simpan Perubahan' : 'Simpan Data'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
