const express = require('express')
const Controller = require('../controllers/user.controller')
const SchemaValidateUser = require("../validators/user.validator")
const router = express.Router()
const Validate = require("../validators")
const jwtServices = require("../services/jwt.services")


var multer = require("multer");
const path = require("path");
var storage = multer.memoryStorage({
  destination: function(req, file, callback) {
      callback(null, '');
  }
});
var singleUpload = multer({ storage: storage }).single("image");

router.post('/changePassword', jwtServices.verify, Validate.body(SchemaValidateUser.changePass), Controller.changePasswordAsync)
router.post('/login', Validate.body(SchemaValidateUser.login), Controller.loginAsync)
router.post('/register', Validate.body(SchemaValidateUser.register), Controller.registerAsync)
router.get('/forgotPassword', Controller.forgotPasswordAsync)
router.post('/resetPassword',Validate.body(SchemaValidateUser.resetPassword), Controller.resetPasswordAsync)
router.get('/successPayPal', Controller.paymentSuccess)
router.get('/cancelPayPal', Controller.cancelPayment)
router.get('/successVnPay', Controller.successVnPayOrder)
router.get('/getInformation', jwtServices.verify, Controller.getInformation)
router.put('/updateInformation', jwtServices.verify,Validate.body(SchemaValidateUser.updateInformation), Controller.updateInformation)
router.post('/updateImage',singleUpload, jwtServices.verify, Controller.uploadImage)

module.exports = router