import { io } from 'socket.io-client';

// Use env var or default to localhost:3000
const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000';

export const socket = io(SOCKET_URL, {
    autoConnect: false, // We connect manually when needed
    transports: ['websocket'], // Force websocket for speed
});