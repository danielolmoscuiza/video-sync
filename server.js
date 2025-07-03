const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let videoState = {
    time: 0,
    paused: true,
};

io.on('connection', (socket) => {
    // Enviar estado actual al nuevo usuario
    socket.emit('sync', videoState);

    // Recibir eventos de cambios en el video
    socket.on('video-event', (data) => {
        videoState = { ...videoState, ...data };
        // Avisar a todos MENOS al emisor
        socket.broadcast.emit('video-event', data);
    });
});

app.use(express.static('public'));

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});