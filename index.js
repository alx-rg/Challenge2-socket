const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Define the users array
const users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  io.emit('user entered');
  socket.on('sendNickname', (username) => {
    socket.username = username; // assign the username
    users.push(socket.username);
  });
  socket.on('chat message', (msg) => {
    io.emit('chat message', { message: msg, username: socket.username });
  });
  socket.on('disconnect', () => {
    io.emit('user left');
    // Remove the disconnected user from the users array
    const index = users.indexOf(socket.username);
    if (index !== -1) {
      users.splice(index, 1);
    }
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
