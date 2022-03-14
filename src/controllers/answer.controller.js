const controller = require('./controller');
const answerService = require('../services/answer.service');
const { defaultRoles } = require('../config/defineModel');
exports.createAnswerAsync = async (req, res, next) => {
	try {
    const { decodeToken } = req.value.body;
		const userId = decodeToken.data.id;

    const checkAnswer = await answerService.getAnswerByIdQuestion(req.value.body.questionId,userId);
    if(checkAnswer.data != null)
      return controller.sendSuccess(
        res,
        null,
        300,
        "User answered the question"
      );

		req.value.body.userId = userId;
		const resServices = await answerService.createAnswerAsync(
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
