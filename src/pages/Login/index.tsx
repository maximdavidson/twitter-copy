import React, { useState, FC, FormEvent } from 'react';
import s from './style.module.css';
import bird from 'assets/twitter-logo.png';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { validateLogin } from '../../validation';
import { auth, signInWithEmailAndPassword } from '../../database';

interface FormData {
  phoneOrEmail: string;
  password: string;
}

interface FormErrors {
  phoneOrEmail?: string;
  password?: string;
}

export const Login: FC = () => {
  const [formData, setFormData] = useState<FormData>({
    phoneOrEmail: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: validateLogin(name, value),
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setErrors({
      ...errors,
      [name]: validateLogin(name, value),
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateLogin(key, formData[key as keyof FormData]);
      if (error) newErrors[key as keyof FormErrors] = error;
    });

    if (Object.keys(newErrors).length === 0) {
      try {
        setIsSubmitting(true);
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.phoneOrEmail,
          formData.password,
        );
        const user = userCredential.user;
        navigate('/hello', { replace: true, state: { name: user.displayName || 'User' } });
      } catch (error) {
        console.error('Error logging in user', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className={s.container}>
      <form className={s.wrapper} onSubmit={handleSubmit}>
        <img src={bird} alt="Twitter Bird" className={s.image} />
        <p className={s.title}>Log in to Twitter</p>
        <input
          type="text"
          name="phoneOrEmail"
          placeholder="Phone number or email address"
          className={s.input}
          value={formData.phoneOrEmail}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.phoneOrEmail && <p className={s.error}>{errors.phoneOrEmail}</p>}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className={s.input}
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.password && <p className={s.error}>{errors.password}</p>}
        <button type="submit" className={s.button} disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </button>
        <Link to="/signup" className={s.link}>
          Sign up to Twitter
        </Link>
      </form>
    </div>
  );
};
