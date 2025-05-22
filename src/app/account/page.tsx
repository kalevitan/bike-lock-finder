'use client';

import Header from "@/components/header/Header";
import useAuth from "@/app/hooks/useAuth";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";

export default function AccountPage() {
  const user = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  if (!user) {
    redirect('/login');
  }

  return (
    <>
      <Header />
      <main className="grid items-stretch gap-8 px-6 pt-[60px] md:py-16">
        <h1>Hi, {user.email}</h1>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email">User Name</label>
            <input type="email" id="username" name="username" value={user.email || ''} disabled />
          </div>
          <div className="flex flex-col gap-2"></div>
          <button type="button" className="button button--secondary" onClick={signOut}>Sign Out</button>
        </form>
      </main>
    </>
  );
}