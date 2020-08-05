const query =  require('../utils/db');
const { merge } = require('../utils/helpers');
const {accountTransactionListQuery, incomeAccountQuery, defaultAccountTransactionListQuery, defaultTncomeAccountQuery} = require('../utils/dbQueries')




const fromInseption = async (req, res) => {
  const { size, count } = req.query

  if (!size || !count) {
    res.status(422).json({message: 'Please pass size and count'});
    return res.end();
  }

  const { mainAccId, incomeAccId } = req.params
  const mainTransPromise =  query(accountTransactionListQuery(mainAccId, size, count))
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