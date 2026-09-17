// Format Rupiah (Contoh: Rp 2.440.000)
export const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

// Format Tanggal (Contoh: 15/09/2026)
export const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date).replace(/\./g, '/')
}

// Format Date for Input Field (YYYY-MM-DD)
export const formatDateForInput = (dateStr?: string) => {
  if (!dateStr) return ''
  return dateStr.split('T')[0]
}

