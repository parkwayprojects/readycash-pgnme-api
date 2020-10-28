const query = require("../utils/db");
const {
  agentInfoQuery,
  agentInfoWithPhoneQuery,
} = require("../utils/dbQueries");

module.exports.agnetInformation = async (req, res) => {
  const check = /\d/.test(req.params.agentId);
  if (!check) {
    return res.status(422).send({ message: "Agent ID is required" });
  }
  const agent = await query(agentInfoQuery(req.params.agentId));
  res.send(agent);
};

module.exports.agnetInformationWithPhone = async (req, res) => {
  const {phoneNumber} = req.params
  const check = /\d/.test(phoneNumber);
  if (!check) {
   return res.status(422).send({ message: "Phone Number is required" });
  }
 

  const stdNigPhoneNumber = `234${phoneNumber.slice(1)}`

  console.log(stdNigPhoneNumber)

  const agent = await query(agentInfoWithPhoneQuery(stdNigPhoneNumber));
  res.send(agent);
};
