import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button';
import InstansiTab from './master-data/InstansiTab';
import PICTab from './master-data/PICTab';
import EkspedisiTab from './master-data/EkspedisiTab';
import WilayahTab from './master-data/WilayahTab';

type TabType = 'instansi' | 'pic' | 'ekspedisi' | 'wilayah'

export default function MasterData() {
  const [activeTab, setActiveTab] = useState<TabType>('instansi')

  const tabs: { id: TabType, label: string }[] = [
    { id: 'instansi', label: 'Master Instansi' },
    { id: 'pic', label: 'Master PIC' },
    { id: 'ekspedisi', label: 'Master Ekspedisi' },
    { id: 'wilayah', label: 'Master Wilayah' },
  ]

  return (
    <DashboardLayout title="Master Data">
      <div className="space-y-6">
        
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map(tab => (
            <Button variant="outline" key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors relative ${
                activeTab === tab.id ? 'text-primary' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
              )}
            </Button>
          ))}
        </div>

        {activeTab === 'instansi' && <InstansiTab />}
        {activeTab === 'pic' && <PICTab />}
        {activeTab === 'ekspedisi' && <EkspedisiTab />}
        {activeTab === 'wilayah' && <WilayahTab />}
      </div>
    </DashboardLayout>
  )
}
