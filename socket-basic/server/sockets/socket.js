module.exports = (IO) => {
  IO.on('connection', (client) => {
    console.log('Client connected');
    client.emit('server_info', {
      message: 'Welcome',
    });
    client.on('disconnect', () => {
      console.log('Client disconnected');
    });
    client.on('send_message', (message = {}, callback = () => {}) => {
      const { name = '' } = message;
      console.log('send_message:',message);
      if (name === 'test') {
        callback({ success: true });
        return;
      }
      callback({ success: false });
      return;
    });
    client.on('send_all_message', (message = {}) => {
      console.log('send_all_message:',message);
      client.broadcast.emit('send_all_message', message);
    });
  });
};
