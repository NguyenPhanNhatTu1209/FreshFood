const express = require('express');
const useRoute = require('./userRoute');
const groupProductRoute = require('./groupProductRoute');
const productRoute = require('./productRoute');
const cartRoute = require('./cartRoute');
const orderRoute = require('./orderRoute');
const chatRoute = require('./chatRoute');
const eveluateRoute = require('./eveluateRoute');
const addressRoute = require('./addressRoute');
const productUserRoute = require('./productUserRoute');
const statisticRoute = require('./statisticRoute');
const discountRoute = require('./discountRoute');
const groupQuestionRoute = require('./groupQuestionRoute');
const quesitionRoute = require('./questionRoute');
const answerRoute = require('./answerRoute');
const iventoryRoute = require('./inventoryHistoryRoute');

const router = express.Router();
router.use('/user', useRoute);
router.use('/groupProduct', groupProductRoute);
router.use('/product', productRoute);
router.use('/cart', cartRoute);
router.use('/order', orderRoute);
router.use('/chat', chatRoute);
router.use('/eveluate', eveluateRoute);
router.use('/address', addressRoute);
router.use('/productUser', productUserRoute);
router.use('/statistic', statisticRoute);
router.use('/discount', discountRoute);
router.use('/groupQuestion',groupQuestionRoute );
router.use('/question', quesitionRoute);
router.use('/answer', answerRoute);
router.use('/iventoryHistory', iventoryRoute);

router.get('/healCheck', (req, res) =>
	res.status(200).send('Welcome to FreshFood')
);

module.exports = router;
