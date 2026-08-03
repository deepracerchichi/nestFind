"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/lib/auth";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await forgotPassword(email);
        } finally {
            // Always show the same confirmation - same reasoning as the
            // backend's generic response: don't reveal whether the email exists.
            setSubmitted(true);
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-8">
            <div className="w-full max-w-sm">
                <h1 className="text-3xl mb-1">Reset your password</h1>
                <p className="text-sm text-muted-foreground mb-6">
                    Enter your email and we&apos;ll send you a reset link.
                </p>

                {submitted ? (
                    <p className="text-sm">
                        If that email is registered, a reset link has been sent. Check your inbox.
                    </p>
                ) : (
                    <div className="flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="font-medium border-b-2 p-2 w-full focus:outline-none focus:border-primary"
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-primary text-primary-foreground rounded-full p-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
                        >
                            {loading ? "Sending..." : "Send reset link"}
                        </button>
                    </div>
                )}

                <p className="text-sm mt-4 text-center">
                    <Link href="/login" className="text-primary hover:underline">
                        Back to login
                    </Link>
                </p>
            </div>
        </div>
    );
}
