import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import SPJPage from '@/pages/SPJPage'
import MasterData from '@/pages/MasterData'
import SettingsPage from '@/pages/SettingsPage'
import ProtectedRoute from '@/components/ProtectedRoute'

import PemesananList from '@/pages/pemesanan/PemesananList'
import PemesananAdd from '@/pages/pemesanan/PemesananAdd'
import PemesananDetail from '@/pages/pemesanan/PemesananDetail'

import SPJAdd from '@/pages/spj/SPJAdd'
import SPJDetail from '@/pages/spj/SPJDetail'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pemesanan" element={<PemesananList />} />
          <Route path="/pemesanan/add" element={<PemesananAdd />} />
          <Route path="/pemesanan/edit/:id" element={<PemesananAdd />} />
          <Route path="/pemesanan/:id" element={<PemesananDetail />} />
          <Route path="/spj" element={<SPJPage />} />
          <Route path="/spj/add" element={<SPJAdd />} />
          <Route path="/spj/:id" element={<SPJDetail />} />
          <Route path="/master-data" element={<MasterData />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
