const socket = io();

const newCallButton = document.getElementById('call-next');
const currentDesktop = document.getElementById('desktop-number');
const currentTicket = document.getElementById('current-call');

const initSocket = () => {
  socket.on('connect', () => {
    console.log('Socket:', 'Connection On');
  });

  socket.on('disconnect', () => {
    console.log('Socket:', 'Connection Off');
  });
};

const searchParams = new URLSearchParams(window.location.search);
if (!searchParams.has('desktop')) {
  window.location = 'index.html';
  throw new Error('Desktop is required');
}

const desktop = searchParams.get('desktop');
currentDesktop.innerHTML = desktop;

newCallButton.addEventListener('click', () => {
  socket.emit('take-ticket', { desktop }, (response) => {
    const { number = 0 } = response;
    if (!number) {
      alert(response);
      currentTicket.innerHTML = response;
      return;
    }
    currentTicket.innerHTML = number;
  });
  console.log('Socket:', 'take-ticket');
});

initSocket();
