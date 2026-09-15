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
  LogOut
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

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen flex bg-[#f4f5f9] font-sans">
      {/* Sidebar */}
      <aside className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 shadow-sm z-10 shrink-0">
        <div className="relative mb-12 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shadow-sm">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aryo" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="absolute top-0 right-0 w-3 h-3 bg-[#1bc48d] border-2 border-white rounded-full"></div>
        </div>

        <nav className="flex flex-col gap-7 flex-1 w-full items-center mt-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                title={item.label}
                className={isActive 
                  ? "bg-[#4871f7] text-white w-14 h-14 rounded-lg flex items-center justify-center shadow-md transition-transform hover:scale-105"
                  : "text-gray-300 hover:text-gray-500 transition-colors"
                }
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </Link>
            )
          })}
        </nav>

        {/* Bottom: Logout and Plus Button */}
        <div className="mt-auto pt-6 flex flex-col gap-4 items-center">
          <button 
            onClick={handleLogout}
            title="Logout"
            className="w-10 h-10 rounded-full bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center shadow-sm transition-transform hover:scale-105"
          >
            <LogOut size={18} strokeWidth={2.5} />
          </button>

          <button className="w-10 h-10 rounded-full bg-[#1bc48d] hover:bg-[#15a878] text-white flex items-center justify-center shadow-sm transition-transform hover:scale-105">
            <Plus size={20} strokeWidth={3} />
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

