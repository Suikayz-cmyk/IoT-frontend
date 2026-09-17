import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  BarChart2, 
  ShoppingBag, 
  FileCheck2, 
  ShoppingCart, 
  FileText, 
  Database, 
  Settings, 
  Plus,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface DashboardLayoutProps {
  children?: ReactNode;
  title: string;
}

const navItems = [
  { path: '/dashboard', icon: BarChart2, label: 'Dashboard' },
  { path: '/pemesanan-inaproc', icon: ShoppingBag, label: 'Pemesanan Inaproc' },
  { path: '/pemesanan-manual', icon: FileCheck2, label: 'Pemesanan Manual' },
  { path: '/pembelian-alat', icon: ShoppingCart, label: 'Pembelian Alat' },
  { path: '/spj', icon: FileText, label: 'SPJ' },
  { path: '/master-data', icon: Database, label: 'Master Data' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return localStorage.getItem('sidebarOpen') === 'true'
  });

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', String(newState));
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login', { replace: true })
  }

  return (
    <div className="h-screen w-full overflow-hidden flex bg-[#f4f5f9] font-sans">
      {/* Sidebar */}
      <aside 
        className={`relative bg-white border-r border-gray-200 flex flex-col py-4 shadow-sm z-10 shrink-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-60 px-4' : 'w-16 items-center'
        }`}
      >
        {/* Toggle Button */}
        <button 
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 bg-white border border-gray-200 text-gray-500 rounded-full p-1 shadow-sm hover:text-gray-800 hover:bg-gray-50 z-20 transition-transform"
        >
          {isSidebarOpen ? <ChevronLeft size={14} strokeWidth={3} /> : <ChevronRight size={14} strokeWidth={3} />}
        </button>

        {/* Top: Avatar */}
        <div className={`flex items-center gap-3 mb-6 cursor-pointer ${isSidebarOpen ? 'px-1' : ''}`}>
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden shadow-sm">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aryo" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#1bc48d] border-2 border-white rounded-full"></div>
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col overflow-hidden whitespace-nowrap ">
              <span className="text-[13px] font-bold text-gray-800 truncate">Aryo</span>
              <span className="text-[11px] font-medium text-gray-400 truncate">Administrator</span>
            </div>
          )}
        </div>

        {/* Middle: Navigation Icons */}
        <nav className={`flex flex-col flex-1 w-full ${isSidebarOpen ? 'gap-1' : 'gap-3 items-center'}`}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                title={!isSidebarOpen ? item.label : undefined}
                className={`flex items-center gap-3 transition-colors ${
                  isSidebarOpen 
                    ? 'px-3 py-2.5 rounded-lg w-full' 
                    : 'justify-center w-10 h-10 rounded-lg'
                } ${
                  isActive 
                    ? "bg-[#4871f7] text-white shadow-md transition-transform hover:scale-105"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                {isSidebarOpen && (
                  <span className={`text-[13px] font-semibold whitespace-nowrap  ${isActive ? 'text-white' : 'text-gray-600'}`}>
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom: Logout and Plus Button */}
        <div className={`mt-auto pt-4 flex flex-col gap-3 ${isSidebarOpen ? 'w-full' : 'items-center'}`}>
          <button 
            onClick={handleLogout}
            title={!isSidebarOpen ? "Logout" : undefined}
            className={`flex items-center gap-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 shadow-sm transition-transform hover:scale-105 ${
              isSidebarOpen ? 'px-3 py-2.5 w-full justify-center' : 'w-9 h-9 justify-center rounded-full'
            }`}
          >
            <LogOut size={16} strokeWidth={2.5} className="shrink-0" />
            {isSidebarOpen && <span className="text-[13px] font-semibold whitespace-nowrap ">Logout</span>}
          </button>

          <button className={`flex items-center gap-2 bg-[#1bc48d] hover:bg-[#15a878] text-white shadow-sm transition-transform hover:scale-105 ${
            isSidebarOpen ? 'px-3 py-2.5 rounded-lg w-full justify-center' : 'w-9 h-9 justify-center rounded-full'
          }`}>
            <Plus size={18} strokeWidth={3} className="shrink-0" />
            {isSidebarOpen && <span className="text-[13px] font-semibold whitespace-nowrap ">import Data</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 relative overflow-y-auto">
        <div className="flex justify-between items-start w-full">
          <h1 className="text-[28px] font-normal text-[#5145cd]">{title}</h1>
          <button className="bg-[#1bc48d] hover:bg-[#15a878] text-white px-5 py-2.5 rounded-sm font-medium flex items-center gap-2 transition-colors shadow-sm text-sm">
            <Plus size={16} strokeWidth={2.5} />
            Export Excel
          </button>
        </div>
        
        <div className="mt-8">
          {children}
        </div>
      </main>
    </div>
  )
}