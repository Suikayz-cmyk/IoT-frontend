export const getStatusStyles = (status: string | undefined | null) => {
  if (!status) return 'bg-slate-100 text-slate-700 border-slate-200';
  const s = status.toLowerCase();
  if (s === 'baru') return 'bg-sky-50 text-sky-700 border border-sky-200';
  if (s === 'pending') return 'bg-amber-50 text-amber-700 border border-amber-200';
  if (s === 'diproses' || s === 'proses') return 'bg-orange-50 text-orange-700 border border-orange-200';
  if (s === 'dikirim') return 'bg-blue-50 text-blue-700 border border-blue-200';
  if (s === 'selesai') return 'bg-emerald-50 text-emerald-800 border border-emerald-200';
  if (s === 'batal') return 'bg-rose-50 text-rose-700 border border-rose-200';
  if (s === 'confirmed') return 'bg-violet-50 text-violet-700 border border-violet-200';
  if (s === 'draft') return 'bg-slate-100 text-slate-700 border border-slate-200';
  return 'bg-slate-100 text-slate-700 border border-slate-200';
};

