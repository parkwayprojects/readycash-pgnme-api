const { accountIdQuery, incomeAccountIdQuery } = require('../controllers/transactionController')
const db = require('../utils/db')

const oneAgent = (req, res, next) => {
  if(!req.body.agentId) {
    res.status(422).json({message: 'Please pass an agent Id'})
    res.end()
  }else {
    next()
  }
  
}


const getAccountAndIncomeIds = async (req, res, next) => {
  const {agentId} = req.body;
  const accPromise = db(accountIdQuery(agentId))
  const incomePromise = db(incomeAccountIdQuery(agentId))
  const [accountId, incomeId ] = await Promise.all([accPromise, incomePromise]);
  
  if (!accountId.length  || !incomeId.length ) {
    res.status(422).json({message: 'Invalid agent Id'});
    res.end()
  }else {
    req.body.mainAccId = accountId[0].account
    req.body.incomeAccId = incomeId[0].account
    next()
  }
}












module.exports = {
  oneAgent,
  getAccountAndIncomeIds
}