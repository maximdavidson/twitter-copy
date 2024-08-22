import { FC } from 'react';
import { Controller } from 'react-hook-form';
import { validateSignUp } from '@/validation';
import { MONTHS } from '@/constants/month';
import style from '@/pages/SignUp/style.module.css';

interface DateSelectProps {
  control: any;
  errors: any;
}

export const DateSelect: FC<DateSelectProps> = ({ control, errors }) => (
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
            {Array.from({ length: 31 }, (_, i) => (
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
