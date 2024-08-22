import { useState } from 'react';
import { validateImage } from '@/validation';
import { updateAvatar } from '@/utils/updateAvatar';
import { auth } from '@/database';

export const useAvatarHandler = (setLocalAvatarUrl: (url: string) => void) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorTimeoutId, setErrorTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const validationError = validateImage(file);
      if (validationError) {
        setError(validationError);

        if (errorTimeoutId) clearTimeout(errorTimeoutId);

        const timeoutId = setTimeout(() => {
          setError(null);
        }, 3000);

        setErrorTimeoutId(timeoutId);
        return;
      }

      setIsSaving(true);
      try {
        if (auth.currentUser) {
          await updateAvatar(auth.currentUser, file, setLocalAvatarUrl);
        }
      } finally {
        setIsSaving(false);
      }
    }
  };

  return {
    handleAvatarChange,
    isSaving,
    error,
  };
};
