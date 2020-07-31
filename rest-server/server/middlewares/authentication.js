const jwt = require('jsonwebtoken');

// VALIDATE TOKEN

const validateToken = (req, res, next) => {
  const token = (req.get('Authorization') || '').replace('Bearer', '').trim();

  jwt.verify(token, process.env.TOKEN_SECRET, (error, result) => {
    if (error) {
      return res.status(401).json({
        success: false,
        error: 'invalid token',
      });
    }

    const { user = {} } = result;

    const locales = {
      ...req.locales,
      user,
    };

    res.locales = locales;

    next();
  });
};

module.exports = {
  validateToken,
};
