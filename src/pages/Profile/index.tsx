import { FC } from 'react';
import { Navigation } from '../../components/Navigation';
import { UserSpace } from '../UserSpace';
import s from './style.module.css';

export const Profile: FC = () => {
  return (
    <div className={s.container}>
      <Navigation />
      <div className={s.content}>
        <UserSpace />
      </div>
    </div>
  );
};
