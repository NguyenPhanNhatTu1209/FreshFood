const controller = require('./controller');
const cartServices = require('../services/cart.service');
const productServices = require('../services/product.service');
const { defaultRoles } = require('../config/defineModel');
exports.createCartAsync = async (req, res, next) => {
	try {
		const { decodeToken } = req.value.body;
		const id = decodeToken.data.id;
		console.log(id)
		req.value.body.customerId = id;
		const productCurrent = await productServices.findProductByIdAsync(req.value.body.productId);
		if(productCurrent.success != true)
		{
			return controller.sendSuccess(
				res,
				productCurrent.data,
				300,
				productCurrent.message
			);
		}
		req.value.body.name = productCurrent.data.name;
		req.value.body.nameGroup = productCurrent.data.groupProduct.name;
		console.log(req.value.body);
		const resServices = await cartServices.createCartAsync(req.value.body);
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
exports.updateCartAsync = async (req, res, next) => {
	try {
		const resServices = await cartServices.updateCartAsync(req.value.body.id,req.value.body);
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
exports.GetCartAsync = async (req, res, next) => {
	try {
		const { decodeToken } = req.value.body;
		const id = decodeToken.data.id;
		const resServices = await cartServices.getAllCartByIdUser(id);
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
exports.deleteCartAsync = async (req, res, next) => {
	try {
		const resServices = await cartServices.deleteCartAsync(req.query.id);
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