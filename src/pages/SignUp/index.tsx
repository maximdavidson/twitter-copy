import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import { auth, createUserWithEmailAndPassword } from '@/database';
import { validateSignUp } from '@/validation';
import { createUserProfile } from '@/utils/createUserProfile';
import { InfoText } from './components/InfoText';
import { DateSelect } from './components/DateSelect';
import { Loader } from '@/components/Loader';
import bird from '@assets/twitter-logo.png';
import { ROUTES } from '@/constants/routes';
import { FormData } from './types';
import style from './style.module.css';

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
      await updateProfile(user, { displayName: data.name });
      await createUserProfile(user);
      localStorage.setItem('user', JSON.stringify(user));
      navigate(ROUTES.LOGIN, { replace: true, state: { name: user.displayName || 'User' } });
    } catch (error) {
      console.error('Error registering user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.container}>
      {loading && <Loader />}
      <form className={style.wrapper} onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className={style.imageContainer}>
          <img src={bird} alt="Twitter Bird" className={style.image} />
        </div>
        <p className={style.title}>Create an account</p>
        <input
          type="text"
          placeholder="Name"
          className={style.input}
          {...register('name', { validate: validateName })}
          autoComplete="off"
        />
        {errors.name && <p className={style.error}>{errors.name.message}</p>}
        <input
          type="email"
          placeholder="Email"
          className={style.input}
          {...register('email', { validate: validateEmail })}
          autoComplete="off"
        />
        {errors.email && <p className={style.error}>{errors.email.message}</p>}
        <input
          type="password"
          placeholder="Password"
          className={style.input}
          {...register('password', { validate: validatePassword })}
          autoComplete="new-password"
        />
        {errors.password && <p className={style.error}>{errors.password.message}</p>}
        <Link to="/" className={style.link}>
          Use email
        </Link>
        <p className={style.subtitle}>Date of birth</p>
        <InfoText />
        <DateSelect control={control} errors={errors} />
        <button type="submit" className={style.button} disabled={loading}>
          Next
        </button>
      </form>
    </div>
  );
};
