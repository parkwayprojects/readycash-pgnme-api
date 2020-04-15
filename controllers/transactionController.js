const query =  require('../utils/db');
const { merge } = require('../utils/helpers');
const {accountTransactionListQuery, incomeAccountQuery, defaultAccountTransactionListQuery, defaultTncomeAccountQuery} = require('../utils/dbQueries')




const fromInseption = async (req, res) => {
  const { mainAccId, incomeAccId } = req.params
  const mainTransPromise =  query(accountTransactionListQuery(mainAccId))
  const incomeListPromise =  query(incomeAccountQuery(incomeAccId))
  const [mainTranList, incomeList] = await Promise.all([mainTransPromise, incomeListPromise])
  res.send(merge(mainTranList,incomeList));
}

const byDate = async (req, res) => {
  const { mainAccId, incomeAccId, date } = req.params
  const mainTransPromise =  query(defaultAccountTransactionListQuery(mainAccId,'=', date))
  const incomeListPromise =  query(defaultTncomeAccountQuery(incomeAccId, '=', date))
  const [mainTranList, incomeList] = await Promise.all([mainTransPromise, incomeListPromise])
  res.send(merge(mainTranList, incomeList))
}


module.exports = {
  fromInseption,
  byDate
}