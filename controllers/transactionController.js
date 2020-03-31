const query =  require('../utils/db');
const { merge } = require('../utils/helpers');
const {accountTransactionListQuery, incomeAccountQuery} = require('../utils/dbQueries')




const fromInseption = async (req, res) => {
  const { mainAccId, incomeAccId } = req.params
  const mainTransPromise =  query(accountTransactionListQuery(mainAccId))
  const incomeListPromise =  query(incomeAccountQuery(incomeAccId))
  const [mainTranList, incomeList] = await Promise.all([mainTransPromise, incomeListPromise])
  res.send(merge(mainTranList,incomeList));
}

const daily = async (req, res) => {
  
}


module.exports = {
  fromInseption
}