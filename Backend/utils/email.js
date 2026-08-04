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

export const sendVerificationEmail = async (to, token) => {
    const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    await getTransporter().sendMail({
        from: FROM(),
        to,
        subject: "Confirm your email address",
        html: `<p>Welcome to nestFind - click below to confirm your email: </p>
        <p><a href="${link}">${link}</a></p>
        <p>This link expires in 24 hours</p>`
    });
}

export const sendPasswordResetEmail = async (to, token) => {
    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await getTransporter().sendMail({
        from: FROM(),
        to,
        subject: "Reset your password",
        html: `<p>Click below to reset your password:</p>
        <p><a href="${link}">${link}</a></p>
        <p> This link expires in 15 minutes. If you didn't request this, ignore this email.</p>`
    });
}

export const sendWelcomeEmail = async (to, username) => {
    await getTransporter().sendMail({
        from: FROM(),
        to,
        subject: "You're verified!",
        html: `<p>Hey ${username}, your email's been confirmed! You're all set on nestFind. Welcome aboard!</p>`
    });
}