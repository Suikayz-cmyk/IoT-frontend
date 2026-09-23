import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard'
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Cell
} from 'recharts'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const [periode, setPeriode] = useState<'day' | 'month' | 'year'>('month')

  const { data: dashboard, isLoading, isError, error } = useQuery({
    queryKey: ['dashboard', periode],
    queryFn: () => dashboardApi.getDashboard(periode),
  })

  // Format data untuk grafik
  const chartData = dashboard?.data?.grafik.map(item => {
    // Format label periode
    let label = item.periode;
    if (periode === 'month' && item.periode.includes('-')) {
      const [year, month] = item.periode.split('-');
      const date = new Date(Number(year), Number(month) - 1);
      label = date.toLocaleString('id-ID', { month: 'short', year: 'numeric' });
    } else if (periode === 'day') {
      const date = new Date(item.periode);
      if (!isNaN(date.getTime())) {
        label = date.toLocaleString('id-ID', { day: '2-digit', month: 'short' });
      }
    }

    return {
      name: label,
      total_pembelian: item.inaproc + item.manual + item.alat,
      total_dibayar: item.inaproc_dibayar + item.manual_dibayar + item.alat_dibayar,
    }
  }) || []

  const totalPembelianSum = dashboard ? 
    dashboard.data.total_pembelian.inaproc + 
    dashboard.data.total_pembelian.manual + 
    dashboard.data.total_pembelian.alat : 0;
    
  const totalDibayarSum = dashboard ? 
    dashboard.data.total_dibayar.inaproc + 
    dashboard.data.total_dibayar.manual + 
    dashboard.data.total_dibayar.alat : 0;

  return (
    <DashboardLayout title="My Dashboard">
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
        </div>
      ) : isError ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-md">
          Gagal memuat data dashboard: {(error as Error).message}
        </div>
      ) : (
        <div className="space-y-8 pb-10">
          
          {/* Top Main Chart - Grafik Pembayaran */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold text-gray-700">Grafik Pembayaran</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>View by:</span>
                <select 
                  value={periode}
                  onChange={(e) => setPeriode(e.target.value as 'day' | 'month' | 'year')}
                  className="bg-transparent border-b border-gray-300 font-medium text-gray-700 focus:outline-none focus:border-blue-500 pb-1"
                >
                  <option value="day">Harian</option>
                  <option value="month">Bulanan</option>
                  <option value="year">Tahunan</option>
                </select>
              </div>
            </div>

            <div className="h-87.5 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ca3af', fontSize: 13 }} 
                      dy={15}
                    />
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar 
                      dataKey="total_dibayar" 
                      name="Total Dibayar" 
                      barSize={12} 
                      fill="#fcd34d" 
                      radius={[6, 6, 6, 6]} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="total_dibayar" 
                      stroke="#3b82f6" 
                      strokeWidth={3} 
                      dot={{ r: 5, fill: '#fff', stroke: '#3b82f6', strokeWidth: 3 }} 
                      activeDot={{ r: 7 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">Tidak ada data untuk periode ini</div>
              )}
            </div>
          </div>

          {/* Bottom Grid Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Dark Chart - Total Pembelian */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Total Pembelian</h2>
                <span className="text-sm font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full">
                  {totalPembelianSum} Total
                </span>
              </div>
              <div className="bg-[#15172b] p-6 rounded-2xl h-87.5 flex items-end relative overflow-hidden group">
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#6b7280', fontSize: 12 }} 
                      dy={10}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 8 }}
                      contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f3f4f6' }}
                      itemStyle={{ color: '#4ade80' }}
                    />
                    <Bar dataKey="total_pembelian" name="Pembelian" barSize={8} radius={[4, 4, 4, 4]}>
                      {
                        chartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill="#4ade80" />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Light Chart - Total Pembayaran */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Total Pembayaran</h2>
                <span className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {totalDibayarSum} Lunas
                </span>
              </div>
              <div className="bg-white p-6 rounded-2xl h-87.5 shadow-sm border border-gray-100 flex items-end relative overflow-hidden group">
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9ca3af', fontSize: 12 }} 
                      dy={10}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(0,0,0,0.04)', radius: 8 }}
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#374151' }}
                      itemStyle={{ color: '#60a5fa' }}
                    />
                    <Bar dataKey="total_dibayar" name="Dibayar" barSize={8} radius={[4, 4, 4, 4]}>
                      {
                        chartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill="#60a5fa" />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </div>
      )}
    </DashboardLayout>
  )
}
