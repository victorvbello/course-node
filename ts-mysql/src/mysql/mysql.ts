import Mysql from 'mysql';

export default class DB {
  private static _instance: DB;

  cnn: Mysql.Connection;
  connected: boolean = false;

  constructor() {
    this.cnn = Mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
      database: process.env.MYSQL_DB,
    });
    this.connect();
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  public static exe(query: string, callback: Function) {
    this.instance.cnn.query(query, (error: any, results: Object[], fields) => {
      if (error) {
        console.log('DB:', error);
        return callback('Error on run query');
      }
      if(!results.length){
        console.log('DB:', 'result is empty');
        return callback('Error with no results');
      }
      callback(null, results);
    });
  }

  private connect() {
    this.cnn.connect((error: Mysql.MysqlError) => {
      if (error) {
        console.log(error);
        return;
      }
      this.connected = true;
      console.log('DB: connected');
    });
  }
}
