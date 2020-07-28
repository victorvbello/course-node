// PORT

process.env.PORT = process.env.PORT || 3000;

//ENVIRONMENT

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//ENVIRONMENT

process.env.URl_DB = 'mongodb://localhost:27017/coffee';

if (process.env.NODE_ENV !== 'dev') {
  process.env.URl_DB = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.uvfwh.mongodb.net/coffee`;
}
