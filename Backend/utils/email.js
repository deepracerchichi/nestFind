import nodemailer from "nodemailer";

// Constructed lazily, on first send, instead of at module load - same
// reasoning as the old Resend client: don't depend on import order for
// env vars (see the dotenv/import-hoisting bug we hit earlier).
let transporter;
const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });
    }
    return transporter;
};

const FROM = () => `"nestFind" <${process.env.GMAIL_USER}>`;



const FRONTEND_URL = process.env.FRONTEND_URL;
const LOGO_URL = "https://res.cloudinary.com/dnu9wti6r/image/upload/v1787349518/navLogo.png";
const PRIMARY = "#B714F7";

const buildEmailHtml = ({ heading, body, buttonText, buttonUrl, footerNote }) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0; padding:40px 16px; background-color:#f4f4f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:420px; margin:0 auto; background-color:#ffffff; border-radius:24px; overflow:hidden;">
      <tr>
        <td style="padding:40px;">
          <img src="${LOGO_URL}" alt="nestFind" width="120" style="display:block; margin-bottom:28px;" />
          <h1 style="margin:0 0 12px; font-size:22px; font-weight:700; color:#111111;">${heading}</h1>
          <p style="margin:0 0 28px; font-size:14px; line-height:22px; color:#444444;">${body}</p>
          ${buttonText && buttonUrl ? `
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="border-radius:9999px; background-color:${PRIMARY};">
                <a href="${buttonUrl}" style="display:inline-block; padding:12px 28px; font-size:14px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:9999px;">
                  ${buttonText}
                </a>
              </td>
            </tr>
          </table>
          ` : ""}
          ${footerNote ? `<p style="margin:28px 0 0; font-size:12px; line-height:18px; color:#999999;">${footerNote}</p>` : ""}
        </td>
      </tr>
    </table>
    <p style="text-align:center; font-size:11px; color:#aaaaaa; margin-top:20px;">
      &copy; ${new Date().getFullYear()} nestFind. All rights reserved.
    </p>
  </body>
</html>
`;




export const sendVerificationEmail = async (to, token) => {
    const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    await getTransporter().sendMail({
        from: FROM(),
        to,
        subject: "Confirm your email address",
        html: buildEmailHtml({
            heading: "Confirm your email",
            body: "Welcome to nestFind — click below to confirm your email address and finish setting up your account.",
            buttonText: "Confirm email",
            buttonUrl: link,
            footerNote: "This link expires in 24 hours. If you didn't create a nestFind account, you can safely ignore this email.",
        }),
    });
}

export const sendPasswordResetEmail = async (to, token) => {
    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await getTransporter().sendMail({
        from: FROM(),
        to,
        subject: "Reset your password",
        html: buildEmailHtml({
            heading: "Reset your password",
            body: "Click below to choose a new password for your nestFind account.",
            buttonText: "Reset password",
            buttonUrl: link,
            footerNote: "This link expires in 15 minutes. If you didn't request this, you can safely ignore this email.",
        }),
    });
}

export const sendEmailChangeConfirmation = async (to, token) => {
  const link = `${process.env.FRONTEND_URL}/confirm-email-change?token=${token}`;
  await getTransporter().sendMail({
    from: FROM(),
    to,
    subject: "Confirm your new email address",
    html: buildEmailHtml({
      heading: "Confirm your new email address",
      body: "Click below to confirm this email address for your nestFind account. Your login email won't change until you confirm",
      buttonText: "Confirm new email",
      buttonUrl: link,
      footerNote: "This link expires in 24 hours. If you didn't request this, you can safely ignore this email - your account is unaffected"
    }),
  })
}

export const sendWelcomeEmail = async (to, username) => {
    await getTransporter().sendMail({
        from: FROM(),
        to,
        subject: "You're verified!",
        html: buildEmailHtml({
            heading: `Welcome, ${username}!`,
            body: "Your email's been confirmed and your nestFind account is fully set up. Start browsing listings or list your own property whenever you're ready.",
            buttonText: "Go to nestFind",
            buttonUrl: process.env.FRONTEND_URL,
        }),
    });
}
