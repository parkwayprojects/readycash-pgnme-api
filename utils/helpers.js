const gpg = require("gpg");
const axios = require("axios");
const path = require("path");

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

const sanefCtrl = (req, res) => {
  gpg.importKeyFromFile(path.join(__dirname, "0x8DC5CB66-pub.asc"), function (
    err,
    result,
    fingerprint
  ) {
    const msg = {
      superagentCode: "018",
      agentCode: "100006",
      bankCode: "0002",
      requestId: "000001201910240846150999883774",
      bankVerificationNumber: "22123456789",
      firstName: "Sammy",
      middleName: "Joe",
      lastName: "Smile",
      gender: "Male",
      dateOfBirth: "1978-Oct-20",
      houseNumber: "10B",
      streetName: "Almond street",
      city: "Igando",
      lgaCode: "502",
      emailAddress: "abk@gmail.com",
      phoneNumber: "08032345678",
      accountOpeningBalance: 1000,
    };
    const message = JSON.stringify(msg);

    var args = [
      "--default-key",
      fingerprint,
      "--recipient",
      fingerprint,
      "--armor",
      "--trust-model",
      "always",
    ];


    gpg.encrypt(message, args, function (err, encrypted) {

      console.log("Encrypted Value",encrypted.toString())

     let encMessage = encrypted.toString();

     
      axios
        .post(
          "http://35.231.60.190/sanef_api_thirdparty/api/v1/accounts/createAccount",
          { data: encMessage },
          { header: { 'ClientID': "018" } }
        )
        .then((data) => res.send(data))
        .catch((error) => console.log(error))
    });
  });
};

module.exports = {
  today,
  merge,
  sanefCtrl,
};
