import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FormCardProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

export default function FormCard({ title, children, icon }: FormCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-[#eef5f5] px-6 py-3 border-b flex flex-row items-center gap-2 space-y-0 text-teal-800 font-semibold">
        {icon ? icon : (
          <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs">i</span>
        )}
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {children}
      </CardContent>
    </Card>
  );
}
