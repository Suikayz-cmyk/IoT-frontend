import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  BarChart2, 
  ShoppingBag, 
  FileText, 
  Database, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react'

interface DashboardLayoutProps {
  children?: ReactNode;
  title: string;
  onExport?: () => void;
  isExporting?: boolean;
}

const navItems = [
  { path: '/dashboard', icon: BarChart2, label: 'Dashboard' },
  { path: '/pemesanan', icon: ShoppingBag, label: 'Data Pemesanan' },
  { path: '/spj', icon: FileText, label: 'SPJ' },
  { path: '/master-data', icon: Database, label: 'Master Data' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export default function DashboardLayout({ 
  children, 
  title,
  onExport,
  isExporting
}: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('sidebarOpen');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', JSON.stringify(newState));
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userRole')
    navigate('/login', { replace: true })
  }

  const userEmail = localStorage.getItem('userEmail') || 'guest@iot.local'
  const userName = userEmail.split('@')[0]
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1)
  const roleName = userEmail.toLowerCase().includes('admin') ? 'Administrator' : 'Guest'

  return (
    <div className="h-screen w-full overflow-hidden flex bg-[#f8f9fa] font-sans">
      
      <aside 
        className={`relative bg-white border-r border-gray-200 flex flex-col py-4 shadow-sm z-10 shrink-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-60 px-4' : 'w-16 items-center'
        }`}
      >
        
        <button 
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 bg-white border border-gray-200 text-gray-500 rounded-full p-1 shadow-sm hover:text-gray-800 hover:bg-gray-50 z-20 transition-transform"
        >
          {isSidebarOpen ? <ChevronLeft size={14} strokeWidth={3} /> : <ChevronRight size={14} strokeWidth={3} />}
        </button>

        <div className={`flex items-center gap-3 mb-6 cursor-pointer ${isSidebarOpen ? 'px-1' : ''}`}>
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden shadow-sm">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#1bc48d] border-2 border-white rounded-full"></div>
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col overflow-hidden whitespace-nowrap ">
              <span className="text-sm font-bold text-gray-800 truncate">{displayName}</span>
              <span className="text-xs font-medium text-gray-400 truncate">{roleName}</span>
            </div>
          )}
        </div>

        <nav className={`flex flex-col flex-1 w-full ${isSidebarOpen ? 'gap-1' : 'gap-3 items-center'}`}>
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path) && item.path !== '/' || location.pathname === item.path;
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
                    ? "bg-teal-700 text-white shadow-md transition-transform hover:scale-105"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                {isSidebarOpen && (
                  <span className={`text-sm font-semibold whitespace-nowrap  ${isActive ? 'text-white' : 'text-gray-600'}`}>
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className={`mt-auto pt-4 flex flex-col gap-3 ${isSidebarOpen ? 'w-full' : 'items-center'}`}>
          <button 
            onClick={handleLogout}
            title={!isSidebarOpen ? "Logout" : undefined}
            className={`flex items-center gap-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 shadow-sm transition-transform hover:scale-105 ${
              isSidebarOpen ? 'px-3 py-2.5 w-full justify-center' : 'w-9 h-9 justify-center rounded-full'
            }`}
          >
            <LogOut size={16} strokeWidth={2.5} className="shrink-0" />
            {isSidebarOpen && <span className="text-sm font-semibold whitespace-nowrap ">Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 px-6 pb-6 pt-0 lg:px-8 lg:pb-8 relative overflow-y-auto">
        {(title || onExport) && (
          <div className="flex justify-between items-start w-full mb-8 pt-6">
            <h1 className="text-3xl font-normal text-[#0f766e]">{title}</h1>

            {onExport && (
              <button 
                onClick={onExport}
                disabled={isExporting}
                className="bg-[#1bc48d] hover:bg-[#15a878] text-white px-5 py-2.5 rounded-sm font-medium flex items-center gap-2 transition-colors shadow-sm text-sm disabled:opacity-70"
              >
                <Download size={16} strokeWidth={2.5} />
                {isExporting ? 'Mengekspor...' : 'Export Excel'}
              </button>
            )}
          </div>
        )}
        
        <div>
          {children}
        </div>
      </main>
    </div>
  )
}
