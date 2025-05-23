import { UserData } from '@/interfaces/user';
import useSWR from 'swr';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch data');
  }
  return response.json();
};

export const useUserDocument = (uid: string | null) => {
  const { data, error, mutate } = useSWR<UserData | null>(
    uid ? `/api/users?uid=${uid}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 5000, // Dedupe requests within 5 seconds
    }
  );

  return {
    userData: data,
    isLoading: uid ? !error && !data : false, // Only show loading state if we have a uid
    isError: error,
    mutate,
  };
};

export const createUserDocument = async (userData: UserData) => {
  try {
    if (!userData.uid) {
      throw new Error('User ID is required');
    }

    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create user document');
    }

    return true;
  } catch (error) {
    console.error('Error creating user document:', error);
    return false;
  }
};

export const getUserDocument = async (uid: string): Promise<UserData | null> => {
  try {
    const response = await fetch(`/api/users?uid=${uid}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to get user document');
    }

    return response.json();
  } catch (error) {
    console.error('Error getting user document:', error);
    return null;
  }
};

export const updateUserDocument = async (uid: string, data: Partial<UserData>) => {
  try {
    const response = await fetch(`/api/users?uid=${uid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update user document');
    }

    return true;
  } catch (error) {
    console.error('Error updating user document:', error);
    return false;
  }
};