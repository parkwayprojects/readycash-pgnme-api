const gpg = require("gpg");
const axios = require("axios");
const path = require("path");
const openpgp = require("openpgp");
const fs = require("fs");
const { getFingerprint, decryptWithFingerprint } = require("./pgp-promises");

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
  const route = {
    account: "/api/v1/accounts/createAccount",
    wallet: "/api/v1/accounts/createWallet",
  };

  const { type, ...rest } = req.body;

  console.log(`${process.env.SANEF_URL}${route[type]}`);

  //var pubkey = fs.readFileSync("./0x8DC5CB66-pub.asc", "utf8");

  const pubkey = fs.readFileSync("./public_sanef.asc", "utf8");

  const { data: encrypted } = await openpgp.encrypt({
    message: openpgp.message.fromText(JSON.stringify(rest)),
    publicKeys: (await openpgp.key.readArmored(pubkey)).keys,
  });
  const encHexValue = Buffer.from(encrypted, "utf8").toString("hex");

  axios
    .post(
      `${process.env.SANEF_URL}${route[type]}`,
      { data: encHexValue },
      { headers: { ClientID: process.env.SANEF_ClientID } }
    )
    .then(async (response) => {
      console.log("response block");
      console.log(response.data.Data)
      const resposneToAscii = Buffer.from(response.data.Data, "hex").toString("utf8");
        console.log('logger 1')
        const decrypted = await decrypt(resposneToAscii);
        console.log(decrypted)
        res.send(decrypted);
        console.log('logger 2')
    })
    .catch((error) => {
      console.log("error block", error);
      res.status(422).send({
        err: error.response.data,
      });
    });
};

const decrypt = async (encryptedString) => {
   console.log('inside decrypt')
  try {
    const fingerprint = await getFingerprint();
    console.log(fingerprint)
    const decryptedmessage = await decryptWithFingerprint(
      fingerprint,
      encryptedString
    );
    return decryptedmessage;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  today,
  merge,
  sanefCtrl,
  decrypt,
};
