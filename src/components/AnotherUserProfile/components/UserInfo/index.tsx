import { FC } from 'react';
import { UserProfile as UserProfileType } from '@/types';
import style from './style.module.css';

interface UserInfoProps {
  profile: UserProfileType;
}

export const UserInfo: FC<UserInfoProps> = ({ profile }) => {
  return (
    <div className={style.container}>
      <div className={style.wrapper}>
        <div className={style.background_container}>
          <img
            className={style.background}
            src={profile.background || '@assets/default-background.png'}
            alt="background"
          />
        </div>
        <div className={style.avatar_container}>
          <img src={profile.avatar} alt="avatar" className={style.avatar} />
        </div>
      </div>

      <h2 className={style.profileName}>{profile.displayName}</h2>
      <p className={style.profileGender}>{profile.gender}</p>
      <p className={style.profileTelegram}>{profile.telegram}</p>
      <div className={style.user_input}>
        <p className={style.info}>{profile.info}</p>
      </div>
    </div>
  );
};
