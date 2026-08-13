import { io, Socket } from 'socket.io-client';
import { API_ROOT_URL } from '../constants/apiConfig';

class SocketService {
    private socket: Socket | null = null;

    connectSocket(token: string) {
        if (this.socket?.connected) return this.socket;

        this.socket = io(API_ROOT_URL, {
            transports: ['websocket'],
            auth: { token },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.socket.on('connect_error', (err) => {
            console.log('Socket connect_error:', err?.message || err);
        });

        return this.socket;
    }

    disconnectSocket() {
        this.socket?.disconnect();
        this.socket = null;
    }

    isConnected() {
        return Boolean(this.socket?.connected);
    }

    emit(event: string, payload?: any) {
        if (!this.socket) {
            console.log(`socketService.emit("${event}") called before connectSocket()`);
            return;
        }
        this.socket.emit(event, payload);
    }

    on(event: string, callback: (...args: any[]) => void) {
        this.socket?.on(event, callback);
    }

    off(event: string, callback?: (...args: any[]) => void) {
        if (callback) {
            this.socket?.off(event, callback);
        } else {
            this.socket?.off(event);
        }
    }
}

export const socketService = new SocketService();