import { io, Socket} from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = () => {
    if (socket?.connected) return socket;

    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
        withCredentials: true,
    });

    return socket;
};

export const disconnectSocket = () => {
    socket?.disconnect();
    socket = null;
}

export const getSocket = () => socket;