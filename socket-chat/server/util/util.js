const makeChatMessage = (userName = '', message = '', admin = false) => ({
  message: {
    userName,
    message,
    date: new Date().getTime(),
    admin,
  },
});

module.exports = {
  makeChatMessage,
};
