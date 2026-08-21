"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, KeyRound, Mail, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { changePassword, changeUsername, requestEmailChange } from "@/lib/account";
import PasswordRequirements, { isPasswordValid } from "@/components/PasswordRequirements";

export default function AccountSettingsPage() {
    const { user, refresh } = useAuth();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [username, setUsername] = useState(user?.username ?? "");
    const [usernameLoading, setUsernameLoading] = useState(false);

    const [newEmail, setNewEmail] = useState("");
    const [emailCurrentPassword, setEmailCurrentPassword] = useState("");
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailRequested, setEmailRequested] = useState(false);
    const [showEmailPassword, setShowEmailPassword] = useState(false);

    const errorMessage = (e: unknown) => {
        const axiosErr = e as { response?: { data?: { message?: string } } };
        return axiosErr.response?.data?.message || "Something went wrong";
    };

    const handlePasswordSubmit = async () => {
        setPasswordLoading(true);
        try {
            await changePassword(currentPassword, newPassword);
            toast.success("Password updated");
            setCurrentPassword("");
            setNewPassword("");
        } catch (e) {
            toast.error(errorMessage(e));
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleUsernameSubmit = async () => {
        setUsernameLoading(true);
        try {
            await changeUsername(username);
            await refresh();
            toast.success("Username updated");
        } catch (e) {
            toast.error(errorMessage(e));
        } finally {
            setUsernameLoading(false);
        }
    };

    const handleEmailSubmit = async () => {
        setEmailLoading(true);
        try {
            await requestEmailChange(newEmail, emailCurrentPassword);
            setEmailRequested(true);
            setEmailCurrentPassword("");
        } catch (e) {
            toast.error(errorMessage(e));
        } finally {
            setEmailLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-6 md:px-14 pb-16">
            <div className="max-w-xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-10">
                    <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground font-semibold text-xl flex items-center justify-center shrink-0">
                        {user?.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="uppercase font-other text-xs tracking-wide text-muted-foreground mb-1">Your Account</p>
                        <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                            Account <span className="text-primary glow-text">Settings</span>
                        </h1>
                    </div>
                </div>

                <div className="flex flex-col gap-5">
                    {/* Username */}
                    <section className="glass rounded-3xl p-6">
                        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                            Username
                        </h2>
                        <div className="flex flex-col gap-3">
                            <div className="relative flex items-center">
                                <User className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="bg-background border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm w-full outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <button
                                onClick={handleUsernameSubmit}
                                disabled={usernameLoading || !username.trim() || username === user?.username}
                                className="self-end bg-primary text-primary-foreground rounded-full px-5 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                            >
                                {usernameLoading ? "Saving..." : "Save username"}
                            </button>
                        </div>
                    </section>

                    {/* Password */}
                    <section className="glass rounded-3xl p-6">
                        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                            Change password
                        </h2>
                        <div className="flex flex-col gap-3">
                            <div className="relative flex items-center">
                                <KeyRound className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    placeholder="Current password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    autoComplete="current-password"
                                    className="bg-background border border-border rounded-lg pl-10 pr-10 py-2.5 text-sm w-full outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword((v) => !v)}
                                    aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                                    tabIndex={-1}
                                    className="absolute right-3 text-muted-foreground hover:text-foreground"
                                >
                                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <div className="relative flex items-center">
                                <KeyRound className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="New password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    autoComplete="new-password"
                                    className="bg-background border border-border rounded-lg pl-10 pr-10 py-2.5 text-sm w-full outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword((v) => !v)}
                                    aria-label={showNewPassword ? "Hide password" : "Show password"}
                                    tabIndex={-1}
                                    className="absolute right-3 text-muted-foreground hover:text-foreground"
                                >
                                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <PasswordRequirements password={newPassword} />
                            <button
                                onClick={handlePasswordSubmit}
                                disabled={passwordLoading || !currentPassword || !isPasswordValid(newPassword)}
                                className="self-end bg-primary text-primary-foreground rounded-full px-5 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                            >
                                {passwordLoading ? "Saving..." : "Update password"}
                            </button>
                        </div>
                    </section>

                    {/* Email */}
                    <section className="glass rounded-3xl p-6">
                        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                            Email address
                        </h2>
                        <p className="text-sm text-muted-foreground mb-4">Current: {user?.email}</p>

                        {emailRequested ? (
                            <p className="text-sm text-primary">
                                Check your new inbox for a confirmation link. Your login email won&apos;t change until you click it.
                            </p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <div className="relative flex items-center">
                                    <Mail className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                                    <input
                                        type="email"
                                        placeholder="New email address"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        className="bg-background border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm w-full outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="relative flex items-center">
                                    <KeyRound className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                                    <input
                                        type={showEmailPassword ? "text" : "password"}
                                        placeholder="Current password"
                                        value={emailCurrentPassword}
                                        onChange={(e) => setEmailCurrentPassword(e.target.value)}
                                        autoComplete="current-password"
                                        className="bg-background border border-border rounded-lg pl-10 pr-10 py-2.5 text-sm w-full outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowEmailPassword((v) => !v)}
                                        aria-label={showEmailPassword ? "Hide password" : "Show password"}
                                        tabIndex={-1}
                                        className="absolute right-3 text-muted-foreground hover:text-foreground"
                                    >
                                        {showEmailPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                <button
                                    onClick={handleEmailSubmit}
                                    disabled={emailLoading || !newEmail.trim() || !emailCurrentPassword}
                                    className="self-end bg-primary text-primary-foreground rounded-full px-5 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                                >
                                    {emailLoading ? "Sending..." : "Send confirmation link"}
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}

