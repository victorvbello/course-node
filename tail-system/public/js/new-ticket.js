const socket = io();

const newTicketButton = document.getElementById('make-new-ticket');
const labelNewTicket = document.getElementById('lbl-new-ticket');

const initSocket = () => {
  socket.on('connect', () => {
    console.log('Socket:', 'Connection On');
  });

  socket.on('disconnect', () => {
    console.log('Socket:', 'Connection Off');
  });
};

newTicketButton.addEventListener('click', () => {
  socket.emit('next-ticket', null, (response) => {
    labelNewTicket.innerHTML = response;
  });
  console.log('Socket:', 'Send next-ticket');
});

initSocket();
