const jwt = require('jsonwebtoken')
const { findUserById }  = require('../utils/dbQueries')
const query = require('../utils/usersdb')
const ApiError = require('../handlers/apiError')


module.exports.generateToken = user => {
  return jwt.sign({id: user.id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

module.exports.verifyToken = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })
}

module.exports.protect = async (req, res, next) => {
  const bearer = req.headers.authorization
  if (!bearer) {
    return next(new ApiError('Please log in to get access', 401))
  }

  if (!bearer.startsWith('Bearer ')) {
    return next(new ApiError('invalid token', 401))
  }
  const token = bearer.split(' ')[1].trim()
  const payload = await this.verifyToken(token)

  const user = await query(findUserById(payload.id))

  if (!user.length) {
    return next(new ApiError('The token belonging to the user no loger exist'))
  }

  const [activeUser] = user

  if(!activeUser.status) {
    return next(new ApiError('Account not activated. Contact Support', 401))
  }
  //todo
  // * check if user change password
  req.user = user
  next()
}
