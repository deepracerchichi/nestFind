"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getSocket } from "@/lib/socket";
import { fetchMessages, fetchConversations } from "@/lib/conversations";
import type { Message, Conversation } from "@/types/conversation";

const formatMessageTime = (dateString: string) =>
    new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(dateString));


export default function ChatWindow({ backHref }: { backHref: string }) {
    const { user, clearUnread } = useAuth();
    const { id } = useParams();
    const conversationId = id as string;

    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        clearUnread(conversationId);
    }, [clearUnread, conversationId]);

    useEffect(() => {
        const controller = new AbortController();

        Promise.all([
            fetchMessages(conversationId, controller.signal),
            fetchConversations(controller.signal),
        ])
            .then(([msgs, conversations]) => {
                setMessages(msgs);
                setConversation(conversations.find((c) => c._id === conversationId) ?? null);
            })
            .catch((e) => {
                if (e && typeof e === "object" && "code" in e && e.code === "ERR_CANCELED") return;
                console.error("Error loading conversation", e);
                toast.error("Failed to load conversation");
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [conversationId]);

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const handleNewMessage = (message: Message) => {
            if (message.conversation !== conversationId) return;
            setMessages((current) => [...current, message]);
            clearUnread(conversationId); // already looking at it - never show it as unread
        };

        socket.on("newMessage", handleNewMessage);
        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [conversationId, clearUnread]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;

        getSocket()?.emit("sendMessage", { conversationId, text: trimmed });
        setText("");
    };

    const otherPerson = conversation?.participants.find((p) => p._id !== user?.id);

    if (loading) {
        return <p className="text-muted-foreground text-sm">Loading...</p>;
    }

    return (
        <div className="flex flex-col">
            <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-background mb-4">
                <ArrowLeft size={15} /> Back to Messages
            </Link>

            <div className="mb-4">
                <h1 className="text-xl font-bold text-background">{otherPerson?.username ?? "Conversation"}</h1>
                {conversation?.listing && (
                    <p className="text-xs text-primary">Re: {conversation.listing.title}</p>
                )}
            </div>

            <div className="h-[60vh] overflow-y-auto glass rounded-2xl p-4 space-y-3 mb-4">
                {messages.length === 0 ? (
                    <p className="text-center text-muted-foreground text-sm py-10">
                        No messages yet - say hello.
                    </p>
                ) : (
                    messages.map((message) => {
                        const isMine = message.sender === user?.id;
                        return (
                            <div key={message._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                                        isMine
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-background border border-border"
                                    }`}
                                >
                                    {message.text}
                                    <p className={`text-[10px] mt-1 ${isMine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                        {formatMessageTime(message.createdAt)}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="flex gap-2">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-background border border-border rounded-full px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                    type="submit"
                    className="bg-primary text-primary-foreground h-10 w-10 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity shrink-0"
                >
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
}
