const mongoose = require('mongoose');
const { defaultModel } = require('../config/defineModel');
const Schema = mongoose.Schema;

const GroupQuestion = new Schema(
	{
		title: defaultModel.stringR,
		isActive: defaultModel.booleanFalse
	},
	{ timestamps: true }
);

module.exports = mongoose.model('GroupQuestion', GroupQuestion);
