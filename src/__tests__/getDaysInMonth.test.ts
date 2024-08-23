import { getDaysInMonth } from '@/utils/getDaysInMonth';
import { MONTHS } from '@/constants/month';

describe('getDaysInMonth', () => {
  it('should return 31 days for January', () => {
    const result = getDaysInMonth(MONTHS[0], 2024);
    expect(result).toBe(31);
  });

  it('should return 28 days for February in a non-leap year', () => {
    const result = getDaysInMonth(MONTHS[1], 2023);
    expect(result).toBe(28);
  });

  it('should return 29 days for February in a leap year', () => {
    const result = getDaysInMonth(MONTHS[1], 2024);
    expect(result).toBe(29);
  });

  it('should return 31 days if month is not provided', () => {
    const result = getDaysInMonth('', 2024);
    expect(result).toBe(31);
  });
});
