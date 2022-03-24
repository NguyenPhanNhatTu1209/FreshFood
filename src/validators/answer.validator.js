const joi = require('@hapi/joi');
const schemas = {
	createAnswer: joi.object().keys({
    questionId: joi.string().required(),
		result: joi.string().required()
	}),
};
module.exports = schemas;
