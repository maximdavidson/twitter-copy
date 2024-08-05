import React, { useState, FC } from 'react';
import s from './style.module.css';
import bird from 'assets/twitter-logo.png';
import { validateSignUp } from '../../validation'; // Импорт функции валидации

interface FormData {
  name: string;
  phone: string;
  email: string;
  month: string;
  day: string;
  year: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  month?: string;
  day?: string;
  year?: string;
}

export const SignUp: FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    month: '',
    day: '',
    year: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: validateSignUp(name, value),
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setErrors({
      ...errors,
      [name]: validateSignUp(name, value),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateSignUp(key, formData[key as keyof FormData]);
      if (error) newErrors[key as keyof FormErrors] = error;
    });

    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted successfully', formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className={s.container}>
      <form className={s.wrapper} onSubmit={handleSubmit}>
        <div className={s.imageContainer}>
          <img src={bird} alt="Twitter Bird" className={s.image} />
        </div>
        <p className={s.title}>Create an account</p>
        <input
          type="text"
          placeholder="Name"
          className={s.input}
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.name && <p className={s.error}>{errors.name}</p>}
        <input
          type="text"
          placeholder="Phone"
          className={s.input}
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.phone && <p className={s.error}>{errors.phone}</p>}
        <input
          type="email"
          placeholder="Email"
          className={s.input}
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.email && <p className={s.error}>{errors.email}</p>}
        <p className={s.subtitle}>Date of birth</p>
        <p className={s.text}>
          Facilisi sem pulvinar velit nunc, gravida scelerisque amet nibh sit. Quis bibendum ante phasellus
          metus, magna lacinia sed augue. Odio enim nascetur leo mauris vel eget. Pretium id ullamcorper
          blandit viverra dignissim eget tellus. Nibh mi massa in molestie a sit. Elit congue.
        </p>
        <div className={s.dateWrapper}>
          <div className={s.selectContainer}>
            <select
              className={s.select}
              name="month"
              value={formData.month}
              onChange={handleChange}
              onBlur={handleBlur}
            >
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
            {errors.month && <p className={s.error}>{errors.month}</p>}
          </div>
          <div className={s.selectContainer}>
            <select
              className={s.select}
              name="day"
              value={formData.day}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            {errors.day && <p className={s.error}>{errors.day}</p>}
          </div>
          <div className={s.selectContainer}>
            <select
              className={s.select}
              name="year"
              value={formData.year}
              onChange={handleChange}
              onBlur={handleBlur}
            >
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
            {errors.year && <p className={s.error}>{errors.year}</p>}
          </div>
        </div>
        <button type="submit" className={s.button}>
          Next
        </button>
      </form>
    </div>
  );
};
