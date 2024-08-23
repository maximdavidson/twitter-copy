import { MONTHS } from '@/constants/month';

export const getDaysInMonth = (month: string, year: number) => {
  if (!month) return 31;
  const monthIndex = MONTHS.indexOf(month);
  return new Date(year, monthIndex + 1, 0).getDate();
};
