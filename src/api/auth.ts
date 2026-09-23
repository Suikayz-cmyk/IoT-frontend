import axios from 'axios'

export const authApi = {
  forgotPassword: async (email: string) => {
    const response = await axios.post('/auth/forgot-password', { Email: email })
    return response.data
  },
  
  resetPassword: async (token: string, newPassword: string) => {
    const response = await axios.post('/auth/reset-password', { 
      ResetToken: token,
      New_Password: newPassword
    })
    return response.data
  }
}

