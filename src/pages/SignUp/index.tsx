import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import s from './style.module.css';
import bird from '@assets/twitter-logo.png';
import { useNavigate, Link } from 'react-router-dom';
import { validateSignUp } from '../../validation';
import { auth, createUserWithEmailAndPassword } from '../../database';
import { updateProfile } from 'firebase/auth';
import { InfoText } from './components/InfoText';
import { DateSelect } from './components/DateSelect';
import { Loader } from '../../components/Loader';

interface FormData {
  name: string;
  email: string;
  password: string;
  month: string;
  day: string;
  year: string;
}

export const SignUp: FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
    reValidateMode: 'onBlur',
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const validateName = (value: string) => validateSignUp('name', value);
  const validateEmail = (value: string) => validateSignUp('email', value);
  const validatePassword = (value: string) => validateSignUp('password', value);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      console.log('Registered user:', user);
      await updateProfile(user, {
        displayName: data.name,
      });
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/login', { replace: true, state: { name: user.displayName || 'User' } });
    } catch (error) {
      console.error('Error registering user', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.container}>
      {loading && <Loader />}
      <form className={s.wrapper} onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className={s.imageContainer}>
          <img src={bird} alt="Twitter Bird" className={s.image} />
        </div>
        <p className={s.title}>Create an account</p>
        <input
          type="text"
          placeholder="Name"
          className={s.input}
          {...register('name', { validate: validateName })}
          autoComplete="off"
        />
        {errors.name && <p className={s.error}>{errors.name.message}</p>}
        <input
          type="email"
          placeholder="Email"
          className={s.input}
          {...register('email', { validate: validateEmail })}
          autoComplete="off"
        />
        {errors.email && <p className={s.error}>{errors.email.message}</p>}
        <input
          type="password"
          placeholder="Password"
          className={s.input}
          {...register('password', { validate: validatePassword })}
          autoComplete="new-password"
        />
        {errors.password && <p className={s.error}>{errors.password.message}</p>}
        <Link to="/" className={s.link}>
          Use email
        </Link>
        <p className={s.subtitle}>Date of birth</p>
        <InfoText />
        <DateSelect control={control} errors={errors} />
        <button type="submit" className={s.button} disabled={loading}>
          Next
        </button>
      </form>
    </div>
  );
};
