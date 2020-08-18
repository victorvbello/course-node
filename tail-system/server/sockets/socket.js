const CounterTicket = require('../classes/CounterTicket');

module.exports = (IO) => {
  const counterTicket = new CounterTicket();
  IO.on('connection', (client) => {
    console.log('Client connected');
    client.emit('server_info', {
      message: 'Welcome',
    });
    client.on('disconnect', () => {
      console.log('Client disconnected');
    });
    client.on('next-ticket', (_, callback = () => {}) => {
      const nextTicket = counterTicket.nextTicket();
      console.log(nextTicket);
      callback(nextTicket);
    });
    client.emit('current-ticket', {
      current: counterTicket.currentTicket(),
    });
    client.on('take-ticket', (message = {}, callback = () => {}) => {
      const { desktop = 0 } = message;
      if (!desktop) {
        return callback({
          error: true,
          message: 'Desktop is required',
        });
      }
      const ticket = counterTicket.takeTicket(desktop);
      callback(ticket);
    });
  });
};
