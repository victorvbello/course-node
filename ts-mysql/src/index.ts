import Server from './server/server';
import Router from './router/router';

const port: number = Number(process.env.PORT) || 3000;

const server = Server.init(port);
server.app.use(Router);

server.start(() => {
  console.log(`Server is running in port ${port}`);
});
