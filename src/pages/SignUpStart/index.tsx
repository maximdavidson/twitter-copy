import { Link } from 'react-router-dom';
import { Footer } from './components/Footer';
import { PolicyText } from './components/PolicyText';
import { useGoogleSignIn } from '@/hooks/useGoogleSignIn';
import logo from '@/assets/back-twitter.webp';
import bird from '@/assets/twitter-logo.png';
import google from '@/assets/google-icon.png';
import style from './style.module.css';

export const SignUpStart = () => {
  const { signInWithGoogle } = useGoogleSignIn();

  return (
    <>
      <div className={style.wrapper}>
        <div className={style.image_wrapper}>
          <img src={logo} alt="Back Twitter logo" loading="lazy" />
        </div>
        <section className={style.text_wrapper}>
          <img className={style.image} src={bird} alt="Twitter Bird" />
          <h1 className={style.title}>Happening now</h1>
          <h3 className={style.subtitle}>Join Twitter today</h3>
          <div className={style.btn_wrapper}>
            <button className={style.button} onClick={signInWithGoogle}>
              <img src={google} alt="Google icon" className={style.icon} /> Sign up with Google
            </button>
            <Link to="/signup" className={style.button}>
              Sign up with email
            </Link>
          </div>
          <PolicyText />
        </section>
      </div>
      <Footer />
    </>
  );
};
