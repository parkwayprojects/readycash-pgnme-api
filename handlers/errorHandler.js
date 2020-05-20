const ApiError = require('./apiError')

const validationError = err => {
  const message = err.errors[0].message
  return new ApiError(message, 400)
}

const tokenExpiredError = () => {
  return new ApiError('token expired', 401)
}

const invalidToken = () => {
  return new ApiError('invalid token', 401)
}

const sendProdErrors = (err, res) => {
  err.status = err.status || 'error'
  res.status(err.code || 500)
//  console.log(err)
  if (err.isOperational) {
   res.json({
      status: err.status,
      message: err.message,
    })
  } else {
   // console.error('ERROR 🤬', err)
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    })
  }
}

module.exports.catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

module.exports.notFound = (req, res, next) => {
  next(new ApiError(`route ${req.originalUrl} does not exist`, 404))
}

module.exports.devErrors = (err, req, res, next) => {
//  console.log('myswl', err.code)
  if(err.code === 'ER_DUP_ENTRY') {
    res.status(422)
    res.json({
      message: 'email must be unique'
    })
   
  }
  err.status = err.status || 'error'
  res.status(err.code || 500)
  res.json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  })
}

module.exports.productionErrors = (err, req, res, next) => {

  if (err.code === 'ER_DUP_ENTRY') {
    res.status(422)
    res.json({
      message: 'email must be unique'
    })
    return
  }

  if (err.name === 'TokenExpiredError') {
    sendProdErrors(tokenExpiredError(), res)
    return
  }
  if (err.name === 'JsonWebTokenError') {
    sendProdErrors(invalidToken(), res)
    return
  }
  sendProdErrors(err, res)
}
