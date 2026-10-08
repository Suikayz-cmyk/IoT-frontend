import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { authApi } from '@/api/auth'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { ImagePlus } from 'lucide-react'
import { toast } from "sonner";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account')
  
  const userEmail = localStorage.getItem('userEmail') || 'admin@iot.local'
  const userName = userEmail.split('@')[0]
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1)

  const [fullName, setFullName] = useState(displayName)
  const [email] = useState(userEmail) 

  const [resetStep, setResetStep] = useState<1 | 2>(1)
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const forgotMutation = useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onSuccess: (data) => {
      if (data.reset_token_dev) {
        setResetToken(data.reset_token_dev)
        setResetStep(2)
        toast.success('Link reset/token berhasil didapatkan (Mode Dev). Silakan masukkan password baru Anda.')
      } else {
        toast('Cek email Anda untuk link reset password.')
      }
    },
    onError: (err) => toast.error(axios.isAxiosError(err) ? err.response?.data?.message : err.message)
  })

  const resetMutation = useMutation({
    mutationFn: () => authApi.resetPassword(resetToken, newPassword),
    onSuccess: () => {
      toast.success('Password berhasil diubah!')
      setResetStep(1)
      setNewPassword('')
      setResetToken('')
    },
    onError: (err) => toast.error(axios.isAxiosError(err) ? err.response?.data?.message : err.message)
  })

  const handleForgotPassword = () => {
    forgotMutation.mutate(userEmail)
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 8) {
      toast.error('Password baru harus minimal 8 karakter!')
      return
    }
    resetMutation.mutate()
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    toast('Update Profile ditekan. Fitur ini akan mengupdate nama pengguna.')
  }

  return (
    <DashboardLayout title="Settings">
      <div className="p-6 h-full flex flex-col">

        <div className="flex-1 bg-white rounded-xl shadow-sm border-[3px] border-[#2292f7] flex flex-col overflow-hidden">

          <div className="flex px-6 pt-4 border-b border-gray-200 gap-8 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('account')}
              className={`pb-3 font-medium text-sm transition-colors relative whitespace-nowrap ${
                activeTab === 'account' 
                  ? 'text-primary font-semibold' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Account Setting
              {activeTab === 'account' && <span className="absolute -bottom-px left-0 w-full h-0.75 bg-primary rounded-t-sm"></span>}
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`pb-3 font-medium text-sm transition-colors relative whitespace-nowrap ${
                activeTab === 'security' 
                  ? 'text-primary font-semibold' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Login & Security
              {activeTab === 'security' && <span className="absolute -bottom-px left-0 w-full h-0.75 bg-primary rounded-t-sm"></span>}
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`pb-3 font-medium text-sm transition-colors relative whitespace-nowrap ${
                activeTab === 'users' 
                  ? 'text-primary font-semibold' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              User Management
              {activeTab === 'users' && <span className="absolute -bottom-px left-0 w-full h-0.75 bg-primary rounded-t-sm"></span>}
            </button>
            <button 
              onClick={() => setActiveTab('app')}
              className={`pb-3 font-medium text-sm transition-colors relative whitespace-nowrap ${
                activeTab === 'app' 
                  ? 'text-primary font-semibold' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              App Config
              {activeTab === 'app' && <span className="absolute -bottom-px left-0 w-full h-0.75 bg-primary rounded-t-sm"></span>}
            </button>
            <button 
              onClick={() => setActiveTab('db')}
              className={`pb-3 font-medium text-sm transition-colors relative whitespace-nowrap ${
                activeTab === 'db' 
                  ? 'text-primary font-semibold' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Database
              {activeTab === 'db' && <span className="absolute -bottom-px left-0 w-full h-0.75 bg-primary rounded-t-sm"></span>}
            </button>
          </div>

          <div className="p-8 flex-1 overflow-y-auto">

            {activeTab === 'account' && (
              <form onSubmit={handleUpdateProfile} className="max-w-4xl">

                <div className="mb-8">
                  <label className="block text-sm text-gray-700 font-medium mb-3">Your Profile Picture</label>
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors text-gray-500 relative overflow-hidden group">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`} alt="Avatar" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                      <div className="z-10 flex flex-col items-center">
                        <ImagePlus size={24} className="mb-2" />
                        <span className="text-xs font-medium text-center px-4 leading-tight">Upload your photo</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Full name</label>
                    <input 
                      type="text"
                      className="w-full bg-[#f4f6fa] border-none rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Please enter your full name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input 
                      type="email" disabled
                      className="w-full bg-[#f4f6fa] border-none rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-500"
                      value={email} 
                      placeholder="Please enter your email"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Role</label>
                    <input 
                      type="text" disabled
                      className="w-full bg-[#f4f6fa] border-none rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-500"
                      value={userEmail.toLowerCase().includes('admin') ? 'Administrator' : 'Guest'} 
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button 
                    type="submit"
                    className="bg-[#e45145] hover:bg-[#d6483c] text-white px-8 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Update Profile
                  </button>
                  <button 
                    type="button"
                    className="text-gray-500 hover:text-gray-800 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <div className="max-w-2xl">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Change Password</h3>
                
                {resetStep === 1 ? (
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-4">
                      Request a password reset link or token. The system will process your request and allow you to enter a new password.
                    </p>
                    <button 
                      onClick={handleForgotPassword}
                      disabled={forgotMutation.isPending}
                      className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
                    >
                      {forgotMutation.isPending ? 'Processing...' : 'Request Password Change'}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleResetPassword} className="bg-blue-50/50 rounded-lg p-6 border border-blue-100 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 block">New Password</label>
                      <input 
                        type="password" required
                        className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter at least 8 characters"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button 
                        type="submit" 
                        disabled={resetMutation.isPending}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                      >
                        {resetMutation.isPending ? 'Saving...' : 'Save New Password'}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => { setResetStep(1); setNewPassword(''); setResetToken(''); }}
                        className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">User Management</h2>
                <p className="text-gray-500 mb-6">Manage system administrators and guests.</p>
                <div className="bg-gray-50 rounded-xl p-12 flex items-center justify-center border border-dashed border-gray-300">
                  <p className="text-gray-400 font-medium text-center">Feature in development (Coming Soon)</p>
                </div>
              </div>
            )}

            {activeTab === 'app' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">App Config</h2>
                <p className="text-gray-500 mb-6">Configure system variables and defaults.</p>
                <div className="bg-gray-50 rounded-xl p-12 flex items-center justify-center border border-dashed border-gray-300">
                  <p className="text-gray-400 font-medium text-center">Feature in development (Coming Soon)</p>
                </div>
              </div>
            )}

            {activeTab === 'db' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Database</h2>
                <p className="text-gray-500 mb-6">Backup and restore system data.</p>
                <div className="bg-gray-50 rounded-xl p-12 flex items-center justify-center border border-dashed border-gray-300">
                  <p className="text-gray-400 font-medium text-center">Feature in development (Coming Soon)</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
