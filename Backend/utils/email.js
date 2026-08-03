import {Resend} from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (to, token) => {
    const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to,
        subject: "Confirm your email address",
        html: `<p>Welcome to nestFind - click below to confirm your email: </p>
        <p><a href="${link}">${link}</a></p>
        <p>This link expires in 24 hours</p>`
    });
}

export const sendPasswordResetEmail = async (to, token) => {
    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to,
        subject: "Reset your password",
        html: `<p>Click below to reset your password:</p>
        <p><a href="${link}">${link}</a></p>
        <p> This link expires in 15 minutes. If you didn't request this, ignore this email.</p>`
    });
}

export const sendWelcomeEmail = async (to, username) => {
    await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to,
        subject: "You're verified!",
        html: `<p>Hey ${username}, your email's been confirmed! You're all set on nestFind. Welcome aboard!</p>`
    });
}