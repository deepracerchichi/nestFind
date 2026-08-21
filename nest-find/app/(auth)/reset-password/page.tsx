"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/auth";
import PasswordRequirements, {isPasswordValid} from "@/components/PasswordRequirements";
export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!token) {
            setError("Missing reset token.");
            return;
        }

        setError("");
        setLoading(true);
        try {
            await resetPassword(token, newPassword);
            router.push("/login");
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            setError(axiosErr.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-8">
            <div className="w-full max-w-sm">
                <h1 className="text-3xl mb-1">Set a new password</h1>
                <p className="text-sm text-muted-foreground mb-6">
                    Choose a new password for your account.
                </p>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <div className="flex flex-col gap-4">
                    <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoComplete="new-password"
                        className="font-medium border-b-2 p-2 w-full focus:outline-none focus:border-primary"
                    />

                    <PasswordRequirements password={newPassword} />

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !isPasswordValid(newPassword)}
                        className="bg-primary text-primary-foreground rounded-full p-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                        {loading ? "Resetting..." : "Reset password"}
                    </button>
                </div>
            </div>
        </div>
    );
}
