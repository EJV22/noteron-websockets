import { WebSocket, WebSocketServer } from 'ws';

function sendJson(socket, payload) {
    if (socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify(payload));
}

function broadcast(wss, payload) {
    for (const client of wss.clients) {
        if (client.readyState !== WebSocket.OPEN) continue;

        client.send(JSON.stringify(payload));
    }
}

const HEARTBEAT_INTERVAL_MS = 30_000;

export function attachWebSocketServer(server) {
    const wss = new WebSocketServer({
        server,
        path: '/ws',
        maxPayload: 1024 * 1024,
    });

    wss.on('connection', (socket) => {
        socket.isAlive = true;

        socket.on('pong', () => {
            socket.isAlive = true;
        });

        sendJson(socket, { type: 'welcome' });

        socket.on('error', console.error);
    });

    const heartbeat = setInterval(() => {
        for (const socket of wss.clients) {
            if (socket.isAlive === false) {
                socket.terminate();
                continue;
            }

            socket.isAlive = false;
            socket.ping();
        }
    }, HEARTBEAT_INTERVAL_MS);

    wss.on('close', () => clearInterval(heartbeat));

    function broadcastMatchCreated(match) {
        broadcast(wss, { type: 'match_created', data: match });
    }

    return { broadcastMatchCreated };
}