const joi = require('@hapi/joi');
const schemas = {
	createQuestion: joi.object().keys({
		title: joi.string().required(),
		answerA: joi.string().required(),
		answerB: joi.string().required(),
		answerC: joi.string().required(),
		answerD: joi.string().required(),
		isTrueA: joi.bool(),
		isTrueB: joi.bool(),
		isTrueC: joi.bool(),
		isTrueD: joi.bool(),
		groupQuestion: joi.string().required(),
		time: joi.number().required()
	}),

	updateQuesion: joi.object().keys({
		id: joi.string().required(),
		title: joi.string(),
		answerA: joi.string(),
		answerB: joi.string(),
		answerC: joi.string(),
		answerD: joi.string(),
		groupQuestion: joi.string(),
		time: joi.number()
	})
};
module.exports = schemas;
