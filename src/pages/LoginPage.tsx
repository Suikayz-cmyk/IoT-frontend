import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import illustrationImg from '@/assets/login-illustration.png'

import LoginForm from './auth/LoginForm'
import RegisterForm from './auth/RegisterForm'
import ForgotPasswordForm from './auth/ForgotPasswordForm'
import ResetPasswordForm from './auth/ResetPasswordForm'

type ViewMode = 'login' | 'forgot' | 'reset' | 'register'

export default function LoginPage() {
  const [view, setView] = useState<ViewMode>('login')
  const navigate = useNavigate()

  // States untuk Reset Password Flow
  const [resetToken, setResetToken] = useState('')

  useEffect(() => {
    // Jika user sudah login (punya token), lempar langsung ke dashboard
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex bg-white text-black font-sans relative zoom-[0.75]">
      
      <header className="absolute top-0 left-0 right-0 flex justify-between items-center px-8 lg:px-16 py-8 z-10 w-full">
        <div className="text-3xl lg:text-4xl text-primary font-bold">IOT Logger</div>
      </header>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-24 pt-40 pb-12 mt-8 lg:mt-0 relative z-0">
        <div className="max-w-md w-full mx-auto">
          
          {view === 'login' && <LoginForm setView={setView} />}
          {view === 'register' && <RegisterForm setView={setView} />}
          {view === 'forgot' && <ForgotPasswordForm setView={setView} setResetToken={setResetToken} />}
          {view === 'reset' && <ResetPasswordForm setView={setView} resetToken={resetToken} setResetToken={setResetToken} />}

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
