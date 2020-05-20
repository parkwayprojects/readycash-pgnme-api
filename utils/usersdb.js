const mysql = require('mysql');
const util = require('util');
require('dotenv').config({ path: 'variables.env'})

const config = {
  host: process.env.HOST2,
  port:process.env.DB_PORT2,
  user: process.env.USER2,
  password: process.env.PASSWORD2,
  database: process.env.DATABASE2,
  connectionLimit : 10,
}

const database  = mysql.createPool(config)

const query = util.promisify(database.query).bind(database);

module.exports = query;