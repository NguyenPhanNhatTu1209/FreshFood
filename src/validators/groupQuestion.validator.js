const joi = require('@hapi/joi');
const schemas = {
	createGroupQuestion: joi.object().keys({
		title: joi.string().required(),
	}),
	
	updateGroupQuestion: joi.object().keys({
    id: joi.string().required(),
		title: joi.string().required(),
	}),
};
module.exports = schemas;


