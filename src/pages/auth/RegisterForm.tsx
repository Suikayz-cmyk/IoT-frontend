import { useState } from 'react'
import { EyeOffIcon, EyeIcon } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from "sonner";

interface RegisterFormProps {
  setView: (view: 'login' | 'forgot' | 'reset' | 'register') => void
}

export default function RegisterForm({ setView }: RegisterFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const registerMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/register', {
        name,
        email,
        password
      })
      return response.data
    },
    onSuccess: () => {
      toast.success('Registrasi berhasil! Silakan login menggunakan akun baru Anda.')
      setView('login')
    },
    onError: (error: unknown) => {
      let msg = 'Terjadi kesalahan saat register.'
      if (axios.isAxiosError(error)) {
        msg = error.response?.data?.message || error.message
      } else if (error instanceof Error) {
        msg = error.message
      }
      toast.error('Registrasi gagal: ' + msg)
    }
  })

  return (
    <>
      <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">Daftar Akun</h1>
      <p className="text-gray-900 text-lg mb-8 font-medium">
        Buat akun baru untuk mengakses sistem.
      </p>
      
      <form onSubmit={(e) => { e.preventDefault(); registerMutation.mutate(); }} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold block text-black" htmlFor="name">
            Nama Lengkap
          </label>
          <input 
            id="name" 
            type="text" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#f4f5f9] rounded-md px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0f766e]/50 text-gray-800 font-medium"
            placeholder="Masukkan nama Anda"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold block text-black" htmlFor="emailReg">
            Email
          </label>
          <input 
            id="emailReg" 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#f4f5f9] rounded-md px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0f766e]/50 text-gray-800 font-medium"
            placeholder="name@company.com"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-bold block text-black" htmlFor="passwordReg">
            Password
          </label>
          <div className="relative">
            <input 
              id="passwordReg" 
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#f4f5f9] rounded-md px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0f766e]/50 text-gray-800 font-medium"
              placeholder="••••••••"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          </div>
        </div>

        {registerMutation.isError && (
          <div className="text-red-500 text-sm font-semibold text-center bg-red-50 p-2 rounded">
            {axios.isAxiosError(registerMutation.error) 
              ? registerMutation.error.response?.data?.message || registerMutation.error.message 
              : (registerMutation.error as Error)?.message || 'Registrasi gagal. Coba lagi.'}
          </div>
        )}

        <button 
          type="submit" 
          disabled={registerMutation.isPending}
          className="w-full bg-[#0f766e] hover:bg-[#115e59] disabled:bg-[#0f766e]/70 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-md transition-colors mt-2"
        >
          {registerMutation.isPending ? 'Mendaftar...' : 'Daftar Sekarang'}
        </button>
      </form>

      <p className="text-center text-sm font-medium mt-8 text-black">
        Sudah punya akun?{' '}
        <button type="button" onClick={() => setView('login')} className="text-[#0f766e] font-semibold hover:underline">
          Login
        </button>
      </p>
    </>
  )
}
