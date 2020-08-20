class User {
  constructor(socketId = '', name = '', room = '') {
    this.socketId = socketId;
    this.name = name;
    this.room = room;
  }
  getSocketId() {
    return this.socketId;
  }
  getName() {
    return this.name;
  }
  getRoom() {
    return this.room;
  }
}

module.exports = User;
