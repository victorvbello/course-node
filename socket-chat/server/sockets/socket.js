const UserModelClass = require('../models/user');
const User = require('../classes/User');
const { makeChatMessage } = require('../util/util');

const SOCKET_CONNECTION = 'connection';
const SERVER_INFO = 'server-info';
const NEW_MESSAGE = 'new-message';
const USER_LIST = 'user-list';
const USER_SIGNING = 'user-signing';
const DISCONNECT = 'disconnect';

const UserModel = new UserModelClass();

module.exports = (IO) => {
  IO.on(SOCKET_CONNECTION, (client) => {
    const handleConnection = () => {
      console.log('Client connected');
      client.emit(SERVER_INFO, { message: 'Welcome' });
    };

    const handleDisconnect = () => {
      const userRemoved = UserModel.removeBySocketId(client.id);
      const { name: userName = '', room = '' } = userRemoved;
      client.broadcast.to(room).emit(NEW_MESSAGE, {
        success: true,
        ...makeChatMessage('Admin', `${userName} left chat`),
      });
      client.broadcast.to(room).emit(USER_LIST, {
        success: true,
        users: UserModel.all(),
      });
      console.log('Client disconnected');
    };

    const handleChatSigning = (newUser = {}, callback = () => {}) => {
      const { name: userName = '', room = '' } = newUser;
      if (!userName) {
        return callback({ success: false, message: 'User name is required' });
      }
      if (!room) {
        return callback({ success: false, message: 'Room is required' });
      }
      client.join(room);
      const user = new User(client.id, userName, room);
      UserModel.add(user);
      const users = UserModel.all();
      client.broadcast.to(room).emit(USER_LIST, { success: true, users });
      callback({ success: true, users });
    };

    const handleNewMessage = (data = {}) => {
      const { to = '', message = '' } = data;
      const user = UserModel.findBySocketId(client.id);
      const { name: userName = '', room = '' } = user;
      const body = {
        success: true,
        ...makeChatMessage(userName, message),
      };
      if (!to) {
        client.broadcast.to(room).emit(NEW_MESSAGE, body);
        return;
      }
      client.broadcast.to(to).emit(NEW_MESSAGE, body);
    };

    client.on(DISCONNECT, handleDisconnect);
    client.on(USER_SIGNING, handleChatSigning);
    client.on(NEW_MESSAGE, handleNewMessage);
    handleConnection();
  });
};
