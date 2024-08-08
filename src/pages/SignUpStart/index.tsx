import { useNavigate } from 'react-router-dom';
import s from './style.module.css';
import logo from '@assets/back-twitter.webp';
import bird from '@assets/twitter-logo.png';
import google from '@assets/google-icon.png';
import { Link } from 'react-router-dom';
import { auth, signInWithPopup, googleProvider } from '../../database';
import { Footer } from './components/Footer';
import { PolicyText } from './components/PolicyText';

export const SignUpStart = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      navigate('/profile', { replace: true, state: { name: user.displayName || 'User' } });
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  return (
    <>
      <div className={s.wrapper}>
        <div className={s.image_wrapper}>
          <img src={logo} alt="Back Twitter logo" loading="lazy" />
        </div>
        <div className={s.text_wrapper}>
          <img className={s.image} src={bird} alt="Twitter Bird" />
          <h1 className={s.title}>Happening now</h1>
          <h3 className={s.subtitle}>Join Twitter today</h3>
          <div className={s.btn_wrapper}>
            <button className={s.button} onClick={handleGoogleSignIn}>
              <img src={google} alt="Google icon" className={s.icon} /> Sign up with Google
            </button>
            <Link to="/signup" className={s.button}>
              Sign up with email
            </Link>
          </div>
          <PolicyText />
        </div>
      </div>
      <Footer />
    </>
  );
};
