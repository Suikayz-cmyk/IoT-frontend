import { ReactNode } from 'react';

interface FormCardProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

export default function FormCard({ title, children, icon }: FormCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-[#eef5f5] px-6 py-3 border-b border-gray-200 flex items-center gap-2 text-teal-800 font-semibold">
        {icon ? icon : (
          <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">i</span>
        )}
        {title}
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {children}
      </div>
    </div>
  );
}
