const joi = require('@hapi/joi');
const schemas = {
	createDiscount: joi.object().keys({
		percentDiscount: joi.number().required(),
		duration: joi.date().required(),
		maxDiscount: joi.number().required(),
		minimumDiscount: joi.number().required(),
		quantity: joi.number().required(),
	}),
  
	updateDiscount: joi.object().keys({
    id: joi.string().required(),
		percentDiscount: joi.number(),
		duration: joi.date(),
		maxDiscount: joi.number(),
		minimumDiscount: joi.number(),
		quantity: joi.number(),
	}),
};
module.exports = schemas;