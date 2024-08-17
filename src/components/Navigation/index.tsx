import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Link, useLocation } from 'react-router-dom';
import { TweetModal } from './components/Modal';
import bird from '@/assets/twitter-logo.png';
import bookmarks from '@/assets/bookmarks.png';
import explore from '@/assets/explore.png';
import home from '@/assets/home.png';
import list from '@/assets/lists.png';
import message from '@/assets/messages.png';
import more from '@/assets/more.png';
import notification from '@/assets/notification.png';
import profile from '@/assets/profile.png';
import person from '@/assets/person.png';
import burgerblack from '@/assets/menuIcon-dark.png';
import close from '@/assets/menuIcon-close.png';
import style from './style.module.css';

export const Navigation: FC = () => {
  const { userName, userTelegram, avatarUrl } = useSelector((state: RootState) => state.user);
  const [isTweetModalOpen, setIsTweetModalOpen] = useState(false);
  const location = useLocation();

  const openTweetModal = () => setIsTweetModalOpen(true);
  const closeTweetModal = () => setIsTweetModalOpen(false);

  return (
    <div className={style.container}>
      <img src={bird} alt="Twitter Bird" className={style.logo} />
      <nav className={style.nav}>
        <Link to="/home" className={`${style.navItem} ${location.pathname === '/home' ? style.active : ''}`}>
          <img src={home} alt="Home" className={style.icon} />
          <span>Home</span>
        </Link>
        <Link
          to="/explore"
          className={`${style.navItem} ${location.pathname === '/explore' ? style.active : ''}`}
        >
          <img src={explore} alt="Explore" className={style.icon} />
          <span>Explore</span>
        </Link>
        <Link to="#!" className={`${style.navItem} ${location.pathname === '#!' ? style.active : ''}`}>
          <img src={notification} alt="Notification" className={style.icon} />
          <span>Notification</span>
        </Link>
        <Link
          to="#!"
          className={`${style.navItem} ${style.not} ${location.pathname === '#!' ? style.active : ''}`}
        >
          <img src={message} alt="Messages" className={style.icon} />
          <span>Messages</span>
        </Link>
        <Link
          to="#!"
          className={`${style.navItem} ${style.not} ${location.pathname === '#!' ? style.active : ''}`}
        >
          <img src={bookmarks} alt="Bookmarks" className={style.icon} />
          <span>Bookmarks</span>
        </Link>
        <Link
          to="#!"
          className={`${style.navItem} ${style.not} ${location.pathname === '#!' ? style.active : ''}`}
        >
          <img src={list} alt="Lists" className={style.icon} />
          <span>Lists</span>
        </Link>
        <Link
          to="/profile"
          className={`${style.navItem} ${location.pathname === '/profile' ? style.active : ''}`}
        >
          <img src={profile} alt="Profile" className={style.icon} />
          <span>Profile</span>
        </Link>
        <Link
          to="#!"
          className={`${style.navItem} ${style.not} ${location.pathname === '#!' ? style.active : ''}`}
        >
          <img src={more} alt="More" className={style.icon} />
          <span>More</span>
        </Link>
      </nav>
      <button className={`${style.tweet_btn} ${style.btn}`} onClick={openTweetModal}>
        Tweet
      </button>
      <TweetModal isOpen={isTweetModalOpen} onClose={closeTweetModal} />
      <div className={style.wrapper}>
        <div className={style.profile}>
          <img src={avatarUrl || person} alt="Avatar" className={style.avatar} />
          <div>
            <p className={style.userName}>{userName}</p>
            <p className={style.userTelega}>{userTelegram}</p>
          </div>
        </div>
        <Link to="/" className={`${style.logout} ${style.btn}`}>
          Log out
        </Link>
      </div>
    </div>
  );
};
