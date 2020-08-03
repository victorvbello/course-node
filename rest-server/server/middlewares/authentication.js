const jwt = require('jsonwebtoken');

const { USER_ROLE, ADMIN_ROLE } = require('../constants/roles');

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

const validateAdminRole = (req, res, next) => {
  const { locales: { user: { role = '' } = {} } = {} } = res;

  if (role !== ADMIN_ROLE) {
    return res.status(401).json({
      success: false,
      error: 'not admin user',
    });
  }

  next();
};

module.exports = {
  validateToken,
  validateAdminRole,
};
