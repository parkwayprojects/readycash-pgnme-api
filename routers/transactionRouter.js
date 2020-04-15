const {Router} = require('express');
const { oneAgent, getAccountAndIncomeIds, validateDate } = require('../validations')
const transactionController = require('../controllers/transactionController')

const router = Router();

router.get('/:agentId', [oneAgent, getAccountAndIncomeIds], transactionController.fromInseption);

router.get('/:agentId/:date', [oneAgent, validateDate, getAccountAndIncomeIds], transactionController.byDate)


module.exports = router;