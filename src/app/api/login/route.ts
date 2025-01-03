import { NextResponse } from "next/server";
import { signIn } from "@/lib/auth";

export async function POST(req: Request) {
  const data = await req.json();
  const { email, password } = data;

  try {
    const user = await signIn(email, password);
    if (user !== null) {
      return NextResponse.json({user});
    }
  } catch (e) {
    console.error('Error logging in:', e);
    return NextResponse.error();
  }
}