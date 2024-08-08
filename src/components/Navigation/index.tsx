import bird from '@assets/twitter-logo.png';
import bookmarks from '@assets/bookmarks.png';
import explore from '@assets/explore.png';
import home from '@assets/home.png';
import list from '@assets/lists.png';
import message from '@assets/messages.png';
import more from '@assets/more.png';
import notification from '@assets/notification.png';
import profile from '@assets/profile.png';
import person from '@assets/person.png';
import s from './style.module.css';

export const Navigation = () => {
  return (
    <div className={s.container}>
      <img src={bird} alt="Twitter Bird" className={s.logo} />
      <nav className={s.nav}>
        <a href="#!" className={s.navItem}>
          <img src={home} alt="Home" className={s.icon} />
          Home
        </a>
        <a href="#!" className={s.navItem}>
          <img src={explore} alt="Explore" className={s.icon} />
          Explore
        </a>
        <a href="#!" className={s.navItem}>
          <img src={notification} alt="Notification" className={s.icon} />
          Notification
        </a>
        <a href="#!" className={s.navItem}>
          <img src={message} alt="Messages" className={s.icon} />
          Messages
        </a>
        <a href="#!" className={s.navItem}>
          <img src={bookmarks} alt="Bookmarks" className={s.icon} />
          Bookmarks
        </a>
        <a href="#!" className={s.navItem}>
          <img src={list} alt="Lists" className={s.icon} />
          Lists
        </a>
        <a href="#!" className={s.navItem}>
          <img src={profile} alt="Profile" className={s.icon} />
          Profile
        </a>
        <a href="#!" className={s.navItem}>
          <img src={more} alt="More" className={s.icon} />
          More
        </a>
      </nav>
      <button className={s.btn}>Tweet</button>
      <div className={s.wrapper}>
        <div className={s.profile}>
          <img src={person} alt="Person" className={s.profilePic} />
          <div>
            <p className={s.userName}>Bobur</p>
            <p className={s.userHandle}>@bobur_mavlonov</p>
          </div>
        </div>
        <button className={`${s.logout} ${s.btn}`}>Log out</button>
      </div>
    </div>
  );
};
