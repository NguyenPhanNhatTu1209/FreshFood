const controller = require('./controller');
const groupQuestionServices = require('../services/groupQuestion.service');
const { defaultRoles } = require('../config/defineModel');
exports.createGroupQuestionAsync = async (req, res, next) => {
	try {
		const resServices = await groupQuestionServices.createGroupQuestionAsync(
			req.value.body
		);
		if (resServices.success) {
			return controller.sendSuccess(
				res,
				resServices.data,
				200,
				resServices.message
			);
		}

		return controller.sendSuccess(
			res,
			resServices.data,
			300,
			resServices.message
		);
	} catch (error) {
		console.log(error);
		return controller.sendError(res);
	}
};
exports.updateGroupQuestionAsync = async (req, res, next) => {
	try {
		const resServices = await groupQuestionServices.updateGroupQuestionAsync(
			req.value.body.id,
			req.value.body
		);
		if (resServices.success) {
			return controller.sendSuccess(
				res,
				resServices.data,
				200,
				resServices.message
			);
		}

		return controller.sendSuccess(
			res,
			resServices.data,
			300,
			resServices.message
		);
	} catch (error) {
		console.log(error);
		return controller.sendError(res);
	}
};
exports.deleteGroupQuestionAsync = async (req, res, next) => {
	try {
		const resServices = await groupQuestionServices.deleteGroupQuestionAsync(
			req.query.id
		);
		if (resServices.success) {
			return controller.sendSuccess(
				res,
				resServices.data,
				200,
				resServices.message
			);
		}

		return controller.sendSuccess(
			res,
			resServices.data,
			300,
			resServices.message
		);
	} catch (error) {
		console.log(error);
		return controller.sendError(res);
	}
};
exports.GetAllGroupQuestionAsync = async (req, res, next) => {
	try {
		const resServices = await groupQuestionServices.getAllGroupQuestionAsync();
		if (resServices.success) {
			return controller.sendSuccess(
				res,
				resServices.data,
				200,
				resServices.message
			);
		}

		return controller.sendSuccess(
			res,
			resServices.data,
			300,
			resServices.message
		);
	} catch (error) {
		console.log(error);
		return controller.sendError(res);
	}
};
