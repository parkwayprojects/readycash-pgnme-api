const NodeRSA = require('node-rsa')




module.exports.rsaEncrypt = () => {
  const key = new NodeRSA(`-----BEGIN PUBLIC KEY-----
                      MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCDXzs06yVH1yiGcEjFucD8abor
                      P96gswS/5/txTRU9cSqPwEk+tTg0XWBlpa/ceuPP+iAVnuIKYxPQUEThgC+434dA
                      aIMumWCZiqMhkeg+02Qa7vBs23lxw3VqW5476ncQMriqPdoIcgBFmCjY8LUDbsOe
                      jOsZ8EICPavgzX/XWQIDAQAB
                      -----END PUBLIC KEY-----`)

                     

  const text ='22305271194'
  const encrypted = key.encrypt(text, 'hex')
  console.log('encrypted: ', encrypted)
}
