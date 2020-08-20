const UserModelClass = require('../models/user');
const User = require('../classes/User');

const UserModel = new UserModelClass();

module.exports = (IO) => {
  IO.on('connection', (client) => {
    console.log('Client connected');
    client.emit('server_info', {
      message: 'Welcome',
    });
    client.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};
