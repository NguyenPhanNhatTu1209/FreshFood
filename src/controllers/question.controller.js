const controller = require('./controller');
const questionService = require('../services/question.service');
const { defaultRoles } = require('../config/defineModel');
exports.createQuestionAsync = async (req, res, next) => {
	try {
		const resServices = await questionService.createQuestionAsync(
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
exports.updateQuestionAsync = async (req, res, next) => {
	try {
		const resServices = await questionService.updateQuestionAsync(
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
exports.deleteQuestionAsync = async (req, res, next) => {
	try {
		const resServices = await questionService.deleteQuestionAsync(
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
exports.GetAllQuestionByGroupAsync = async (req, res, next) => {
	try {
    const { id } = req.params;
		var resServices = await questionService.getAllQuestionByGroupAsync(id);

		if (resServices.success) {
      resServices.data = resServices.data.sort(() => Math.random() - 0.5)
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
