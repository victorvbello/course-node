// PORT

process.env.PORT = process.env.PORT || 3000;

// ENVIRONMENT

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// MONGODB

process.env.URl_DB = 'mongodb://localhost:27017/coffee';

if (process.env.NODE_ENV !== 'dev') {
  process.env.URl_DB = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.uvfwh.mongodb.net/coffee`;
}

// TOKEN SECRET

process.env.TOKEN_SECRET = process.env.TOKEN_SECRET || 'aRtqmhw9c2jP8U53';

// TOKEN EXPIRES

process.env.TOKEN_EXPIRES = 60 * 60 * 24 * 30;
