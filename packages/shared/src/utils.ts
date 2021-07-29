
export const formatCurrency = (lang: string, currency: string, amount: number, { shortFraction = false }) => {
  return new Intl.NumberFormat(
    lang, {
      style: 'currency',
      currency,
      minimumFractionDigits: shortFraction && amount % 1 == 0 ? 0 : 2
    }).format(amount);
}