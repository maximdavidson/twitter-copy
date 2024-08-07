import { FC } from 'react';
import { Controller } from 'react-hook-form';
import s from '../../../../pages/SignUp/style.module.css';
import { validateSignUp } from '../../../../validation';

interface DateSelectProps {
  control: any;
  errors: any;
}

export const DateSelect: FC<DateSelectProps> = ({ control, errors }) => (
  <div className={s.dateWrapper}>
    <div className={s.selectContainer}>
      <Controller
        name="month"
        control={control}
        render={({ field }) => (
          <select className={s.select} {...field}>
            <option value="">Select Month</option>
            {[
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ].map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        )}
        rules={{ validate: (value) => validateSignUp('month', value) }}
      />
      {errors.month && <p className={s.error}>{errors.month.message}</p>}
    </div>
    <div className={s.selectContainer}>
      <Controller
        name="day"
        control={control}
        render={({ field }) => (
          <select className={s.select} {...field}>
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
      {errors.day && <p className={s.error}>{errors.day.message}</p>}
    </div>
    <div className={s.selectContainer}>
      <Controller
        name="year"
        control={control}
        render={({ field }) => (
          <select className={s.select} {...field}>
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
      {errors.year && <p className={s.error}>{errors.year.message}</p>}
    </div>
  </div>
);
