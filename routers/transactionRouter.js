const {Router} = require('express');
const { oneAgent, getAccountAndIncomeIds } = require('../validations')
const transactionController = require('../controllers/transactionController')

const router = Router();

router.get('/:agentId', [oneAgent, getAccountAndIncomeIds], transactionController.fromInseption);

router.get('/:agentId/daily',[oneAgent, getAccountAndIncomeIds], transactionController.daily)


module.exports = router;