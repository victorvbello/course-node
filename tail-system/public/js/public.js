const socket = io();

const currentTicket = document.getElementById('lbl-current-ticket');
const currentDesktop = document.getElementById('lbl-current-desktop');
const ticketList = document.querySelector('.list-ticket');

const ticketString = (number = 0) => `Ticket ${number}`;

const desktopString = (desktop = 0) => `Desktop ${desktop}`;

const htmlTicket = (number = 0, desktop = 0) => {
  const row = document.createElement('tr');
  const colum = document.createElement('td');
  const tickerSpan = document.createElement('span');
  tickerSpan.classList.add('secondary-ticket');
  tickerSpan.innerHTML = ticketString(number);
  const desktopSpan = document.createElement('span');
  desktopSpan.innerHTML = desktopString(desktop);
  colum.appendChild(tickerSpan);
  colum.appendChild(document.createElement('br'));
  colum.appendChild(desktopSpan);
  row.appendChild(colum);
  return row;
};

const initSocket = () => {
  socket.on('connect', () => {
    console.log('Socket:', 'Connection On');
  });

  socket.on('disconnect', () => {
    console.log('Socket:', 'Connection Off');
  });

  socket.on('taken-tickets', (message = {}) => {
    const { takenTickets = [] } = message;
    const [firstTicket = {}, ...restTickets] = takenTickets;
    const { number = 0, desktop = 0 } = firstTicket;
    currentTicket.innerHTML = ticketString(number);
    currentDesktop.innerHTML = desktopString(desktop);
    if (restTickets.length) {
      ticketList.querySelectorAll('*').forEach((n) => n.remove());
    }
    restTickets.forEach((ticket = {}) => {
      const { number = 0, desktop = 0 } = ticket;
      ticketList.appendChild(htmlTicket(number, desktop));
    });
    const notification = new Audio('sounds/notification.mp3');
    notification.play();
  });
};

initSocket();
