const express = require('express')
const Controller = require('../controllers/order.controller')
const SchemaValidateOrder = require("../validators/order.validator")
const router = express.Router()
const Validate = require("../validators")
const { checkRole } = require('../middleware/checkRole.middleware')
const { defaultRoles } = require('../config/defineModel')
const jwtServices=require('../services/jwt.services')
router.post('/createOrder', jwtServices.verify, Validate.body(SchemaValidateOrder.createOrder), Controller.createOrderAsync)
router.put('/updateOrder',  jwtServices.verify, Validate.body(SchemaValidateOrder.updateOrder), Controller.updateOrderAsync)
router.delete('/cancelOrder',  jwtServices.verify, Controller.deleteCartAsync)
router.get('/getOrders', jwtServices.verify,Controller.GetOrderByUserAsync)

module.exports = router