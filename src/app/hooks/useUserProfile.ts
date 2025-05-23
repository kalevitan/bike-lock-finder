import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { updateUserDocument } from '@/lib/users';
import { UserData } from '@/interfaces/user';

export default function useUserProfile() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (data: Partial<UserData>) => {
    setIsUpdating(true);
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user logged in');
      }

      await updateUserDocument(user.uid, {
        ...data,
      });

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateProfile, isUpdating, error };
}