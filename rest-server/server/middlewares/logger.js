const logger = {
  log: (name = '', payload = {}) => {
    console.log(name, payload);
  },
  error: (name = '', payload = {}) => {
    console.log(`Error: ${name}`, payload);
  },
};

module.exports = (_req, res, next) => {
  res.locales = {
    ...res.locales,
    logger,
  };
  next();
};
