import React, { forwardRef } from 'react'

type CustomDatePickerProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

const CustomDatePicker = forwardRef<HTMLInputElement, CustomDatePickerProps>(
  ({ value, onChange, required, className, ...props }, ref) => {
    return (
      <input 
        type="date" 
        value={value} 
        onChange={onChange}
        required={required}
        ref={ref}
        className={`w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0f766e] transition-all ${className || ''}`}
        {...props}
      />
    )
  }
)

CustomDatePicker.displayName = 'CustomDatePicker'

export default CustomDatePicker

