class ApiError extends Error {
  constructor(message, code) {
    super(message)
    this.code = code
    this.status = `${code}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true
    Error.captureStackTrace(this, this.constrctor)
  }
}

module.exports = ApiError
