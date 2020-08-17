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
      const nextTicket = counterTicket.next();
      console.log(nextTicket);
      callback(nextTicket);
    });
  });
};
