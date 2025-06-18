"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isVerified: boolean;
  reload: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Expose a function to reload the user's state
  const reload = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await currentUser.reload();
      const freshUser = auth.currentUser;
      console.log("AuthProvider: User manually reloaded.", {
        uid: freshUser?.uid,
        emailVerified: freshUser?.emailVerified,
      });
      setUser(freshUser);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload();
        const freshUser = auth.currentUser;
        console.log("AuthProvider: Auth state changed and user reloaded.", {
          uid: freshUser?.uid,
          emailVerified: freshUser?.emailVerified,
        });
        setUser(freshUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Periodically check for email verification status
  useEffect(() => {
    const interval = setInterval(async () => {
      const currentUser = auth.currentUser;
      if (currentUser && !currentUser.emailVerified) {
        await currentUser.reload();
        const freshUser = auth.currentUser;
        if (freshUser?.emailVerified) {
          console.log(
            "AuthProvider: Email verification status updated automatically.",
            { emailVerified: freshUser.emailVerified }
          );
          setUser(freshUser);
        }
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [user]);

  const value = {
    user,
    isLoading,
    isVerified: user?.emailVerified || false,
    reload,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
