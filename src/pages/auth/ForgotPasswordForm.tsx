import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { authApi } from '@/api/auth'
import { toast } from "sonner";

interface ForgotPasswordFormProps {
  setView: (view: 'login' | 'forgot' | 'reset' | 'register') => void
  setResetToken: (token: string) => void
}

export default function ForgotPasswordForm({ setView, setResetToken }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('')

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

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      forgotMutation.mutate(email)
    }
  }

  return (
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
  )
}
