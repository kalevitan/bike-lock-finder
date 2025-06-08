'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header/Header";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '@/lib/firebase';
import useAuth from "@/app/hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [formMode, setFormMode] = useState('login');
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/account');
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (result.user) {
        // Need to authenticate user on the client-side as well
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/');
      } else {
        console.error('Login failed:', result.message);
      }
    } catch (err: any) {
      console.error('Login error:', err.message);
      setError(err.message);
    }
  }

  useEffect(() => {
    setError(null);
    if (formMode == 'register') {
      setError('Sorry, registration is not yet supported.');
    }
  }, [formMode]);

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="max-w-[30rem] md:mx-auto gap-4">
        <div className="grid justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--primary-purple)]"></div>
        </div>
      </div>
    );
  }

  // Don't render anything if we're authenticated (will redirect)
  if (user) {
    return null;
  }

  return (
    <div className="max-w-[30rem] md:mx-auto gap-4">
      <div className="grid justify-center">
        <h1 className="pb-6">
          {formMode == 'login' ? (
            "Login"
          ) : (
            "Register"
          )}
        </h1>

        <form className="min-w-[20rem]" method="post" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col text-left gap-2">
              <label htmlFor="email" className="text-[var(--primary-white)]">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-[4px]"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="flex flex-col text-left gap-2">
              <label htmlFor="password" className="text-[var(--primary-white)]">Password</label>
              <input
                type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-[4px]"
                placeholder="Enter your password"
                required
              />
            </div>
            <button className="button mt-6 text-[var(--primary-white)]" type="submit">
              {formMode == 'login' ? (
                "Login"
              ) : (
                "Register"
              )}
            </button>
          </div>
          <div className="pt-6 pb-4 text-center text-[var(--primary-white)]">
            {formMode == 'login' ? (
              <button onClick={() => setFormMode('register')}>Don't have an account? Register here.</button>
            ) : (
              <button onClick={() => setFormMode('login')}>Already have an account? Login here.</button>
            )}
          </div>
          {error && <p className="text-red-600 text-center">{error}</p>}
        </form>
      </div>
    </div>
  )
}