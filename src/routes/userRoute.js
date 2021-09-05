const express = require('express')
const Controller = require('../controllers/user.controller')
const SchemaValidateUser = require("../validators/user.validator")
const router = express.Router()
const Validate = require("../validators")
const jwtServices = require("../services/jwt.services")


// var multer = require("multer");
// const path = require("path");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./src/uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage: storage });
// var cpUpload = upload.fields([{ name: 'Image', maxCount: 1 }]);
router.post('/changePassword', jwtServices.verify, Validate.body(SchemaValidateUser.changePass), Controller.changePasswordAsync)
router.post('/login', Validate.body(SchemaValidateUser.login), Controller.loginAsync)
router.post('/register', Validate.body(SchemaValidateUser.register), Controller.registerAsync)
router.get('/forgotPassword', Controller.forgotPasswordAsync)
router.post('/resetPassword',Validate.body(SchemaValidateUser.resetPassword), Controller.resetPasswordAsync)

module.exports = router