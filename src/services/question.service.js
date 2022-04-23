const USER = require('../models/User.model');
const { defaultRoles } = require('../config/defineModel');
const otpGenerator = require('otp-generator');
const { configEnv } = require('../config/index');
const nodemailer = require('nodemailer');
const QUESTION = require('../models/Question.model');
const ANSWER = require('../models/Answer.model')

exports.createQuestionAsync = async body => {
	try {
		const question = new QUESTION(body);
		await question.save();
		
		return {
			message: 'Successfully create Question',
			success: true,
			data: question
		};
	} catch (e) {
		console.log(e)
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.updateQuestionAsync = async (id, body) => {
	try {
		const question = await QUESTION.findOneAndUpdate(
			{ _id: id },
			body,
			{
				new: true
			}
		);

		return {
			message: 'Successfully update Question',
			success: true,
			data: question
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.deleteQuestionAsync = async id => {
	try {
		const question = await QUESTION.deleteOne({ _id: id });
		return {
			message: 'Successfully delete Question',
			success: true
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.getAllQuestionByGroupAsync = async groupQuestionId => {
	try {
		const listQuestion = await QUESTION.find({groupQuestion: groupQuestionId}).sort({ createdAt: -1 });
		return {
			message: 'Successfully get all Question by group question',
			success: true,
			data: listQuestion
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.checkUserAnswerQuestion = async body => {
	try {
		const { customerId,groupQuestionId } = body;
		const listQuestion = await QUESTION.find({groupQuestion: groupQuestionId}).sort({ createdAt: -1 });
		if(listQuestion[0] == null || listQuestion[0] == undefined)
			return {
				message: 'Group Question does not question',
				success: false
			};

		var answer = await ANSWER.find({customerId: customerId,questionId: listQuestion[0].questionId});
		var checkAnswer = false;
		if(answer != null )
			checkAnswer = true;

		return {
			message: 'Successfully check user answer question',
			success: true,
			data: checkAnswer
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};