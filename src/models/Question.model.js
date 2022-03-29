const mongoose = require('mongoose');
const { defaultModel } = require('../config/defineModel');
const Schema = mongoose.Schema;

const Question = new Schema(
	{
		title: defaultModel.stringR,
		answerA: defaultModel.stringR,
		answerB: defaultModel.stringR,
		answerC: defaultModel.stringR,
		answerD: defaultModel.stringR,
		isTrueA: defaultModel.booleanFalse,
		isTrueB: defaultModel.booleanFalse,
		isTrueC: defaultModel.booleanFalse,
		isTrueD: defaultModel.booleanFalse,
		groupQuestion: defaultModel.stringRef,
    image: defaultModel.stringR,
		time: defaultModel.number,
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Question', Question);
