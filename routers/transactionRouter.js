const {Router} = require('express');
const { oneAgent, getAccountAndIncomeIds } = require('../validations')
const transactionController = require('../controllers/transactionController')

const router = Router();

router.post('/all', [oneAgent, getAccountAndIncomeIds], transactionController.fromInseption);


module.exports = router;