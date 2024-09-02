import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Loader } from '@/components/Loader';
import { validateLogin } from '@/validation';
import { auth, signInWithEmailAndPassword } from '@/database';
import bird from '@assets/twitter-logo.png';
import { ROUTES } from '@/constants/routes';
import style from './style.module.css';

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const validatePhoneOrEmail = (value: string) => validateLogin('phoneOrEmail', value);
  const validatePassword = (value: string) => validateLogin('password', value);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.phoneOrEmail, data.password);
      const user = userCredential.user;
      localStorage.setItem('user', JSON.stringify(user));
      navigate(ROUTES.PROFILE, { replace: true, state: { name: user.displayName || 'User' } });
    } catch (error) {
      console.error('Error logging in user', error);
      setErrorMessage('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.container}>
      {loading && <Loader />}
      <form className={style.wrapper} onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <img src={bird} alt="Twitter Bird" className={style.image} />
        <p className={style.title}>Log in to Twitter</p>
        <input
          type="text"
          placeholder="Email address"
          className={style.input}
          {...register('phoneOrEmail', { validate: validatePhoneOrEmail })}
          autoComplete="off"
        />
        {errors.phoneOrEmail && <p className={style.error}>{errors.phoneOrEmail.message}</p>}
        <input
          type="password"
          placeholder="Password"
          className={style.input}
          {...register('password', { validate: validatePassword })}
          autoComplete="current-password"
        />
        {errors.password && <p className={style.error}>{errors.password.message}</p>}
        {errorMessage && <p className={style.error}>{errorMessage}</p>}
        <button type="submit" className={style.button} disabled={loading}>
          Log In
        </button>
        <Link to="/signup" className={style.link}>
          Sign up to Twitter
        </Link>
      </form>
    </div>
  );
};
