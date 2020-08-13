const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');

const socket = require('./sockets');

const app = express();
const server = http.createServer(app);
const IO = socketIO(server);

// enabled socket
socket(IO);

const { PORT = 3000 } = process.env;
const publicPath = path.resolve(__dirname, '../public');

app.use(express.static(publicPath));


server.listen(PORT, (error) => {
  if (error) throw new Error(error);
  console.log(`Server run on port ${PORT}`);
});
