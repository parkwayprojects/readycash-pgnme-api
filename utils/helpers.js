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

module.exports = {
  today,
  merge,
};
