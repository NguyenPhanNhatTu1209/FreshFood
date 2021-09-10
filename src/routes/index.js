const express = require('express')
const useRoute = require('./userRoute')
const groupProductRoute = require('./groupProductRoute')
const productRoute = require('./productRoute')
const shipFeeRoute = require('./shipFeeRoute')


const router = express.Router()
router.use('/user', useRoute)
router.use('/groupProduct', groupProductRoute)
router.use('/product', productRoute)

router.use('/shipFee', shipFeeRoute)


router.get('/healCheckw', (req, res) => res.status(200).send('Welcome to FreshFood'))

module.exports = router