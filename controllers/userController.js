const query = require('../utils/usersdb')
const { registerUser, loginUser } = require('../utils/dbQueries')
const ApiError = require('../handlers/apiError')
const { generateToken } = require('../utils/auth')
const bcrypt = require('bcrypt')


module.exports.register = async(req, res) => {
 const user = await query(registerUser(req.body))
  res.send({
    message: 'Registration Successful',
    token: generateToken(user)
  })
}



module.exports.login = async (req, res, next) => {

const {email, password} = req.body;

const [user] = await query(loginUser(email))


if (!user || !(await bcrypt.compare(password, user.password))) {
  return next(new ApiError('incorrect email or password', 401))
}

res.send({
  token: generateToken(user)
})

 // await bcrypt.compare(password, this.password)

}