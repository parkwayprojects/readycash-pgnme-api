const bcrypt = require('bcrypt')
const validator = require('./users');

const registerValidation =  (req, res, next) => {
    const validationRule = {
        "email": "required|email",
        "firstname": "required|string",
        "lastname": "required|string",
        "password": "required|string",
        "company": "required|string"
    }
    validator(req.body, validationRule, {}, async (err, status) => {
        if (!status) {
            res.status(422)
                .send({
                    success: false,
                    message: 'Validation failed',
                    data: err
                });
        } else {
            req.body.password = await bcrypt.hash(req.body.password, 10)
            next();
        }
    });
}


const loginValidation =  (req, res, next) => {
  const validationRule = {
      "email": "required|email",
      "password": "required|string"
  }
  validator(req.body, validationRule, {}, async (err, status) => {
      if (!status) {
          res.status(422)
              .send({
                  success: false,
                  message: 'Validation failed',
                  data: err
              });
      } else {
          next();
      }
  });
}



module.exports = { 
  registerValidation,
  loginValidation
}