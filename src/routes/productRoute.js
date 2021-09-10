const express = require('express')
const Controller = require('../controllers/product.controller')
const router = express.Router()
const { checkRole } = require('../middleware/checkRole.middleware')
const { defaultRoles } = require('../config/defineModel')
const jwtServices=require('../services/jwt.services')
var multer = require("multer");
const path = require("path");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./src/uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage: storage });
// var cpUpload = multipleUpload.fields([{ name: 'image', maxCount: 10 }]);

var storage = multer.memoryStorage({
  destination: function(req, file, callback) {
      callback(null, '');
  }
});
var multipleUpload = multer({ storage: storage }).array("image");

router.post('/createProduct',multipleUpload,jwtServices.verify,checkRole([defaultRoles.Admin]),Controller.createProductAsync)
router.put('/updateProduct', multipleUpload,jwtServices.verify,checkRole([defaultRoles.Admin]),  Controller.updateProductAsync)
router.delete('/deleteProduct',  jwtServices.verify,checkRole([defaultRoles.Admin]), Controller.deleteProductAsync)

module.exports = router