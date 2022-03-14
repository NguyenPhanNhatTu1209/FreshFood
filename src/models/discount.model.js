const { number, date } = require('@hapi/joi');
const mongoose = require('mongoose');
const { defaultModel } = require('../config/defineModel');
const Schema = mongoose.Schema;

const Discount = new Schema(
	{
		percentDiscount: defaultModel.number,
		duration: defaultModel.date,
		maxDiscount: defaultModel.number,
		minimumDiscount: defaultModel.number,
		quantity: defaultModel.number
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Discount', Discount);
