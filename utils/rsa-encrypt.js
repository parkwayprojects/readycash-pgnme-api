const crypto = require("crypto");
const axios = require("axios");

const key = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCDXzs06yVH1yiGcEjFucD8abor
P96gswS/5/txTRU9cSqPwEk+tTg0XWBlpa/ceuPP+iAVnuIKYxPQUEThgC+434dA
aIMumWCZiqMhkeg+02Qa7vBs23lxw3VqW5476ncQMriqPdoIcgBFmCjY8LUDbsOe
jOsZ8EICPavgzX/XWQIDAQAB
-----END PUBLIC KEY-----`;

//21984130901 userId
const encryptedUserId = `KvuSchtZId9SJm3FeRY0D432xD7DeNoVaeHh6MNkyqYA528g8CoKf+Wl7pwh7zoQciHwN2Ju+LZpHQt1yhPJtdtQlmoz2V25s10joKptkgbNWf6m9nNOjgSg+dZ/uALC2oGFbAML+7Xs8RsMa24V28QlhIlUb1iEdkPsC76jAyk=`;

const encryptStringWithRsaPublicKey = (toEncrypt, publicKey) => {
  const buffer = Buffer.from(toEncrypt);
  const encrypted = crypto.publicEncrypt(
    { key: publicKey, padding: crypto.constants.RSA_PKCS1_PADDING },
    buffer
  );
  return encrypted.toString("base64");
};

const gtbBvnController = async (req, res) => {
  if (!req.body.bvn || req.body.bvn.length < 11) {
    res.status(422).send({ message: "11 digits BVN is required" });
  }

  const encryptedBvn = encryptStringWithRsaPublicKey(req.body.bvn, key);

  const payload = {
    bvn: encryptedBvn,
    channel: "PARKWAY",
    userId: encryptedUserId,
  };

  try {
    const response = await axios.post(process.env.GTB_BVN_URL, payload);
    res.send(response.data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
  res.end();
};

module.exports = { gtbBvnController };
