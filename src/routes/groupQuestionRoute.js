const express = require('express');
const Controller = require('../controllers/groupQuestion.controller');
const SchemaValidateGroupQuestion = require('../validators/groupQuestion.validator');
const router = express.Router();
const Validate = require('../validators');
const { checkRole } = require('../middleware/checkRole.middleware');
const { defaultRoles } = require('../config/defineModel');
const jwtServices = require('../services/jwt.services');

router.post(
	'/createGroupQuestion',
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Validate.body(SchemaValidateGroupQuestion.createGroupQuestion),
	Controller.createGroupQuestionAsync
);

router.put(
	'/updateGroupQuestion',
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Validate.body(SchemaValidateGroupQuestion.updateGroupQuestion),
	Controller.updateGroupQuestionAsync
);

router.delete(
	'/deleteGroupQuestion',
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Controller.deleteGroupQuestionAsync
);

router.get('/getAllGroupQuestion', Controller.GetAllGroupQuestionAsync);

module.exports = router;
