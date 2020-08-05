const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const getAccountInfo = async (token = '') => {
  let errors = {};
  const ticket = await client
    .verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    .catch((e) => {
      errors = e;
      return null;
    });
  if (!ticket) {
    return { error: true, errors };
  }
  const payload = ticket.getPayload();

  const { name = '', email, picture = '' } = payload;

  return {
    data: {
      name,
      email,
      img: picture,
    },
  };
};

module.exports = {
  getAccountInfo,
};
