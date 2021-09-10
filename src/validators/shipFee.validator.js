const joi = require('@hapi/joi');
const schemas = {
	createShipFee: joi.object().keys({
		address: joi.string().required(),
    fee: joi.number().required(),
	}),
	updateShipFee: joi.object().keys({
    id: joi.string().required(),
    address: joi.string().required(),
    fee: joi.number().required(),
	}),
};
module.exports = schemas;
