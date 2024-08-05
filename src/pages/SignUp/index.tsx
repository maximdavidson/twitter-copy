import s from './style.module.css';
import bird from 'assets/twitter-logo.png';

export const SignUp = () => {
  return (
    <div className={s.container}>
      <div className={s.wrapper}>
        <div className={s.imageContainer}>
          <img src={bird} alt="Twitter Bird" className={s.image} />
        </div>
        <p className={s.title}>Create an account</p>
        <input type="text" placeholder="Name" className={s.input} />
        <input type="text" placeholder="Phone" className={s.input} />
        <input type="email" placeholder="Email" className={s.input} />
        <p className={s.subtitle}>Date of birth</p>
        <p className={s.text}>
          Facilisi sem pulvinar velit nunc, gravida scelerisque amet nibh sit. Quis bibendum ante phasellus
          metus, magna lacinia sed augue. Odio enim nascetur leo mauris vel eget. Pretium id ullamcorper
          blandit viverra dignissim eget tellus. Nibh mi massa in molestie a sit. Elit congue.
        </p>
        <div className={s.dateWrapper}>
          <select className={s.select}>
            <option value="">Month</option>
            {/* Add more options for months */}
          </select>
          <select className={s.select}>
            <option value="">Day</option>
            {/* Add more options for days */}
          </select>
          <select className={s.select}>
            <option value="">Year</option>
            {/* Add more options for years */}
          </select>
        </div>
        <button className={s.button}>Next</button>
      </div>
    </div>
  );
};
