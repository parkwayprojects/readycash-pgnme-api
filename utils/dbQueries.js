const {today} = require('./helpers')


function accountIdQuery(agentId) {
  return `select account from agent a INNER JOIN agent_accounts aa on a.id = aa.id INNER JOIN acct on aa.account = acct.id where realId in (${agentId}) and aa.type ='00.566'`
}

function incomeAccountIdQuery(agentId) {
  return `select account from agent a INNER JOIN agent_accounts aa on a.id = aa.id INNER JOIN acct on aa.account = acct.id where realId in (${agentId})and aa.type ='01.566'`
}

function accountTransactionListQuery(accountId) {
  return `select tl.sender as AGENT_CODE,tl.transmissionDate as TRANSMISSION_DATE,
  case tl.itc when '200.21.0000' then 'AGENT_WALLET_FUNDING' 
  when '220.00.4000' then 'CASHOUT_WITH_VOUCHER' 
  when '200.21.0001' then 'CASHOUT_WITH_POS'
  when '220.00.010.0000' then 'BANK_TRANSFER' 
  when '220.00.012.0000' then 'BILLS_PAYMENT'
  when '220.00.013.0000' then 'AIRTIME_TOPUP'
  when '200.00.000' then  'BILLS_PAYMENT' end as SERVICE_TYPE,
case tl.itc when '200.21.0000' then 'AGENT_WALLET_FUNDING' 
when '220.00.4000' then 'CASHOUT_WITH_VOUCHER' 
when '200.21.0001' then tl.narration
when '220.00.010.0000' then Concat('Bank transfer:',' ',ca_name)
when '220.00.012.0000' then tl.narration
when '220.00.013.0000' then  Concat('Airtime transfer to',' ',ca_phone ,' ', ca_name)
when '200.00.000' then  tl.narration end as DESCR,
  case te.subclass when 'C' then 'CREDIT'
  when 'D' then 'DEBIT' end as IMPACT,
  tl.amount AS AMOUNT, SUBSTRING_INDEX(tl.returnedbalances,',',-1) as BALANCE ,tl.id,approvalnumber from tranlog tl inner join transentry te on tl.gltransaction = te.transaction where  tl.irc='0000' and tl.reversalCount=0 and tl.captureDate <'${today()}' and te.account in (${accountId})
  and te.layer = 566 and  tl.itc in ('200.21.0000','220.00.4000','200.21.0001','220.00.010.0000','220.00.012.0000','200.00.000','220.00.013.0000') order by tl.transmissionDate asc`;
}

function defaultAccountTransactionListQuery(accountId, sign, date) {
  return `select tl.sender as AGENT_CODE,tl.transmissionDate as TRANSMISSION_DATE,
  case tl.itc when '200.21.0000' then 'AGENT_WALLET_FUNDING' 
  when '220.00.4000' then 'CASHOUT_WITH_VOUCHER' 
  when '200.21.0001' then 'CASHOUT_WITH_POS'
  when '220.00.010.0000' then 'BANK_TRANSFER' 
  when '220.00.012.0000' then 'BILLS_PAYMENT'
  when '220.00.013.0000' then 'AIRTIME_TOPUP'
  when '200.00.000' then  'BILLS_PAYMENT' end as SERVICE_TYPE,
case tl.itc when '200.21.0000' then 'AGENT_WALLET_FUNDING' 
when '220.00.4000' then 'CASHOUT_WITH_VOUCHER' 
when '200.21.0001' then tl.narration
when '220.00.010.0000' then Concat('Bank transfer:',' ',ca_name)
when '220.00.012.0000' then tl.narration
when '220.00.013.0000' then  Concat('Airtime transfer to',' ',ca_phone ,' ', ca_name)
when '200.00.000' then  tl.narration end as DESCR,
  case te.subclass when 'C' then 'CREDIT'
  when 'D' then 'DEBIT' end as IMPACT,
  tl.amount AS AMOUNT, SUBSTRING_INDEX(tl.returnedbalances,',',-1) as BALANCE ,tl.id,approvalnumber from tranlog tl inner join transentry te on tl.gltransaction = te.transaction where  tl.irc='0000' and tl.reversalCount=0 and tl.captureDate ${sign}'${date}' and te.account in (${accountId})
  and te.layer = 566 and  tl.itc in ('200.21.0000','220.00.4000','200.21.0001','220.00.010.0000','220.00.012.0000','200.00.000','220.00.013.0000')  order by tl.transmissionDate asc`;
}

