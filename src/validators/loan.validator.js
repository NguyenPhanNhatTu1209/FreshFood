const joi = require('@hapi/joi');
const schemas = {
	createSpendingLoan: joi.object().keys({
		typeLoan: joi.string().regex(/^[a-fA-F0-9]{24}$/),
		totalLoanAmount: joi.number().min(5000000),
	}),
	createTypeLoan:joi.object().keys({
		monthLoan:joi.number(),
		nameLoan:joi.string(),
		interestRate:joi.number(),
	}),
	changeStatus:joi.object().keys({
		id:joi.string().regex(/^[a-fA-F0-9]{24}$/)
	}),
	deletedLoan:joi.object().keys({
		idLoan:joi.string().regex(/^[a-fA-F0-9]{24}$/)
	}),
	getStatus:joi.object().keys({
		status:joi.number().integer().min(0).max(1),
		limit:joi.string().regex(/\d+/).allow(null, ''),
		skip:joi.string().regex(/\d+/).allow(null, ''),
	}),
	getTypeLoanClient:joi.object().keys({
		money:joi.number().integer().min(5000000).max(100000000),
		limit:joi.string().regex(/\d+/).allow(null, ''),
		skip:joi.string().regex(/\d+/).allow(null, ''),
	}),
};
module.exports = schemas;
