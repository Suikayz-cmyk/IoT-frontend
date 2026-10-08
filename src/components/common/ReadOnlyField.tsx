import { Input } from "@/components/ui/input"

export const ReadOnlyField = ({ 
  label, 
  value,
  helperText
}: { 
  label: string, 
  value: string | number | undefined | null,
  helperText?: string
}) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <Input type="text" value={value ?? '-'} readOnly />
    {helperText && <p className="text-xs text-gray-400">{helperText}</p>}
  </div>
)

