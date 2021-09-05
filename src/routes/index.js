const express = require('express')
const useRoute = require('./userRoute')

const router = express.Router()
router.use('/user', useRoute)



router.get('/healCheckw', (req, res) => res.status(200).send('Welcome to FreshFood'))

module.exports = router