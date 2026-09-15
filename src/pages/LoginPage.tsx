import { useState, useEffect } from 'react'
import { EyeOffIcon, EyeIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import illustrationImg from '@/assets/login-illustration.png'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

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
      const response = await axios.post('/auth/login', {
        Email: email,
        Password: password
      })
      return response.data
    },
    onSuccess: (data) => {
      // Asumsi API mengembalikan field token di dalam data.data.token
      const token = data?.data?.token || data?.token;
      if (token) {
        localStorage.setItem('token', token)
      }
      navigate('/dashboard')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      loginMutation.mutate()
    }
  }

  return (
    <div className="min-h-screen flex bg-white text-black font-sans relative zoom-[0.75]">
      {/* Navbar / Header */}
      <header className="absolute top-0 left-0 right-0 flex justify-between items-center px-8 lg:px-16 py-8 z-10 w-full">
        <div className="text-3xl lg:text-4xl text-[#5145cd]">IOT Logger</div>
        <button className="bg-[#5145cd] text-white px-8 py-2.5 rounded-md font-semibold hover:bg-[#3b339b] transition-colors shadow-sm">
          Sign Up
        </button>
      </header>

      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-24 pt-32 pb-12 z-0">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">Login now</h1>
          <p className="text-gray-900 text-lg mb-8 font-medium">
            Hi, Welcome back!
          </p>

          {/* Login with Google */}
          <button 
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-[#949cff] hover:bg-[#858dee] text-white font-semibold py-3.5 rounded-md transition-colors"
          >
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" className="w-4 h-4">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            Login with Google
          </button>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-400 font-medium">or Login with Email</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold block text-black" htmlFor="email">
                Email
              </label>
              <input 
                id="email" 
                type="email" 
                className="w-full bg-[#949cff] text-[#3b339b] placeholder:text-[#5145cd]/70 border-none rounded-md px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#5145cd] font-medium"
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
                  className="w-full bg-[#949cff] text-[#3b339b] placeholder:text-[#5145cd]/70 border-none rounded-md px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-[#5145cd] font-medium"
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
                <input type="checkbox" className="rounded text-[#5145cd] focus:ring-[#5145cd] border-gray-400 w-4 h-4 cursor-pointer" />
                <span className="font-bold text-black group-hover:text-gray-800">Remember Me</span>
              </label>
              <a href="#" className="text-[#5145cd] font-bold hover:underline">
                Forgot Password?
              </a>
            </div>

            {loginMutation.isError && (
              <div className="text-red-500 text-sm font-semibold text-center bg-red-50 p-2 rounded">
                {axios.isAxiosError(loginMutation.error) 
                  ? loginMutation.error.response?.data?.message || loginMutation.error.message 
                  : loginMutation.error?.message || 'Login failed. Please check your credentials.'}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loginMutation.isPending}
              className="w-full bg-[#5145cd] hover:bg-[#3b339b] disabled:bg-[#5145cd]/70 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-md transition-colors mt-2"
            >
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm font-medium mt-8 text-black">
            Not registered yet?{' '}
            <a href="#" className="text-[#5145cd] font-semibold hover:underline">
              Create an account <span className="text-[#ff9bb6]">SignUp</span>
            </a>
          </p>
        </div>
      </div>

      {/* Right Column - Illustration Placeholder */}
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