import s from './style.module.css';
import logo from 'assets/back-twitter.png';
import bird from 'assets/twitter-logo.png';
import google from 'assets/google-icon.png';

export const SignUpStart = () => {
  return (
    <>
      <div className={s.wrapper}>
        <div className={s.image_wrapper}>
          <img src={logo} alt="Back Twitter logo" />
        </div>
        <div className={s.text_wrapper}>
          <img className={s.image} src={bird} alt="Twitter Bird" />
          <h1 className={s.title}>Happening now</h1>
          <h3 className={s.subtitle}>Join Twitter today</h3>
          <div className={s.btn_wrapper}>
            <button className={s.button}>
              <img src={google} alt="Google icon" className={s.icon} /> Sign up with Google
            </button>
            <button className={s.button}>Sign up with email</button>
          </div>
          <p className={s.police_text}>
            By signing up you agree to the
            <a href="/terms" className={s.link}>
              Terms of Service
            </a>
            and
            <a href="/privacy" className={s.link}>
              Privacy <br /> Policy
            </a>
            , including
            <a href="/cookies" className={s.link}>
              Cookie Use
            </a>
            .
          </p>
          <p className={s.log_text}>
            Already have an account?
            <a href="/login" className={s.link}>
              Log in
            </a>
          </p>
        </div>
      </div>
    </>
  );
};
