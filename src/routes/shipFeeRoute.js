const express = require('express')
const Controller = require('../controllers/shipFee.controller')
const SchemaValidateShipFee = require("../validators/shipFee.validator")
const router = express.Router()
const Validate = require("../validators")
const { checkRole } = require('../middleware/checkRole.middleware')
const { defaultRoles } = require('../config/defineModel')
const jwtServices=require('../services/jwt.services')
router.post('/createShipFee', jwtServices.verify,checkRole([defaultRoles.Admin]), Validate.body(SchemaValidateShipFee.createShipFee), Controller.createShipFeetAsync)
router.put('/updateShipFee',  jwtServices.verify,checkRole([defaultRoles.Admin]), Validate.body(SchemaValidateShipFee.updateShipFee), Controller.updateShipFeeAsync)
router.delete('/deleteShipFee',  jwtServices.verify,checkRole([defaultRoles.Admin]), Controller.deleteShipFeeAsync)
router.get('/getAllShipFee',  jwtServices.verify, Controller.getAllShipFeeAsync)

module.exports = router