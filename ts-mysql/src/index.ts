import dotenv from 'dotenv';
import Server from './server/server';
import Router from './router/router';
import Mysql from './mysql/mysql';

dotenv.config({path: __dirname + '/.env'})

const port: number = Number(process.env.PORT) || 3000;

const server = Server.init(port);
server.app.use(Router);

Mysql.instance;

server.start(() => {
  console.log(`Server: is running in port ${port}`);
});
