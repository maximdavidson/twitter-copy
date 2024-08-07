import s from 'pages/SignUpStart/style.module.css';
import { Link } from 'react-router-dom';

export const PolicyText = () => (
  <>
    <p className={s.police_text}>
      By signing up you agree to the
      <a href="#!" className={s.link}>
        Terms of Service
      </a>
      and
      <a href="#!" className={s.link}>
        Privacy <br /> Policy
      </a>
      , including
      <a href="#!" className={s.link}>
        Cookie Use
      </a>
      .
    </p>
    <p className={s.log_text}>
      Already have an account?
      <Link to="/login" className={s.link}>
        Log in
      </Link>
    </p>
  </>
);
