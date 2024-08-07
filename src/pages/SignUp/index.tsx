import { FC } from 'react';
import { useForm } from 'react-hook-form';
import s from './style.module.css';
import bird from 'assets/twitter-logo.png';
import { useNavigate, Link } from 'react-router-dom';
import { validateSignUp } from '../../validation';
import { auth, createUserWithEmailAndPassword } from '../../database';
import { updateProfile } from 'firebase/auth';
import { InfoText } from './components/InfoText';
import { DateSelect } from './components/DateSelect';

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

  const onSubmit = async (data: FormData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: data.name,
      });
      navigate('/hello', { replace: true, state: { name: user.displayName || 'User' } });
    } catch (error) {
      console.error('Error registering user', error);
    }
  };

  return (
    <div className={s.container}>
      <form className={s.wrapper} onSubmit={handleSubmit(onSubmit)}>
        <div className={s.imageContainer}>
          <img src={bird} alt="Twitter Bird" className={s.image} />
        </div>
        <p className={s.title}>Create an account</p>
        <input
          type="text"
          placeholder="Name"
          className={s.input}
          {...register('name', { validate: (value) => validateSignUp('name', value) })}
        />
        {errors.name && <p className={s.error}>{errors.name.message}</p>}
        <input
          type="email"
          placeholder="Email"
          className={s.input}
          {...register('email', { validate: (value) => validateSignUp('email', value) })}
        />
        {errors.email && <p className={s.error}>{errors.email.message}</p>}
        <input
          type="password"
          placeholder="Password"
          className={s.input}
          {...register('password', { validate: (value) => validateSignUp('password', value) })}
        />
        {errors.password && <p className={s.error}>{errors.password.message}</p>}
        <Link to="/" className={s.link}>
          Use email
        </Link>
        <p className={s.subtitle}>Date of birth</p>
        <InfoText />
        <DateSelect control={control} errors={errors} />
        <button type="submit" className={s.button}>
          Next
        </button>
      </form>
    </div>
  );
};
