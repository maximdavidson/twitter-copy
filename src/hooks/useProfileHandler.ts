import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateProfile } from '@/utils/updateProfile';
import { setUserName, setUserTelegram, setGender } from '@/store/userSlice';
import { auth } from '@/database';

export const useProfileHandler = () => {
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch();

  const handleSaveProfile = async (
    name: string,
    telegram: string,
    gender: string,
    info: string,
    setUserInfo: (info: string) => void,
    setIsModalOpen: (isOpen: boolean) => void,
  ) => {
    setIsSaving(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, name, telegram, gender, info, dispatch);

        dispatch(setUserName(name));
        dispatch(setUserTelegram(telegram));
        dispatch(setGender(gender));
        setUserInfo(info);
      }
    } finally {
      setIsSaving(false);
      setIsModalOpen(false);
    }
  };

  return {
    handleSaveProfile,
    isSaving,
  };
};
