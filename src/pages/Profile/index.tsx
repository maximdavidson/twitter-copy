import { FC } from 'react';
import { Navigation } from '../../components/Navigation';
import { UserSpace } from '../UserSpace';
import style from './style.module.css';

export const Profile: FC = () => {
  return (
    <div className={style.container}>
      <Navigation />
      <div className={style.content}>
        <UserSpace />
      </div>
    </div>
  );
};
