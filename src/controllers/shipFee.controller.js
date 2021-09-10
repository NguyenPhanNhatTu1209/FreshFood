const controller = require('./controller');
const shipFeeServices = require('../services/shipFee.service');
const { defaultRoles } = require('../config/defineModel');
exports.createShipFeetAsync = async (req, res, next) => {
	try {
		const resServices = await shipFeeServices.createShipFeeAsync(req.value.body);
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
		// bug
		console.log(error);
		return controller.sendError(res);
	}
};
exports.updateShipFeeAsync = async (req, res, next) => {
	try {
		const resServices = await shipFeeServices.updateShipFeeAsync(req.value.body.id,req.value.body);
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
		// bug
		console.log(error);
		return controller.sendError(res);
	}
};
exports.deleteShipFeeAsync = async (req, res, next) => {
	try {
		const resServices = await shipFeeServices.deleteShipFeeAsync(req.query.id);
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
		// bug
		console.log(error);
		return controller.sendError(res);
	}
};