function incomeAccountQuery(incomeAccountId) {
  return `select tl.sender as AGENT_CODE,tl.transmissionDate as TRANSMISSION_DATE,
  case tl.itc when '200.21.0000' then 'AGENT_WALLET_FUNDING' 
  when '220.00.4000' then 'CASHOUT_WITH_VOUCHER' 
  when '200.21.0001' then 'CASHOUT_WITH_POS'
  when '220.00.010.0000' then 'BANK_TRANSFER' 
  when '220.00.012.0000' then 'BILLS_PAYMENT'
  when '220.00.013.0000' then 'AIRTIME_TOPUP'
  when '200.00.000' then  'BILLS_PAYMENT' end as SERVICE_TYPE,
case tl.itc when '200.21.0000' then 'AGENT_WALLET_FUNDING' 
when '220.00.4000' then 'CASHOUT_WITH_VOUCHER' 
when '200.21.0001' then tl.narration
when '220.00.010.0000' then Concat('Bank transfer:',' ',ca_name)
when '220.00.012.0000' then tl.narration
when '220.00.013.0000' then  Concat('Airtime transfer to',' ',ca_phone ,' ', ca_name)
when '200.00.000' then  tl.narration end as DESCR,
  case te.subclass when 'C' then 'CREDIT'
  when 'D' then 'DEBIT' end as IMPACT,
  te.amount AS AMOUNT, SUBSTRING_INDEX(tl.returnedbalances,',',-1) as BALANCE ,tl.id,approvalnumber from tranlog tl inner join transentry te on tl.gltransaction = te.transaction where  tl.irc='0000' and tl.reversalCount=0 and tl.captureDate<'${today()}' and te.account in (${incomeAccountId})
  and te.layer = 566 and  tl.itc in ('200.21.0000','220.00.4000','200.21.0001','220.00.010.0000','220.00.012.0000','200.00.000','220.00.013.0000')  order by tl.transmissionDate asc`
}

function defaultTncomeAccountQuery(incomeAccountId, sign, date) {
  return `select tl.sender as AGENT_CODE,tl.transmissionDate as TRANSMISSION_DATE,
  case tl.itc when '200.21.0000' then 'AGENT_WALLET_FUNDING' 
  when '220.00.4000' then 'CASHOUT_WITH_VOUCHER' 
  when '200.21.0001' then 'CASHOUT_WITH_POS'
  when '220.00.010.0000' then 'BANK_TRANSFER' 
  when '220.00.012.0000' then 'BILLS_PAYMENT'
  when '220.00.013.0000' then 'AIRTIME_TOPUP'
  when '200.00.000' then  'BILLS_PAYMENT' end as SERVICE_TYPE,
case tl.itc when '200.21.0000' then 'AGENT_WALLET_FUNDING' 
when '220.00.4000' then 'CASHOUT_WITH_VOUCHER' 
when '200.21.0001' then tl.narration
when '220.00.010.0000' then Concat('Bank transfer:',' ',ca_name)
when '220.00.012.0000' then tl.narration
when '220.00.013.0000' then  Concat('Airtime transfer to',' ',ca_phone ,' ', ca_name)
when '200.00.000' then  tl.narration end as DESCR,
  case te.subclass when 'C' then 'CREDIT'
  when 'D' then 'DEBIT' end as IMPACT,
  te.amount AS AMOUNT, SUBSTRING_INDEX(tl.returnedbalances,',',-1) as BALANCE ,tl.id,approvalnumber from tranlog tl inner join transentry te on tl.gltransaction = te.transaction where  tl.irc='0000' and tl.reversalCount=0 and tl.captureDate${sign}'${date}' and te.account in (${incomeAccountId})
  and te.layer = 566 and  tl.itc in ('200.21.0000','220.00.4000','200.21.0001','220.00.010.0000','220.00.012.0000','200.00.000','220.00.013.0000')  order by tl.transmissionDate asc`
}


module.exports = {
  accountIdQuery,
  incomeAccountIdQuery,
  accountTransactionListQuery,
  incomeAccountQuery,
  defaultAccountTransactionListQuery,
  defaultTncomeAccountQuery
}
