const gpg = require("gpg");
const axios = require("axios");
const path = require("path");
const openpgp = require("openpgp");
const fs = require("fs");
const {getFingerprint, decryptWithFingerprint} = require('./pgp-promises')

const today = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  return date;
};

const merge = (transList, incomeList) => {
  const newTranList = {};
  transList.forEach((transaction) => {
    newTranList[transaction.id] = transaction;
  });

  incomeList.forEach((income) => {
    if (
      newTranList[income.id] &&
      newTranList[income.id].approvalnumber === income.approvalnumber
    ) {
      newTranList[income.id].commision = income.AMOUNT;
    }
  });

  return Object.values(newTranList).map((transaction) => {
    if (transaction["SERVICE_TYPE"] === "BANK_TRANSFER") {
      if (transaction["description"].includes("{")) {
        const [type, desc] = transaction["description"].split("transfer:");
        const newDesc = JSON.parse(desc.trim()).bank;
        transaction["description"] = `Bank Name : ${newDesc}`;
      } else {
        const [type, desc] = transaction["description"].split("transfer:");
        transaction["description"] = `Bank Transfer to : ${desc}`;
      }
    }
    delete transaction.id;
    delete transaction.approvalnumber;
    return slimObj(transaction);
  });
};

const slimObj = (obj) => {
  let newObj = {};
  for (let [key, value] of Object.entries(obj)) {
    newObj[key.toLowerCase()] = value;
  }
  return newObj;
};



const sanefCtrl = async (req, res) => {

  var pubkey = fs.readFileSync("./0x8DC5CB66-pub.asc", "utf8");
  
  const { data: encrypted } = await openpgp.encrypt({
    message: openpgp.message.fromText(JSON.stringify(req.body)),
    publicKeys: (await openpgp.key.readArmored(pubkey)).keys,
  });

  const encHexValue = Buffer.from(encrypted, 'utf8').toString('hex')



  axios
    .post(
      process.env.SANEF_URL,
      { data: encHexValue },
      { headers: { ClientID: process.env.SANEF_ClientID } }
    )
    .then( async (data) => {
      const resposneToAscii = Buffer.from(data.Data, 'hex').toString('utf8')
      const decrypted = await decrypt(resposneToAscii);
      res.send(decrypted);
    })
    .catch((error) => {
      res.send({
        err: error
      });
    });
};



/* const testDecrypt = async (req, res) => {

  const cvt = Buffer.from(test, 'hex').toString('utf8')
  decrypt(cvt);
  console.log( await decrypt(cvt))
  res.end()
} */



const decrypt = async (encryptedString) => {
  const fingerprint = await getFingerprint()
  const decryptedmessage = await decryptWithFingerprint(fingerprint, encryptedString)
  return decryptedmessage;
}


module.exports = {
  today,
  merge,
  sanefCtrl,
  decrypt
};
