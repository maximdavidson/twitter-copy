import { useState } from 'react';
import { validateImage } from '@/validation';
import { updateBackground } from '@/utils/updateBackground';
import { auth } from '@/database';

export const useBackgroundHandler = (setBackgroundUrl: (url: string) => void) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorTimeoutId, setErrorTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleBackgroundChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
          await updateBackground(auth.currentUser, file, setBackgroundUrl);
        }
      } finally {
        setIsSaving(false);
      }
    }
  };

  return {
    handleBackgroundChange,
    isSaving,
    error,
  };
};
