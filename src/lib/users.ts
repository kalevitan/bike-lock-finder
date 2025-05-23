import { useState, useEffect } from 'react';
import { UserData } from '@/interfaces/user';

// Simple in-memory cache
const cache = new Map<string, UserData>();

export async function getUserDocument(uid: string): Promise<UserData | null> {
  try {
    // Check cache first
    if (cache.has(uid)) {
      return cache.get(uid) || null;
    }

    const response = await fetch(`/api/users?uid=${uid}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user document');
    }
    const data = await response.json();

    // Store in cache
    cache.set(uid, data);
    return data;
  } catch (error) {
    console.error('Error fetching user document:', error);
    return null;
  }
}

export async function createUserDocument(userData: UserData): Promise<boolean> {
  if (!userData.uid) {
    throw new Error('User ID is required');
  }

  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create user document');
    }

    // Update cache
    cache.set(userData.uid, userData);
    return true;
  } catch (error) {
    console.error('Error creating user document:', error);
    return false;
  }
}

export async function updateUserDocument(uid: string, userData: Partial<UserData>): Promise<boolean> {
  try {
    const response = await fetch(`/api/users?uid=${uid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update user document');
    }

    // Update cache
    const existingData = cache.get(uid);
    if (existingData) {
      cache.set(uid, { ...existingData, ...userData });
    }

    return true;
  } catch (error) {
    console.error('Error updating user document:', error);
    return false;
  }
}

export function useUserDocument(uid: string | null) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!uid) {
      setUserData(null);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const data = await getUserDocument(uid);
        if (data) {
          setUserData(data);
        } else {
          setIsError(true);
        }
      } catch (error) {
        console.error('Error in useUserDocument:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [uid]);

  const mutate = async () => {
    if (!uid) return;

    setIsLoading(true);
    try {
      const data = await getUserDocument(uid);
      if (data) {
        setUserData(data);
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error('Error in mutate:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return { userData, isLoading, isError, mutate };
}