import { FC, useState, useEffect } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { validateSignUp } from '@/validation';
import { MONTHS } from '@/constants/month';
import { getDaysInMonth } from '@/utils/getDaysInMonth';
import style from '@/pages/SignUp/style.module.css';

interface DateSelectProps {
  control: any;
  errors: any;
}

export const DateSelect: FC<DateSelectProps> = ({ control, errors }) => {
  const [daysInMonth, setDaysInMonth] = useState(31);

  const selectedMonth = useWatch({
    control,
    name: 'month',
  });

  const selectedYear = useWatch({
    control,
    name: 'year',
  });

  useEffect(() => {
    const year = selectedYear || new Date().getFullYear();
    const days = getDaysInMonth(selectedMonth, year);
    setDaysInMonth(days);
  }, [selectedMonth, selectedYear]);

  return (
    <div className={style.dateWrapper}>
      <div className={style.selectContainer}>
        <Controller
          name="month"
          control={control}
          render={({ field }) => (
            <select className={style.select} {...field}>
              <option value="">Select Month</option>
              {MONTHS.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          )}
          rules={{ validate: (value) => validateSignUp('month', value) }}
        />
        {errors.month && <p className={style.error}>{errors.month.message}</p>}
      </div>
      <div className={style.selectContainer}>
        <Controller
          name="day"
          control={control}
          render={({ field }) => (
            <select className={style.select} {...field}>
              <option value="">Day</option>
              {Array.from({ length: daysInMonth }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          )}
          rules={{ validate: (value) => validateSignUp('day', value) }}
        />
        {errors.day && <p className={style.error}>{errors.day.message}</p>}
      </div>
      <div className={style.selectContainer}>
        <Controller
          name="year"
          control={control}
          render={({ field }) => (
            <select className={style.select} {...field}>
              <option value="">Year</option>
              {Array.from({ length: 100 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          )}
          rules={{ validate: (value) => validateSignUp('year', value) }}
        />
        {errors.year && <p className={style.error}>{errors.year.message}</p>}
      </div>
    </div>
  );
};
