import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Link, useLocation } from 'react-router-dom';
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
import s from './style.module.css';
import { TweetModal } from './components/Modal';

export const Navigation: FC = () => {
  const { userName, userTelegram, avatarUrl } = useSelector((state: RootState) => state.user);
  const [isTweetModalOpen, setIsTweetModalOpen] = useState(false);
  const location = useLocation();

  const openTweetModal = () => setIsTweetModalOpen(true);
  const closeTweetModal = () => setIsTweetModalOpen(false);

  return (
    <div className={s.container}>
      <img src={bird} alt="Twitter Bird" className={s.logo} />
      <nav className={s.nav}>
        <Link to="/homemain" className={`${s.navItem} ${location.pathname === '/homemain' ? s.active : ''}`}>
          <img src={home} alt="Home" className={s.icon} />
          Home
        </Link>
        <Link to="/explore" className={`${s.navItem} ${location.pathname === '/explore' ? s.active : ''}`}>
          <img src={explore} alt="Explore" className={s.icon} />
          Explore
        </Link>
        <Link
          to="/notifications"
          className={`${s.navItem} ${location.pathname === '/notifications' ? s.active : ''}`}
        >
          <img src={notification} alt="Notification" className={s.icon} />
          Notification
        </Link>
        <Link to="/messages" className={`${s.navItem} ${location.pathname === '/messages' ? s.active : ''}`}>
          <img src={message} alt="Messages" className={s.icon} />
          Messages
        </Link>
        <Link
          to="/bookmarks"
          className={`${s.navItem} ${location.pathname === '/bookmarks' ? s.active : ''}`}
        >
          <img src={bookmarks} alt="Bookmarks" className={s.icon} />
          Bookmarks
        </Link>
        <Link to="/lists" className={`${s.navItem} ${location.pathname === '/lists' ? s.active : ''}`}>
          <img src={list} alt="Lists" className={s.icon} />
          Lists
        </Link>
        <Link to="/profile" className={`${s.navItem} ${location.pathname === '/profile' ? s.active : ''}`}>
          <img src={profile} alt="Profile" className={s.icon} />
          Profile
        </Link>
        <Link to="/more" className={`${s.navItem} ${location.pathname === '/more' ? s.active : ''}`}>
          <img src={more} alt="More" className={s.icon} />
          More
        </Link>
      </nav>
      <button className={s.btn} onClick={openTweetModal}>
        Tweet
      </button>
      <TweetModal isOpen={isTweetModalOpen} onClose={closeTweetModal} />
      <div className={s.wrapper}>
        <div className={s.profile}>
          <img src={avatarUrl || person} alt="Avatar" className={s.avatar} />
          <div>
            <p className={s.userName}>{userName}</p>
            <p className={s.userTelega}>{userTelegram}</p>
          </div>
        </div>
        <Link to="/" className={`${s.logout} ${s.btn}`}>
          Log out
        </Link>
      </div>
    </div>
  );
};
