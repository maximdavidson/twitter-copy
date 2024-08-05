import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAU3xiBKNKJh-HX23YKgEL8HytUDc225tE',
  authDomain: 'modsenwitter.firebaseapp.com',
  projectId: 'modsenwitter',
  storageBucket: 'modsenwitter.appspot.com',
  messagingSenderId: '357057773191',
  appId: 'modsenwitter',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword };
