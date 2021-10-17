const joi = require('@hapi/joi');
const schemas = {
	createOrder: joi.object().keys({
		cartId: joi.array().required(),
    address: joi.string().required(),
    area: joi.string().required(),
		typePaymentOrder: joi.number().required()
	}),
	updateOrder: joi.object().keys({
		id: joi.string().required(),
    address: joi.string().required(),
    area: joi.string().required(),
	}),
};
module.exports = schemas;


