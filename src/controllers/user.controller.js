const controller = require('./controller');
const userServices = require('../services/user.services');
const { defaultRoles } = require('../config/defineModel');

exports.registerAsync = async (req, res, next) => {
	try {
		const resServices = await userServices.registerUserAsync(req.value.body);
		if (!resServices.success)
			return controller.sendSuccess(
				res,
				resServices.data,
				300,
				resServices.message
			);
		return controller.sendSuccess(
			res,
			resServices.data,
			200,
			resServices.message
		);
	} catch (err) {
		console.log(err);
		return controller.sendError(res);
	}
};

exports.loginAsync = async (req, res, next) => {
	try {
		const resServices = await userServices.loginAsync(req.value.body);
		if (!resServices.success) {
			return controller.sendSuccess(res, {}, 300, resServices.message);
		}
		return controller.sendSuccess(
			res,
			resServices.data,
			200,
			resServices.message
		);
	} catch (err) {
		console.log(err);
		return controller.sendError(res);
	}
};
exports.updateCodeAdminAsync = async (req, res, next) => {
	try {
		const code = req.query.code;
		const resServices = await userServices.updateCodeAdmin({ code: code });
		if (!resServices.success) {
			return controller.sendSuccess(
				res,
				resServices.success,
				300,
				resServices.message
			);
		}

		return controller.sendSuccess(
			res,
			resServices.data,
			200,
			resServices.message
		);
	} catch (error) {
		return controller.sendError(res);
	}
};
exports.forgotPasswordAsync = async (req, res, next) => {
	try {
		const { email } = req.query;
		console.log(email);
		const resServices = await userServices.fotgotPassword({email: email});
		if (!resServices.success) {
			return controller.sendSuccess(
				res,
				resServices.success,
				300,
				resServices.message
			);
		}
		return controller.sendSuccess(
			res,
			resServices.data,
			200,
			resServices.message
		);
	} catch (error) {
		console.log(error);
		return controller.sendError(res);
	}
};
exports.resetPasswordAsync = async (req, res, next) => {
	try {
		const resServices = await userServices.resetPassword(req.value.body);
		if (!resServices.success) {
			return controller.sendSuccess(
				res,
				resServices.success,
				300,
				resServices.message
			);
		}

		return controller.sendSuccess(
			res,
			resServices.data,
			200,
			resServices.message
		);
	} catch (error) {
		console.log(error);
		return controller.sendError(res);
	}
};

exports.loginAsync = async (req, res, next) => {
	try {
		const resServices = await userServices.loginAsync(req.value.body);
		if (!resServices.success) {
			return controller.sendSuccess(res, {}, 300, resServices.message);
		}
		return controller.sendSuccess(
			res,
			resServices.data,
			200,
			resServices.message
		);
	} catch (err) {
		console.log(err);
		return controller.sendError(res);
	}
};

exports.findUserByIdAsync = async (req, res, next) => {
	try {
		const { decodeToken } = req.value.body;
		const _id = decodeToken.data.id;
		const resServices = await userServices.findUser(_id);
		return controller.sendSuccess(
			res,
			resServices.data,
			200,
			resServices.message
		);
	} catch (error) {
		// bug
		console.log(error);
		return controller.sendError(res);
	}
};

exports.changePasswordAsync = async (req, res, next) => {
	try {
		const { decodeToken } = req.value.body;
		const id = decodeToken.data.id;
		const resServices = await userServices.changePasswordAsync(id, req.body);
		if (!resServices.success) {
			return controller.sendSuccess(
				res,
				resServices.success,
				300,
				resServices.message
			);
		}
		return controller.sendSuccess(
			res,
			resServices.success,
			200,
			resServices.message
		);
	} catch (error) {
		return controller.sendError(res);
	}
};
