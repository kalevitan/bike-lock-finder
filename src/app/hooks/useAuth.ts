import { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUserDocument, getUserDocument } from '@/lib/users';

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    console.log('Setting up auth listener');

    // Get the current user immediately
    const currentUser = auth.currentUser;
    if (currentUser) {
      console.log('Initial user found:', currentUser.uid);
      setUser(currentUser);
      setLoading(false);
    }

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log('Auth state changed:', user?.uid);

      if (user) {
        try {
          // Check if user document exists
          const existingUser = await getUserDocument(user.uid);

          // Only create if it doesn't exist
          if (!existingUser) {
            console.log('Creating new user document');
            const success = await createUserDocument({
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || '',
              photoURL: user.photoURL || '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
            console.log('User document created:', success);
          } else {
            console.log('User document already exists');
          }
        } catch (error) {
          console.error('Error handling user document:', error);
        }
      }

      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      console.log('Cleaning up auth listener');
      mountedRef.current = false;
      unsubscribe();
    };
  }, []); // Empty dependency array to ensure the effect runs only once

  return { user, loading };
}
