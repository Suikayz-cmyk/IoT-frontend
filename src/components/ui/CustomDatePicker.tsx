import React from 'react'
import { formatDate } from '@/utils/formatters'
import { Calendar } from 'lucide-react'

interface CustomDatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'> {
  value: string;
}

export default function CustomDatePicker({ value, onChange, required, className, ...props }: CustomDatePickerProps) {
  return (
    <div className={`relative ${className || ''}`}>
      <input 
        type="date" 
        value={value} 
        onChange={onChange}
        required={required}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        {...props}
      />
      <div className={`w-full bg-white border border-gray-300 rounded-md px-3 py-2 flex items-center justify-between focus-within:ring-2 focus-within:ring-[#0f766e] focus-within:border-transparent transition-all ${!value ? 'text-gray-400' : 'text-gray-900'}`}>
        <span>{value ? formatDate(value) : 'Pilih Tanggal'}</span>
        <Calendar size={16} className="text-gray-400" />
      </div>
    </div>
  )
}

