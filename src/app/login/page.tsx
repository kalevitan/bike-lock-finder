'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/src/components/header/Header";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '@/src/lib/firebase';
import { signOut } from "@/src/lib/auth";
import useAuth from "@/src/app/hooks/useAuth";

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
        // Authenticate user on the client-side as well
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

  const loggedIn = useAuth();

  return (
    <>
      <Header />
      <main>
        <div className="grid justify-center pt-8">
          <div className="px-4">
            {!loggedIn ? (
              <>
                <h1 className="pb-2">
                  {formMode == 'login' ? (
                    "Login"
                  ) : (
                    "Register"
                  )}
                </h1>
                <form method="post" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-4 max-w-96">
                    <div className="flex flex-col text-left">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    <button className="button" type="submit">
                      {formMode == 'login' ? (
                        "Login"
                      ) : (
                        "Register"
                      )}
                    </button>
                    <div className="pt-2">
                      {formMode == 'login' ? (
                        <button onClick={() => setFormMode('register')}>Don't have an account? Please register here.</button>
                      ) : (
                        <button onClick={() => setFormMode('login')}>Already have an account? Please login here.</button>
                      )}
                    </div>
                  </div>
                  {error && <p style={{ color: 'red' }}>{error}</p>}
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