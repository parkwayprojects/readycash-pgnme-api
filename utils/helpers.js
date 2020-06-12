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

    //  console.log("Encrypted Value",encrypted.toString())

     //let encMessage = encrypted.toString();

     const encMessage = `hIwDu9a+1IKS4RgBA/9FtKH1o5Yz77NR1h0H0N/eRcV7bVpxFmEZWkS9QV0hiK7+
     W8k9tx/nOsaL8fWPB8k+E5EU50c5rGFYHxNQLh83q7FM5Ek6ACcRX9YwZAdFi+IT
     hBtIUTsoePs7hGHE6wFo2BAY9O8rUDAl89kOS42ISjyQlwD0jJoyr2gRTWAQVNLA
     fgGeD66FVbSpfTsZp2imhhDNRwCgyEMITtHuaB3dRdXEBzL/sJMZfdKQeZ5pzVel
     ex1RffWvu0okzyl7skCSjsgY6ZPfXPN+JKLtPa+jUtbORvY7AvRYiSePxTc2SRHj
     /gDYKHXbT8N1f/U4feb/UlOfdi7FNQABr4LA3I2go6h06tdPNwV0t6iWZTdlhwvS
     vBc4sxAJeka0BotNwzFW0QL949b/wtqVEz6mGZsaByL3EAQEfXsR1jYgMdXkV86u
     Gh+xHLu+5hxypMReSWyHpmVq+yTcx7iAA3St/oEQegWxwJ0SC8kkKXLtU9ntCKhS
     IkskXnyDR8lybXXamvEs3USLNXu/6Wt+x/ItLxGl9siN0CyW+/89KkWMgdJ/BMvh
     sWzOByYEnI3NiwCalOcctgymxCB2wxC6e9LfTuE9sA==
     =50xS`;
     
      axios
        .post(
          "http://35.231.60.190/sanef_api_thirdparty/api/v1/accounts/createAccount",
          { data: encMessage },
          { headers: { 'ClientID': "018" } }
        )
        .then((data) => res.send(data))
        .catch((error) => {
          console.log(error)
          res.end()
        })
    });
  });
};

module.exports = {
  today,
  merge,
  sanefCtrl,
};
