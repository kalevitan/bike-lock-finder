import { NextResponse } from 'next/server';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from "firebase/auth";

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (user) {
      return NextResponse.json({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || null,
      });
    }
  } catch (error: any) {
    return NextResponse.json('Error signing in', error);
  }
}

export const signOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error(error);
  }
}