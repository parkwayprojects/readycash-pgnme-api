const query = require('../utils/db')
const { agentInfoQuery} = require('../utils/dbQueries')

module.exports.agnetInformation = async (req, res) => {
  const agent = await query(agentInfoQuery(req.params.agentId))
  res.send(agent)
}