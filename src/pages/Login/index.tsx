import { FC } from 'react';
import { useForm } from 'react-hook-form';
import s from './style.module.css';
import bird from 'assets/twitter-logo.png';
import { useNavigate, Link } from 'react-router-dom';
import { validateLogin } from '../../validation';
import { auth, signInWithEmailAndPassword } from '../../database';

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

  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.phoneOrEmail, data.password);
      const user = userCredential.user;
      navigate('/hello', { replace: true, state: { name: user.displayName || 'User' } });
    } catch (error) {
      console.error('Error logging in user', error);
    }
  };

  return (
    <div className={s.container}>
      <form className={s.wrapper} onSubmit={handleSubmit(onSubmit)}>
        <img src={bird} alt="Twitter Bird" className={s.image} />
        <p className={s.title}>Log in to Twitter</p>
        <input
          type="text"
          placeholder="Email address"
          className={s.input}
          {...register('phoneOrEmail', { validate: (value) => validateLogin('phoneOrEmail', value) })}
        />
        {errors.phoneOrEmail && <p className={s.error}>{errors.phoneOrEmail.message}</p>}
        <input
          type="password"
          placeholder="Password"
          className={s.input}
          {...register('password', { validate: (value) => validateLogin('password', value) })}
        />
        {errors.password && <p className={s.error}>{errors.password.message}</p>}
        <button type="submit" className={s.button}>
          Log In
        </button>
        <Link to="/signup" className={s.link}>
          Sign up to Twitter
        </Link>
      </form>
    </div>
  );
};
