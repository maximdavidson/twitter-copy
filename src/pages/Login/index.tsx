import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import s from './style.module.css';
import bird from '@assets/twitter-logo.png';
import { useNavigate, Link } from 'react-router-dom';
import { validateLogin } from '@/validation';
import { auth, signInWithEmailAndPassword } from '@/database';
import { Loader } from '@/components/Loader';

interface FormData {
  phoneOrEmail: string;
  password: string;
}

export const Login: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
    reValidateMode: 'onBlur',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePhoneOrEmail = (value: string) => validateLogin('phoneOrEmail', value);
  const validatePassword = (value: string) => validateLogin('password', value);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.phoneOrEmail, data.password);
      const user = userCredential.user;
      console.log('Logged in user:', user);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/profile', { replace: true, state: { name: user.displayName || 'User' } });
    } catch (error) {
      console.error('Error logging in user', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.container}>
      {loading && <Loader />}
      <form className={s.wrapper} onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <img src={bird} alt="Twitter Bird" className={s.image} />
        <p className={s.title}>Log in to Twitter</p>
        <input
          type="text"
          placeholder="Email address"
          className={s.input}
          {...register('phoneOrEmail', { validate: validatePhoneOrEmail })}
          autoComplete="off"
        />
        {errors.phoneOrEmail && <p className={s.error}>{errors.phoneOrEmail.message}</p>}
        <input
          type="password"
          placeholder="Password"
          className={s.input}
          {...register('password', { validate: validatePassword })}
          autoComplete="current-password"
        />
        {errors.password && <p className={s.error}>{errors.password.message}</p>}
        <button type="submit" className={s.button} disabled={loading}>
          Log In
        </button>
        <Link to="/signup" className={s.link}>
          Sign up to Twitter
        </Link>
      </form>
    </div>
  );
};
