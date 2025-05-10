'use client';

import Header from "@/components/header/Header";
import useAuth from "@/app/hooks/useAuth";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "@/lib/auth";

const AccountPage: React.FC = () => {
  const user = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Give auth state time to initialize
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="grid md:grid-cols-2 items-stretch gap-8 px-6 md:py-16">
          <div className="absolute top-0 left-0 inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--primary-purple)]"></div>
            <p className="sr-only">Loading...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="grid md:grid-cols-2 items-stretch gap-8 px-6 md:py-16">
        {user ? (
          <>
            <h1>Hi, {user.email}</h1>
            <button className="button" onClick={signOut}>Sign Out</button>
          </>
        ) : (
          redirect('/login')
        )}
      </main>
    </>
  );
};

export default AccountPage;