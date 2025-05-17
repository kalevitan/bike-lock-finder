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
      <main className="grid md:grid-cols-2 items-stretch gap-8 px-6 pt-[60px] md:py-16">
        <h1>Hi, {user.email}</h1>
        <button className="button" onClick={signOut}>Sign Out</button>
      </main>
    </>
  );
}