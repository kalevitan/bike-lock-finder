interface RegistrationEmailProps {
  verificationLink: string;
  email: string;
}

export default function RegistrationEmail({
  verificationLink,
  email,
}: RegistrationEmailProps) {
  return {
    from: "Dockly <noreply@updates.dockly.bike>",
    to: email,
    subject: "Verify your Dockly account",
    replyTo: "support@dockly.bike",
    headers: {
      "X-Entity-Ref-ID": crypto.randomUUID(),
      "List-Unsubscribe": "<mailto:unsubscribe@updates.dockly.bike>",
    },
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #1A1A1A; color: #FFFFFF;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="color: #FFFFFF; font-size: 28px; margin: 0;">Welcome to Dockly!</h1>
          <p style="color: #9CA3AF; margin-top: 12px;">Let's get your account verified</p>
        </div>

        <div style="background-color: #2A2A2A; border-radius: 8px; padding: 32px; margin-bottom: 32px;">
          <p style="text-align: center; color: #FFFFFF; margin: 0 0 24px 0;">Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; color: white;">
            <a href="${verificationLink}"
               style="background-color: #4F46E5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500; transition: background-color 0.2s;">
              Verify Email Address
            </a>
          </div>
        </div>

        <div style="background-color: #2A2A2A; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
          <p style="text-align: center; color: #9CA3AF; margin: 0 0 12px 0;">Or copy and paste this link into your browser:</p>
          <p style="color: #FFFFFF; word-break: break-all; margin: 0; font-size: 14px;">${verificationLink}</p>
        </div>

        <div style="text-align: center; color: #9CA3AF; font-size: 14px;">
          <p style="margin: 0 0 8px 0;">This link will expire in 24 hours.</p>
          <p style="margin: 0;">If you didn't request this email, you can safely ignore it.</p>
        </div>
      </div>
    `,
  };
}
