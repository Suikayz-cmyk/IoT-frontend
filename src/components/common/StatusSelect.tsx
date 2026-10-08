import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getStatusStyles } from '@/utils/statusStyles'

export const StatusSelect = ({ 
  currentStatus, 
  onStatusChange, 
  options, 
  title = 'Status'
}: { 
  currentStatus: string, 
  onStatusChange: (v: string) => void, 
  options: React.ReactNode, 
  title?: string 
}) => {
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPendingStatus(e.target.value);
    setIsOpen(true);
  };

  const confirmChange = () => {
    if (pendingStatus) onStatusChange(pendingStatus);
    setIsOpen(false);
  };

  const cancelChange = () => {
    setPendingStatus(null);
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative inline-flex items-center">
        <select 
          value={currentStatus} 
          onChange={handleSelect}
          className={`cursor-pointer appearance-none focus:outline-none capitalize pl-2.5 pr-7 py-1 text-xs font-semibold rounded-full transition-colors ${getStatusStyles(currentStatus)}`}
        >
          {options}
        </select>
        <ChevronDown className="absolute right-2 w-3.5 h-3.5 pointer-events-none opacity-60" />
      </div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Ubah {title}</AlertDialogTitle>
            <AlertDialogDescription>Yakin ingin mengubah status menjadi '{pendingStatus}'?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelChange}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmChange}>Ya, Ubah</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

