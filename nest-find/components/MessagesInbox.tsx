"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { fetchConversations } from "@/lib/conversations";
import type { Conversation } from "@/types/conversation";

const formatConversationTime = (dateString: string) => {
    const date = new Date(dateString);
    const isToday = date.toDateString() === new Date().toDateString();

    return isToday
        ? new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(date)
        : new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
};


export default function MessagesInbox({ basePath }: { basePath: string }) {
    // No clearUnread() here on purpose - just glancing at the list of
    // conversations shouldn't mark anything read, only opening one should.
    const { user, unreadConversationIds } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        fetchConversations(controller.signal)
            .then(setConversations)
            .catch((e) => {
                if (e && typeof e === "object" && "code" in e && e.code === "ERR_CANCELED") return;
                console.error("Error fetching conversations", e);
                toast.error("Failed to load messages");
            })
            .finally(() => setLoading(false));
        return () => controller.abort();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold text-background mb-6">Messages</h1>

            {loading ? (
                <p className="text-muted-foreground text-sm">Loading...</p>
            ) : conversations.length === 0 ? (
                <div className="text-center py-24 space-y-3">
                    <p className="text-4xl">💬</p>
                    <h3 className="font-semibold text-background">No conversations yet</h3>
                    <p className="text-muted-foreground text-sm">
                        Message a seller from any listing to start a conversation.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {conversations.map((conversation) => {
                        const otherPerson = conversation.participants.find(
                            (p) => p._id !== user?.id
                        );
                        const isUnread = unreadConversationIds.has(conversation._id);
                        return (
                            <Link
                                key={conversation._id}
                                href={`${basePath}/${conversation._id}`}
                                className="bg-background flex items-center gap-4 rounded-2xl p-4 hover:shadow-accent hover:-translate-y-1 transition-colors mt-3"
                            >
                                <div className="h-11 w-11 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center shrink-0">
                                    {otherPerson?.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        {isUnread && (
                                            <span className="h-2 w-2 rounded-full bg-primary shrink-0" aria-label="Unread" />
                                        )}
                                        <p className="font-semibold truncate">{otherPerson?.username}</p>
                                    </div>
                                    {conversation.lastMessageAt && (
                                            <span className="text-xs text-muted-foreground shrink-0">
                                                {formatConversationTime(conversation.lastMessageAt)}
                                            </span>
                                    )}
                                    {conversation.listing && (
                                        <p className="text-xs text-primary truncate">
                                            Re: {conversation.listing.title}
                                        </p>
                                    )}
                                    <p className={`text-sm truncate ${isUnread ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                                        {conversation.lastMessage ?? "No messages yet"}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
