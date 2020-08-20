class UserModel {
  constructor() {
    this.list = [];
  }
  all() {
    return this.list;
  }
  findBySocketId(id = '') {
    return this.list.find((user = {}) => {
      const { socketId: currentId = '' } = user;
      return currentId === id;
    });
  }
  findByRoom(room = '') {}
  add(user = {}) {
    this.list.push(user);
  }
  removeBySocketId(id = '') {
    const userRemoved = this.findBySocketId(id);
    this.list = this.list.filter((user = {}) => {
      const { socketId: currentId = '' } = user;
      return currentId !== id;
    });
    return userRemoved;
  }
}

module.exports = UserModel;
