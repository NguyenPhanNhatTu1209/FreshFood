const mongoose = require('mongoose');
const { defaultModel } = require('../config/defineModel');
const Schema = mongoose.Schema;

const Answer = new Schema(
	{
		questionId: defaultModel.stringRef,
	  userId: defaultModel.stringRef,
		isTrue: defaultModel.booleanFalse,
		result: defaultModel.string,
		point: defaultModel.number,
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Answer', Answer);
