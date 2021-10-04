const joi = require('@hapi/joi');
const schemas = {
	createCart: joi.object().keys({
		productId: joi.string().required(),
    quantity: joi.number().required()
	}),
	updateCart: joi.object().keys({
    id: joi.string().required(),
    quantity: joi.number().required()
	}),
};
module.exports = schemas;


