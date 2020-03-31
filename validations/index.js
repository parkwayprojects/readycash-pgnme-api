const { accountIdQuery, incomeAccountIdQuery } = require('../utils/dbQueries')
const query = require('../utils/db')

const oneAgent = (req, res, next) => {
  const id = req.params.agentId
  if(!id || !id.match(/^[0-9]+$/)) {
    res.status(404).json({message: 'Invalid agent Id'})
    res.end()
  }else {
    next()
  }
  
}


const getAccountAndIncomeIds = async (req, res, next) => {
  const {agentId} = req.params;
  const accPromise = query(accountIdQuery(agentId))
  const incomePromise = query(incomeAccountIdQuery(agentId))
  const [accountId, incomeId ] = await Promise.all([accPromise, incomePromise]);
  
  if (!accountId.length  || !incomeId.length ) {
    res.status(422).json({message: 'No record found'});
    res.end()
  }else {
    req.params.mainAccId = accountId[0].account
    req.params.incomeAccId = incomeId[0].account
    next()
  }
}









module.exports = {
  oneAgent,
  getAccountAndIncomeIds
}