const NodeRSA = require('node-rsa')




module.exports.rsaEncrypt = () => {
  console.log('smoke laddkkf')
  const key = new NodeRSA({b: 512})
          const keyData = `-----BEGIN PUBLIC KEY-----
                      MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCDXzs06yVH1yiGcEjFucD8abor
                      P96gswS/5/txTRU9cSqPwEk+tTg0XWBlpa/ceuPP+iAVnuIKYxPQUEThgC+434dA
                      aIMumWCZiqMhkeg+02Qa7vBs23lxw3VqW5476ncQMriqPdoIcgBFmCjY8LUDbsOe
                      jOsZ8EICPavgzX/XWQIDAQAB
                      -----END PUBLIC KEY-----`

  

key.importKey(keyData, 'pkcs8');

  const text ='22155427242'
  const encrypted = key.encrypt(text, 'base64')
  console.log('encrypted: ', encrypted)
}

