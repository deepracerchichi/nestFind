"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { getCurrentUser, logoutUser } from "@/lib/auth";
import type { User } from "@/types/auth";

type AuthContextValue = {
    user: User | null;
    refresh: () => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({
    children,
    initialUser = null,
}: {
    children: ReactNode;
    initialUser?: User | null;
}) {
    // Seeded from a Server Component that already read the session cookie,
    // so there's no loading state to track and no logged-out flash on first paint.
    const [user, setUser] = useState<User | null>(initialUser);

    const refresh = useCallback(async () => {
        const current = await getCurrentUser();
        setUser(current);
    }, []);

    const logout = useCallback(async () => {
        await logoutUser();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, refresh, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
