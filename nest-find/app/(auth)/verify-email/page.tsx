"use client"

import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import Link from "next/link";
import {verifyEmail} from "@/lib/auth";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">(
        token ? "loading" : "error"
    );
    const [message, setMessage] = useState(token ? "" : "Missing verification token.");

    useEffect(() => {
        if (!token) return;

        verifyEmail(token)
            .then((data) => {
                setStatus("success");
                setMessage(data.message);
            })
            .catch((err) => {
                setStatus("error");
                setMessage(err.response?.data?.message || "Verification failed.");
            });

    }, [token]);

    return (
        <div className="flex min-h-screen items-center justify-center p-8">

            <div className="max-w-sm text-center">
                {status === "loading" && <p>Verifying your email...</p>}
                {status === "success" && (
                    <>
                        <h1 className="text-2xl font-bold mb-2">You&apos;re verified!</h1>
                        <p className="text-muted-foreground mb-4">{message}</p>
                        <Link href="/dashboard" className="text-primary hover:underline">
                            Go to Dashboard
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <h1 className="text-2xl font-bold mb-2"> Verification failed</h1>
                        <p className="text-muted-foreground">{message}</p>
                    </>
                )}
            </div>
        </div>
    )

}