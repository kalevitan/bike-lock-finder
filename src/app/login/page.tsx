'use client';

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header/Header";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '@/lib/firebase';
import { signOut } from "@/lib/auth";
import useAuth from "@/app/hooks/useAuth";

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [formMode, setFormMode] = useState('login');
  const router = useRouter();

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
        router.push('..')
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
  });

  const loggedIn = useAuth();

  return (
    <>
      <Header />
      <main className="pt-[60px]">
        <div className="w-fit m-auto">
          <div className="grid justify-center pt-8 px-4">
            {!loggedIn ? (
              <>
                <h1 className="pb-6">
                  {formMode == 'login' ? (
                    "Login"
                  ) : (
                    "Register"
                  )}
                </h1>

                <form className="min-w-80" method="post" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-4 max-w-96">
                    <div className="flex flex-col text-left gap-2">
                      <label htmlFor="email">Email</label>
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
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="rounded-[4px]"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    <button className="button mt-6" type="submit">
                      {formMode == 'login' ? (
                        "Login"
                      ) : (
                        "Register"
                      )}
                    </button>
                  </div>
                <div className="pt-6 pb-4 text-center">
                  {formMode == 'login' ? (
                    <button onClick={() => setFormMode('register')}>Don't have an account? Register here.</button>
                  ) : (
                    <button onClick={() => setFormMode('login')}>Already have an account? Login here.</button>
                  )}
                </div>
                  {error && <p className="text-red-600 text-center">{error}</p>}
                </form>
              </>
            ) : (
              <button className="button" onClick={signOut}>Sign Out</button>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default Login;