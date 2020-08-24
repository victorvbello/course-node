const makeChatMessage = (userName = '', message = '') => ({
  userName,
  message,
  date: new Date().getTime(),
});

module.exports = {
  makeChatMessage,
};
