import { useState, useEffect } from 'react'
import { EyeOffIcon, EyeIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import illustrationImg from '@/assets/login-illustration.png'
import { authApi } from '@/api/auth'
import { toast } from "sonner";

type ViewMode = 'login' | 'forgot' | 'reset' | 'register'

export default function LoginPage() {
  const [view, setView] = useState<ViewMode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  // States untuk Reset Password Flow
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    // Jika user sudah login (punya token), lempar langsung ke dashboard
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  const loginMutation = useMutation({
    mutationFn: async () => {
      // Menyesuaikan field Email dan Password sesuai struct Go
      const response = await axios.post('/api/login', {
        email: email,
        password: password
      })
      return response.data
    },
    onSuccess: (data) => {
      // Asumsi API mengembalikan field token di dalam data.data.token
      const token = data?.data?.token || data?.token;
      if (token) {
        localStorage.setItem('token', token)
        localStorage.setItem('userEmail', email)
        // Simpan role dari response jika tersedia
        const role = data?.data?.user?.role || ''
        if (role) localStorage.setItem('userRole', role)
        navigate('/dashboard')
      } else {
        toast.error('Login gagal: Token tidak ditemukan dalam response server.')
      }
    },
    onError: (error: unknown) => {
      let msg = 'Terjadi kesalahan saat login.'
      if (axios.isAxiosError(error)) {
        msg = error.response?.data?.message || error.message
      } else if (error instanceof Error) {
        msg = error.message
      }
      toast.error('Login gagal: ' + msg)
    }
  })

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

  const forgotMutation = useMutation({
    mutationFn: (emailToReset: string) => authApi.forgotPassword(emailToReset),
    onSuccess: (data) => {
      if (data.reset_token_dev) {
        setResetToken(data.reset_token_dev)
        setView('reset')
        toast.success('Link reset/token berhasil didapatkan (Mode Dev). Silakan masukkan password baru Anda.')
      } else {
        toast('Cek email Anda untuk link reset password.')
        setView('login')
      }
    },
    onError: (err) => toast.error(axios.isAxiosError(err) ? err.response?.data?.message : err.message)
  })

  const resetMutation = useMutation({
    mutationFn: () => authApi.resetPassword(resetToken, newPassword),
    onSuccess: () => {
      toast.success('Password berhasil diubah!')
      setView('login')
      setNewPassword('')
      setResetToken('')
    },
    onError: (err) => toast.error(axios.isAxiosError(err) ? err.response?.data?.message : err.message)
  })

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      loginMutation.mutate()
    }
  }

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      forgotMutation.mutate(email)
    }
  }

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 8) {
      toast.error('Password baru harus minimal 8 karakter!')
      return
    }
    resetMutation.mutate()
  }

  return (
    <div className="min-h-screen flex bg-white text-black font-sans relative zoom-[0.75]">
      
      <header className="absolute top-0 left-0 right-0 flex justify-between items-center px-8 lg:px-16 py-8 z-10 w-full">
        <div className="text-3xl lg:text-4xl text-[#0f766e] font-bold">IOT Logger</div>
        
      </header>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-24 pt-40 pb-12 mt-8 lg:mt-0 relative z-0">
        <div className="max-w-md w-full mx-auto">
          
          {view === 'login' && (
            <>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">Login now</h1>
              <p className="text-gray-900 text-lg mb-8 font-medium">
                Hi, Welcome back!
              </p>

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold block text-black" htmlFor="email">
                    Email
                  </label>
                  <input 
                    id="email" 
                    type="email" 
                    className="w-full bg-[#949cff] text-[#115e59] placeholder:text-[#0f766e]/70 border-none rounded-md px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0f766e] font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email id"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold block text-black" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      className="w-full bg-[#949cff] text-[#115e59] placeholder:text-[#0f766e]/70 border-none rounded-md px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-[#0f766e] font-medium"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeIcon size={20} strokeWidth={2.5} /> : <EyeOffIcon size={20} strokeWidth={2.5} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm pt-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="rounded text-[#0f766e] focus:ring-[#0f766e] border-gray-400 w-4 h-4 cursor-pointer" />
                    <span className="font-bold text-black group-hover:text-gray-800">Remember Me</span>
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setView('forgot')}
                    className="text-[#0f766e] font-bold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                {loginMutation.isError && (
                  <div className="text-red-500 text-sm font-semibold text-center bg-red-50 p-2 rounded">
                    {axios.isAxiosError(loginMutation.error) 
                      ? loginMutation.error.response?.data?.message || loginMutation.error.message 
                      : (loginMutation.error as Error)?.message || 'Login failed. Please check your credentials.'}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loginMutation.isPending}
                  className="w-full bg-[#0f766e] hover:bg-[#115e59] disabled:bg-[#0f766e]/70 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-md transition-colors mt-2"
                >
                  {loginMutation.isPending ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <p className="text-center text-sm font-medium mt-8 text-black">
                Belum punya akun?{' '}
                <button type="button" onClick={() => setView('register')} className="text-[#0f766e] font-semibold hover:underline">
                  Daftar Sekarang
                </button>
              </p>
            </>
          )}

          {view === 'register' && (
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
          )}

          {view === 'forgot' && (
            <>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">Forgot Password</h1>
              <p className="text-gray-900 text-lg mb-8 font-medium">
                Enter your email to receive a reset link.
              </p>
              
              <form onSubmit={handleForgotSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold block text-black" htmlFor="emailForgot">
                    Email
                  </label>
                  <input 
                    id="emailForgot" 
                    type="email" 
                    className="w-full bg-[#949cff] text-[#115e59] placeholder:text-[#0f766e]/70 border-none rounded-md px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#0f766e] font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email id"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={forgotMutation.isPending}
                  className="w-full bg-[#0f766e] hover:bg-[#115e59] disabled:bg-[#0f766e]/70 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-md transition-colors mt-2"
                >
                  {forgotMutation.isPending ? 'Sending...' : 'Send Reset Link'}
                </button>
                <div className="text-center mt-4">
                  <button type="button" onClick={() => setView('login')} className="text-[#0f766e] font-bold hover:underline">
                    Back to Login
                  </button>
                </div>
              </form>
            </>
          )}

          {view === 'reset' && (
            <>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">Reset Password</h1>
              <p className="text-gray-900 text-lg mb-8 font-medium">
                Enter your new password below.
              </p>
              
              <form onSubmit={handleResetSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold block text-black" htmlFor="newPassword">
                    New Password
                  </label>
                  <div className="relative">
                    <input 
                      id="newPassword" 
                      type={showPassword ? "text" : "password"} 
                      className="w-full bg-[#949cff] text-[#115e59] placeholder:text-[#0f766e]/70 border-none rounded-md px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-[#0f766e] font-medium"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeIcon size={20} strokeWidth={2.5} /> : <EyeOffIcon size={20} strokeWidth={2.5} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={resetMutation.isPending}
                  className="w-full bg-[#0f766e] hover:bg-[#115e59] disabled:bg-[#0f766e]/70 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-md transition-colors mt-2"
                >
                  {resetMutation.isPending ? 'Resetting...' : 'Reset Password'}
                </button>
                <div className="text-center mt-4">
                  <button type="button" onClick={() => { setView('login'); setResetToken(''); setNewPassword(''); }} className="text-[#0f766e] font-bold hover:underline">
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}

        </div>
      </div>

      <div className="hidden lg:flex w-1/2 items-center justify-center p-12">
        <img 
            src={illustrationImg} 
            alt="Login Illustration" 
            className="w-full max-w-lg object-contain" 
        />
      </div>
    </div>
  )
}
