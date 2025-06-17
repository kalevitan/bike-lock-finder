import { NextResponse } from "next/server";
import { createPendingRegistration } from "@/lib/auth";
import { Resend } from "resend";
import RegistrationEmail from "./_components/RegistrationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Validate request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    const { email } = body;
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    console.log("Starting registration process for email:", email);

    try {
      const { token, isReverification } =
        await createPendingRegistration(email);

      // Send verification email using Resend
      try {
        const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;
        const emailConfig = RegistrationEmail({ verificationLink, email });

        console.log("Sending verification email...");
        await resend.emails.send(emailConfig);
        console.log("Verification email sent");

        return NextResponse.json({
          token,
          isReverification,
          message: isReverification
            ? "Verification email resent successfully"
            : "Verification email sent successfully",
        });
      } catch (error: any) {
        console.error("Error sending verification email:", {
          code: error.code,
          message: error.message,
          stack: error.stack,
        });

        return NextResponse.json(
          {
            message:
              "Failed to send verification email. Please try again later.",
            error: error.message,
          },
          { status: 500 }
        );
      }
    } catch (error: any) {
      console.error("Error in createPendingRegistration:", {
        code: error.code,
        message: error.message,
        stack: error.stack,
      });

      return NextResponse.json(
        {
          message: "Failed to create pending registration",
          error: error.message,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Unexpected error in pending registration process:", {
      code: error.code,
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        message: "An unexpected error occurred",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
