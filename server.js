const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan')
const transactionRouter = require('./routers/transactionRouter')
const agnetRouter = require('./routers/agentRouter')
require('dotenv').config({ path: 'variables.env'})

const app = express();

app.disable('x-powered-by');

app.use(cors());
app.use(morgan('combined'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}))




app.use('/api/transactions', transactionRouter)
app.use('/api/agents', agnetRouter)


const start = () => {
  app.listen(process.env.PORT || 3000, () => {console.log("server started 🎇🎇🎇🎇🎇"); })
}


module.exports = {
  app,
  start
}