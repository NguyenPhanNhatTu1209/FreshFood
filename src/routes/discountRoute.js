const express = require('express');
const Controller = require('../controllers/discount.controller');
const SchemaValidatediscount = require('../validators/discount.validator');
const router = express.Router();
const Validate = require('../validators');
const { checkRole } = require('../middleware/checkRole.middleware');
const { defaultRoles } = require('../config/defineModel');
const jwtServices = require('../services/jwt.services');

router.post(
	'/createDiscount',
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Validate.body(SchemaValidatediscount.createDiscount),
	Controller.createDiscountAsync
);

router.put(
	'/updateDiscount',
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Validate.body(SchemaValidatediscount.updateDiscount),
	Controller.updateDiscountAsync
);

router.delete(
	'/deleteDiscount',
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Controller.deleteDiscountAsync
);

router.get(
	'/getAllDiscount',
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Controller.GetAllDiscountUserAsync
);

router.get(
	'/getAllDiscountActive',
	jwtServices.verify,
	Controller.GetAllDiscountActiveAsync);

module.exports = router;



