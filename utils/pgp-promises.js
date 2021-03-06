const gpg = require("gpg");
const path = require("path");

/* gpg.importKeyFromFile(path.join(__dirname, "./0x8DC5CB66-sec.asc"), function (
  err,
  result,
  fingerprint
) {
  console.log(fingerprint);

  var args = [
    "--decrypt",
    "--default-key",
    fingerprint,
    "--recipient",
    fingerprint,
    "--passphrase",
    process.env.PGP_PASSPHRASE,
    "--trust-model",
    "always", // so we don't get "no assurance this key belongs to the given user"
  ];

  gpg.decrypt(encryptedString, args, function (err, decrypted) {
    console.log(err);
    console.log(decrypted.toString("utf8"));
  });
}); */

const getFingerprint = () => {
  return new Promise((resolve, reject) => {
    gpg.importKeyFromFile(
      //path.join(__dirname, "./0x8DC5CB66-sec.asc"),
      path.join(__dirname, "./private.asc"),
      (err, result, fingerprint) => {
        console.log(path.join(__dirname, "./private.asc"))
        console.log(fingerprint)
        if (fingerprint) {
          resolve(fingerprint);
        } else {
          console.log(err)
          reject(err);
        }
      }
    );
  });
};

const decryptWithFingerprint = (fingerprint, encryptedString) => {
  return new Promise((resolve, reject) => {
    var args = [
      "--decrypt",
      "--default-key",
      fingerprint,
      "--recipient",
      fingerprint,
      "--pinentry-mode",
      "loopback",
      "--passphrase",
      process.env.PGP_PASSPHRASE,
      "--trust-model",
      "always", // so we don't get "no assurance this key belongs to the given user"
    ];

    gpg.decrypt(encryptedString, args, (err, decrypted) => {
      if (decrypted) {
        resolve(decrypted.toString("utf8"));
      } else {
        console.log('error occurs during decryption')
        reject(err);
      }
    });
  });
};

module.exports = {
  getFingerprint,
  decryptWithFingerprint,
};
