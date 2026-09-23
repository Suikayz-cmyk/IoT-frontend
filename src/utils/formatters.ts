// Format Rupiah (Contoh: Rp 2.440.000)
export const formatRupiah = (amount?: number | null) => {
  if (!amount || isNaN(amount)) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

// Format Tanggal (Contoh: 22/Aug/2026)
export const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date).replace(/ /g, '/')
}

// Format Date for Input Field (YYYY-MM-DD)
export const formatDateForInput = (dateStr?: string) => {
  if (!dateStr) return ''
  return dateStr.split('T')[0]
}

