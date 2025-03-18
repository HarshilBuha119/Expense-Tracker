export function getFormattedDate(date) {
  if (!date) return '';
  
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  if (date instanceof Date && !isNaN(date)) {
    return date.toISOString().slice(0, 10);
  }
  
  return '';
}
export function getDateMinusDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
}
