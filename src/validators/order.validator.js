const joi = require('@hapi/joi');
const schemas = {
	createOrder: joi.object().keys({
		cartId: joi.array().required(),
    address: joi.string().required(),
    area: joi.string().required(),
		note: joi.string().required(),
		typePaymentOrder: joi.number().required()
	}),
	updateOrder: joi.object().keys({
		id: joi.string().required(),
    address: joi.string().required(),
    area: joi.string().required(),
	}),
	updateStatus: joi.object().keys({
		id: joi.string().required(),
    status: joi.number().required(),
	}),
};
module.exports = schemas;


