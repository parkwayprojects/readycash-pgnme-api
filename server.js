const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan')
const transactionRouter = require('./routers/transactionRouter')
const agnetRouter = require('./routers/agentRouter')
const {register, login} = require('./controllers/userController')
const { registerValidation, loginValidation } = require('./validations/register')
const { protect } = require('./utils/auth')
const {catchAsync } = require('./handlers/errorHandler')
const errors = require('./handlers/errorHandler')
require('dotenv').config({ path: 'variables.env'})


const app = express();

app.disable('x-powered-by');

app.use(cors());
app.use(morgan('combined'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}))



app.post('/api/register',registerValidation, catchAsync(register))
app.post('/api/login', loginValidation, catchAsync(login))


app.use('/api', catchAsync(protect))

app.use('/api/transactions', transactionRouter)
app.use('/api/agents', agnetRouter)


app.all('*', errors.notFound)

app.use(errors.productionErrors)


const start = () => {
  app.listen(process.env.PORT || 3000, () => {console.log("server started 🎇🎇🎇🎇🎇"); })
}


module.exports = {
  app,
  start
}