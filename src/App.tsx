import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import PemesananInaproc from '@/pages/PemesananInaproc'
import PemesananManual from '@/pages/PemesananManual'
import PembelianAlat from '@/pages/PembelianAlat'
import SPJPage from '@/pages/SPJPage'
import MasterData from '@/pages/MasterData'
import SettingsPage from '@/pages/SettingsPage'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pemesanan-inaproc" element={<PemesananInaproc />} />
          <Route path="/pemesanan-manual" element={<PemesananManual />} />
          <Route path="/pembelian-alat" element={<PembelianAlat />} />
          <Route path="/spj" element={<SPJPage />} />
          <Route path="/master-data" element={<MasterData />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}