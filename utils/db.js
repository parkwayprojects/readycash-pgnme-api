const mysql = require('mysql');
const util = require('util');
require('dotenv').config({ path: 'variables.env'})

const config = {
  host: process.env.HOST,
  port:process.env.DB_PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  connectionLimit : 10,
}


//const database = mysql.createConnection(config);
const database = mysql.createPool(config);

/* database.getConnection((err, connection) => {
  if(err) throw err;
  console.log('connected', connection)
}) */

const query = util.promisify(database.query).bind(database);

module.exports = query;