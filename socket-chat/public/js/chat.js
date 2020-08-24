const socket = io();

const searchParams = new URLSearchParams(window.location.search);
if (!searchParams.has('name') || !searchParams.get('room')) {
  window.location = 'index.html';
  throw new Error('Name or Room is required');
}

const userName = searchParams.get('name');
const room = searchParams.get('room');

if (!userName || !room) {
  window.location = 'index.html';
  throw new Error('Name or Room is required');
}

const currentUser = {
  name: userName,
  room,
};

const sendNewMessage = (to = '', message = '') => {
  socket.emit('new-message', { to, message });
};

window.sendNewMessage = sendNewMessage;

const initSocket = () => {
  socket.on('connect', () => {
    console.log('Server connection On');
    socket.emit('user-signing', currentUser, (response) => {
      console.log('user-signing', response);
    });
  });

  socket.on('server-info', (message = {}) => {
    console.log('server:', message);
  });

  socket.on('disconnect', () => {
    console.log('Server connection Off');
  });

  socket.on('new-message', (response) => {
    console.log('server:', response);
  });

  socket.on('user-list', (response) => {
    console.log('server:', response);
  });
};

initSocket();
