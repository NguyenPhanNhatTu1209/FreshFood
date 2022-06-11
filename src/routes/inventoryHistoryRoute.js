const express = require('express');
const Controller = require('../controllers/inventory.controller');
const SchemaValidateIventory = require('../validators/iventoryHistory.validator');
const router = express.Router();
const Validate = require('../validators');
const { checkRole } = require('../middleware/checkRole.middleware');
const { defaultRoles, defaultModel } = require('../config/defineModel');
const jwtServices = require('../services/jwt.services');

router.post(
	'/createIventoryHistory',
	jwtServices.verify,
  checkRole([defaultRoles.Admin,defaultRoles.Staff]),
	Validate.body(SchemaValidateIventory.createIventoryHistory),
	Controller.createIventoryHistoryAsync
);

router.get('/getAllIventoryHistory', jwtServices.verify, Controller.GetIventoryHistoryAsync);

module.exports = router;
