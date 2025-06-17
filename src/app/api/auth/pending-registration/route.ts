import { NextResponse } from "next/server";
import { createPendingRegistration } from "@/lib/auth";
import { Resend } from "resend";

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
        const verificationLink = `https://bike-lock-finder.vercel.app/verify-email?token=${token}`;

        console.log("Sending verification email...");
        await resend.emails.send({
          from: "Bike Lock Finder <noreply@bikelockfinder.com>",
          to: email,
          subject: "Verify your email address",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">Welcome to Bike Lock Finder!</h1>
              <p>Please verify your email address by clicking the button below:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationLink}"
                   style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                  Verify Email Address
                </a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="color: #666; word-break: break-all;">${verificationLink}</p>
              <p>This link will expire in 24 hours.</p>
              <p>If you didn't request this email, you can safely ignore it.</p>
            </div>
          `,
        });
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
