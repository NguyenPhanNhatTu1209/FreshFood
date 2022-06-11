const controller = require('./controller');
const iventoryHistoryServices = require('../services/iventoryHistory.service');
const productServices = require('../services/product.service');
const { defaultRoles, defaultStatusCart } = require('../config/defineModel');
exports.createIventoryHistoryAsync = async (req, res, next) => {
	try {
    const { decodeToken } = req.value.body;
		const id = decodeToken.data.id;
    var  body = {
      idUser: id,
      history: req.value.body.array
    }

		const resServices = await iventoryHistoryServices.createIventoryHistoryAsync(body); 
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

exports.updateIventoryHistoryAsync = async (req, res, next) => {
	try {
    const { decodeToken } = req.value.body;
		const id = decodeToken.data.id;
    var  body = {
      idUser: id,
      history: req.value.body.array
    }

		const resServices = await iventoryHistoryServices.createIventoryHistoryAsync(body); 
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

exports.GetIventoryHistoryAsync = async (req, res, next) => {
	try {
		var query = {
			limit: req.query.limit || '15',
			skip: req.query.skip || '1'
		};

		const resServices = await iventoryHistoryServices.getAllIventoryHistoryAsync(query);
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