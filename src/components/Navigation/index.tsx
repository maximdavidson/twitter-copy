import bird from '@assets/twitter-logo.png';
import bookmarks from '@assets/bookmarks.png';
import explore from '@assets/explore.png';
import home from '@assets/home.png';
import list from '@assets/list.png';
import message from '@assets/message.png';
import more from '@assets/more.png';
import notification from '@assets/notification.png';
import profile from '@assets/profile.png';
import s from './style.module.css';

export const Navigation = () => {
  more;
  return (
    <div className={s.container}>
      <img src={bird} alt="Twitter Bird" />
      <a href="#!">Home</a>
      <a href="#!">Explore</a>
      <a href="#!">Notification</a>
      <a href="#!">Messages</a>
      <a href="#!">Bookmarks</a>
      <a href="#!">Lists</a>
      <a href="#!">Profile</a>
      <a href="#!">More</a>
      <button className={s.btn}>Tweet</button>
      <div className={s.wrapper}>
        <p>USER NAME + LOGO</p>
        <button>LOG OUT</button>
      </div>
    </div>
  );
};
