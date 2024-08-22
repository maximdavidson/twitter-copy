import { FC, useState } from 'react';
import { validateProfile } from '@/validation';
import style from './style.module.css';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, telegram: string, gender: string, info: string) => void;
  currentName: string;
  currentTelegram: string;
  currentGender: string;
  currentInfo: string;
}

export const ProfileEditModal: FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentName,
  currentTelegram,
  currentGender,
  currentInfo,
}) => {
  const [name, setName] = useState(currentName);
  const [telegram, setTelegram] = useState(currentTelegram);
  const [gender, setGender] = useState(currentGender);
  const [info, setInfo] = useState(currentInfo);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const handleSave = () => {
    const nameError = validateProfile('name', name);
    const telegramError = validateProfile('telegram', telegram);
    const infoError = validateProfile('info', info);

    if (nameError || telegramError || infoError) {
      setErrors({
        name: nameError || '',
        telegram: telegramError || '',
        info: infoError || '',
      });
      return;
    }

    onSave(name, telegram, gender, info);
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
          Telegram:
          <input
            type="text"
            value={telegram}
            onChange={handleChange('telegram', setTelegram)}
            placeholder="@telegram"
          />
          {errors.telegram && <span className={style.error}>{errors.telegram}</span>}
        </label>
        <label>
          Gender:
          <input type="text" value={gender} onChange={handleChange('gender', setGender)} />
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
