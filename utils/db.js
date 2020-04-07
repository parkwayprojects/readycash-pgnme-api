const mysql = require('mysql');
const util = require('util');
require('dotenv').config({ path: 'variables.env'})

const config = {
  host: process.env.HOST,
  port:process.env.DB_PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
}


const database = mysql.createConnection(config);

const query = util.promisify(database.query).bind(database);

module.exports = query;