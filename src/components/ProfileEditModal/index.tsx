import { FC, useState } from 'react';
import style from './style.module.css';
import { validateProfile } from '@/validation';

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const handleSave = () => {
    const nameError = validateProfile('name', name);
    const nicknameError = validateProfile('nickname', nickname);
    const infoError = validateProfile('info', info);

    if (nameError || nicknameError || infoError) {
      setErrors({
        name: nameError || '',
        nickname: nicknameError || '',
        info: infoError || '',
      });
      return;
    }

    onSave(name, nickname, info);
    onClose();
  };

  const handleChange =
    (name: string, setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(e.target.value);
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

  return (
    <div className={style.overlay}>
      <div className={style.modal}>
        <h2>Edit Profile</h2>
        <label>
          Name:
          <input type="text" value={name} onChange={handleChange('name', setName)} />
          {errors.name && <span className={style.error}>{errors.name}</span>}
        </label>
        <label>
          Nickname:
          <input
            type="text"
            value={nickname}
            onChange={handleChange('nickname', setNickname)}
            placeholder="@nickname"
          />
          {errors.nickname && <span className={style.error}>{errors.nickname}</span>}
        </label>
        <label>
          Info:
          <textarea value={info} onChange={handleChange('info', setInfo)} />
          {errors.info && <span className={style.error}>{errors.info}</span>}
        </label>
        <div className={style.buttons}>
          <button className={style.btn_save} onClick={handleSave}>
            Save
          </button>
          <button className={style.btn_cancel} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
