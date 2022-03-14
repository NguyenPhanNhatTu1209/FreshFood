const express = require('express');
const Controller = require('../controllers/question.controller');
const SchemaValidateQuestion = require('../validators/question.validator');
const router = express.Router();
const Validate = require('../validators');
const { checkRole } = require('../middleware/checkRole.middleware');
const { defaultRoles } = require('../config/defineModel');
const jwtServices = require('../services/jwt.services');

router.post(
	'/createQuestion',
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Validate.body(SchemaValidateQuestion.createQuestion),
	Controller.createQuestionAsync
);

router.put(
	'/updateQuestion',
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Validate.body(SchemaValidateQuestion.updateQuesion),
	Controller.updateQuestionAsync
);

router.delete(
	'/deleteQuestion',
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Controller.deleteQuestionAsync
);

router.get('/getAllQuestionByGroup/:id', Controller.GetAllQuestionByGroupAsync);

module.exports = router;
