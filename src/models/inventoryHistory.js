const mongoose = require('mongoose');
const { defaultModel } = require('../config/defineModel');
const Schema = mongoose.Schema;

const InventoryHistory = new Schema(
	{
		history: [{name: defaultModel.stringR, id: defaultModel.stringR, price: defaultModel.number, priceDiscount: defaultModel.number, quantity: defaultModel.number,}],
		idUser: defaultModel.stringR,
		nameUser:  defaultModel.stringR
	},
	{ timestamps: true }
);

module.exports = mongoose.model('InventoryHistory', InventoryHistory);
