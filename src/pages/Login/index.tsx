import s from './style.module.css';
import bird from 'assets/twitter-logo.png';
import { Link } from 'react-router-dom';

export const Login = () => {
  return (
    <div className={s.container}>
      <div className={s.wrapper}>
        <img src={bird} alt="Twitter Bird" className={s.image} />
        <p className={s.title}>Log in to Twitter</p>
        <input type="text" placeholder="Phone number, email address" className={s.input} />
        <input type="password" placeholder="Password" className={s.input} />
        <button className={s.button}>Log In</button>
        <Link to="/signup" className={s.link}>
          Sign up to Twitter
        </Link>
      </div>
    </div>
  );
};
