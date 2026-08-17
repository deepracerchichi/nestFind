"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { getCurrentUser, logoutUser } from "@/lib/auth";
import type { User } from "@/types/auth";
import type { Message } from "@/types/conversation";
import {connectSocket, disconnectSocket, getSocket} from "@/lib/socket";

type AuthContextValue = {
    user: User | null;
    refresh: () => Promise<void>;
    logout: () => Promise<void>;
    unreadCount: number;
    unreadConversationIds: Set<string>;
    clearUnread: (conversationId?: string) => void;
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
    // Which conversations have an unread message, not just how many total -
    // this is what lets the inbox mark specific rows, and what lets opening
    // one conversation clear only that one instead of everything at once.
    const [unreadConversationIds, setUnreadConversationIds] = useState<Set<string>>(new Set());

    const refresh = useCallback(async () => {
        const current = await getCurrentUser();
        setUser(current);
        if (!current) setUnreadConversationIds(new Set());
    }, []);

    const logout = useCallback(async () => {
        await logoutUser();
        setUser(null);
        setUnreadConversationIds(new Set());
    }, []);

    // No id = clear everything (used on logout-adjacent resets); an id =
    // clear just that one conversation (used when you actually open it).
    const clearUnread = useCallback((conversationId?: string) => {
        setUnreadConversationIds((current) => {
            if (!conversationId) return new Set();
            if (!current.has(conversationId)) return current;
            const next = new Set(current);
            next.delete(conversationId);
            return next;
        });
    }, []);

    useEffect(() => {
        if (user) {
            connectSocket();
        } else {
            disconnectSocket();
        }
    }, [user]);

    useEffect(() => {
        if (!user) return;

        const socket = getSocket();
        if (!socket) return;

        const handleNewMessage = (message: Message) => {
            if (message.sender === user.id) return; // don't badge your own sent messages
            setUnreadConversationIds((current) => new Set(current).add(message.conversation));
        };

        socket.on("newMessage", handleNewMessage);
        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [user]);

    return (
        <AuthContext.Provider
            value={{
                user,
                refresh,
                logout,
                unreadCount: unreadConversationIds.size,
                unreadConversationIds,
                clearUnread,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
