import api from "@/lib/api";
import type { Conversation, Message } from "@/types/conversation";

export const startConversation = async (listingId: string, sellerId: string): Promise<Conversation> => {
    const res = await api.post<{ conversation: Conversation }>("/api/conversations", { listingId, sellerId });
    return res.data.conversation;
};

export const fetchConversations = async (signal?: AbortSignal): Promise<Conversation[]> => {
    const res = await api.get<{ conversations: Conversation[] }>("/api/conversations", { signal });
    return res.data.conversations;
};

export const fetchMessages = async (conversationId: string, signal?: AbortSignal): Promise<Message[]> => {
    const res = await api.get<{ messages: Message[] }>(`/api/conversations/${conversationId}/messages`, { signal });
    return res.data.messages;
};
