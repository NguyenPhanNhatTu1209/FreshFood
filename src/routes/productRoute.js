const express = require('express');
const Controller = require('../controllers/product.controller');
const router = express.Router();
const { checkRole } = require('../middleware/checkRole.middleware');
const { defaultRoles } = require('../config/defineModel');
const jwtServices = require('../services/jwt.services');
const Validate = require('../validators');
const SchemaValidateProduct = require('../validators/product.validator');

var multer = require('multer');
var storage = multer.memoryStorage({
	destination: function (req, file, callback) {
		callback(null, '');
	}
});
var multipleUpload = multer({ storage: storage }).array('image');

router.post(
	'/createProduct',
	multipleUpload,
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Validate.body(SchemaValidateProduct.createProduct),
	Controller.createProductAsync
);

router.put(
	'/updateProduct',
	multipleUpload,
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Controller.updateProductAsync
);

router.delete(
	'/deleteProduct',
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Controller.deleteProductAsync
);

router.get('/findAllProduct', Controller.findAllProductAsync);

router.get('/getProductRecommend', Controller.GetProductRecommend);

router.get('/getDetailProduct', Controller.findDetailProduct);

module.exports = router;
