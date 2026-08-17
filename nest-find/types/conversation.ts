export type Conversation = {
    _id: string;
    listing?: {
        _id: string;
        title: string;
        images: string[];
    };
    participants: {
        _id: string;
        username: string;
        email: string;
    }[];
    lastMessage?: string;
    lastMessageAt?: string;
    createdAt: string;
    updatedAt: string;
};

export type Message = {
    _id: string;
    conversation: string;
    sender: string;
    text: string;
    createdAt: string;
};
