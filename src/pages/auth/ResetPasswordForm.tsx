import React, { useState } from 'react'
import { EyeOffIcon, EyeIcon } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { authApi } from '@/api/auth'
import { toast } from "sonner";

interface ResetPasswordFormProps {
  setView: (view: 'login' | 'forgot' | 'reset' | 'register') => void
  resetToken: string
  setResetToken: (token: string) => void
}

export default function ResetPasswordForm({ setView, resetToken, setResetToken }: ResetPasswordFormProps) {
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

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

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 8) {
      toast.error('Password baru harus minimal 8 karakter!')
      return
    }
    resetMutation.mutate()
  }

  return (
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
              className="w-full bg-[#949cff] text-primary-hover placeholder:text-primary/70 border-none rounded-md px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-primary font-medium"
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
          className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary/70 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-md transition-colors mt-2"
        >
          {resetMutation.isPending ? 'Resetting...' : 'Reset Password'}
        </button>
        <div className="text-center mt-4">
          <button type="button" onClick={() => { setView('login'); setResetToken(''); setNewPassword(''); }} className="text-primary font-bold hover:underline">
            Cancel
          </button>
        </div>
      </form>
    </>
  )
}
