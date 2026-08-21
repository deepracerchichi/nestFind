"use client"

import { useAuth } from "@/context/AuthContext";
import { confirmEmailChange } from "@/lib/account";
import Link from "next/link";
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";


export default function ConfirmEMailChange() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const {refresh} = useAuth();
    const [status, setStatus] = useState<"loading" | "success" | "error">(
        token ? "loading" : "error"
    );

    const [message, setMessage] = useState(token ? "": "Missing confirmation")

    useEffect(() => {
        if (!token) return;

        confirmEmailChange(token)
            .then(async(data) => {
                await refresh();
                setStatus("success");
                setMessage(data.message);
            })
            .catch((err) => {
                setStatus("error");
                setMessage(err.response?.data?.message || "Confirmation failed.")
            })

    }, [token, refresh])

    return (
        <div className="flex min-h-screen items-center justify-center p-8">
            <div className="max-w-sm text-center">
                {status === "loading" && <p>Confirming your email...</p>}
                {status === "success" && (
                    <>
                        <h1 className="text-2xl font-bold mb-2"> Email update</h1>
                        <p className="text-muted-foreground mb-4"> {message}</p>
                        <Link href="/account" className="text-primary hover:underline">Back to account settings</Link>
                    </>
                )}
                {status === "error" && (
                    <>
                        <h1 className="text-2xl font-bold mb-2"> Confirmation failed</h1>
                        <p className="text-muted-foreground">{message}</p>
                    </>
                )}

            </div>
        </div>
    )

}