const joi = require('@hapi/joi');
const schemas = {
	createIventoryHistory: joi.array().items({
		id: joi.string().required(),
		priceDiscount: joi.number().required(),
		price: joi.number().required(),
    quantity: joi.number().required(),
		name: joi.string().required()
	}),
	
	updateIventoryHistory: joi.array().items({
    id: joi.string().required(),
		productId: joi.string(),
		priceDiscount: joi.number(),
		price: joi.number(),
    quantity: joi.number()
	}),
};
module.exports = schemas;
