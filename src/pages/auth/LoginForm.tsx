import React, { useState } from 'react'
import { EyeOffIcon, EyeIcon } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom'

interface LoginFormProps {
  setView: (view: 'login' | 'forgot' | 'reset' | 'register') => void
}

export default function LoginForm({ setView }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/login', {
        email: email,
        password: password
      })
      return response.data
    },
    onSuccess: (data) => {
      const token = data?.data?.token || data?.token;
      if (token) {
        localStorage.setItem('token', token)
        localStorage.setItem('userEmail', email)
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

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      loginMutation.mutate()
    }
  }

  return (
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
  )
}
