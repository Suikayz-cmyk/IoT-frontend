import apiClient from './client'

export const authApi = {
  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/auth/forgot-password', { Email: email })
    return response.data
  },
  
  resetPassword: async (token: string, newPassword: string) => {
    const response = await apiClient.post('/auth/reset-password', { 
      ResetToken: token,
      New_Password: newPassword
    })
    return response.data
  }
}

