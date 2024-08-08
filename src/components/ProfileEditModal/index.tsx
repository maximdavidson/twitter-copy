import { FC, useState } from 'react';
import style from './style.module.css';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, nickname: string, info: string) => void;
  currentName: string;
  currentNickname: string;
  currentInfo: string;
}

export const ProfileEditModal: FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentName,
  currentNickname,
  currentInfo,
}) => {
  const [name, setName] = useState(currentName);
  const [nickname, setNickname] = useState(currentNickname);
  const [info, setInfo] = useState(currentInfo);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(name, nickname, info);
    onClose();
  };

  return (
    <div className={style.overlay}>
      <div className={style.modal}>
        <h2>Edit Profile</h2>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Nickname:
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="@nickname"
          />
        </label>
        <label>
          Info:
          <textarea value={info} onChange={(e) => setInfo(e.target.value)} />
        </label>
        <div className={style.buttons}>
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
