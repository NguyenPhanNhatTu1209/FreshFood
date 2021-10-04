const express = require('express')
const useRoute = require('./userRoute')
const groupProductRoute = require('./groupProductRoute')
const productRoute = require('./productRoute')
const shipFeeRoute = require('./shipFeeRoute')
const cartRoute = require('./cartRoute')
const orderRoute = require('./orderRoute')
const chatRoute = require('./chatRoute')

const router = express.Router()
router.use('/user', useRoute)
router.use('/groupProduct', groupProductRoute)
router.use('/product', productRoute)
router.use('/shipFee', shipFeeRoute)
router.use('/cart', cartRoute)
router.use('/order', orderRoute)
router.use('/chat', chatRoute)


router.get('/healCheck', (req, res) => res.status(200).send('Welcome to FreshFood 1'))

module.exports = router