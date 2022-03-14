const express = require('express');
const Controller = require('../controllers/answer.controller');
const SchemaValidateAnswer = require('../validators/answer.validator');
const router = express.Router();
const Validate = require('../validators');
const { checkRole } = require('../middleware/checkRole.middleware');
const { defaultRoles } = require('../config/defineModel');
const jwtServices = require('../services/jwt.services');

router.post(
	'/createAnswer',
	jwtServices.verify,
	Validate.body(SchemaValidateAnswer.createAnswer),
	Controller.createAnswerAsync
);

module.exports = router;
