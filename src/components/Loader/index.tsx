import { FC } from 'react';
import style from './style.module.css';

export const Loader: FC = () => {
  return (
    <div className={style.loaderOverlay}>
      <div className={style.loader}></div>
    </div>
  );
};
