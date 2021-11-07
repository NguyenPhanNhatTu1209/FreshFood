const joi = require('@hapi/joi');
const schemas = {
	createOrder: joi.object().keys({
		cartId: joi.array().required(),
		note: joi.string().required(),
		area: joi.object().required(),
		typePaymentOrder: joi.number().required()
	}),
	updateOrder: joi.object().keys({
		id: joi.string().required(),
    area: joi.object().required(),
	}),
	updateStatus: joi.object().keys({
		id: joi.string().required(),
    status: joi.number().required(),
	}),
};
module.exports = schemas;


