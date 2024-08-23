import style from '@/pages/SignUpStart/style.module.css';
import { Link } from 'react-router-dom';

export const PolicyText = () => (
  <>
    <p className={style.police_text}>
      By signing up you agree to the
      <a href="#!" className={style.link}>
        Terms of Service
      </a>
      and
      <a href="#!" className={style.link}>
        Privacy <br /> Policy
      </a>
      , including
      <a href="#!" className={style.link}>
        Cookie Use
      </a>
      .
    </p>
    <p className={style.log_text}>
      Already have an account?
      <Link to="/login" className={style.login}>
        Log in
      </Link>
    </p>
  </>
);
