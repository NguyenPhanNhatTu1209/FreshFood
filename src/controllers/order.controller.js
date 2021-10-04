const controller = require('./controller');
const cartServices = require('../services/cart.service');
const orderServices = require('../services/order.service');
const productServices = require('../services/product.service');
const shipFeeServices = require('../services/shipFee.service');

const { defaultRoles, defaultStatusCart } = require('../config/defineModel');
exports.createOrderAsync = async (req, res, next) => {
	try {
		const { decodeToken } = req.value.body;
		const id = decodeToken.data.id;
		console.log(id);
		req.value.body.customerId = id;
		var arrCart = [];
		var totalWeight = 0;
		var totalShip = 0;
		var totalMoney = 0;
		for(let i = 0;i < req.value.body.cartId.length;i++)
		{
			var cartCurrent = await cartServices.getCartByIdAsync(req.value.body.cartId[i]);
			if(cartCurrent.success != true)
			{
				return controller.sendSuccess(
					res,
					cartCurrent.data,
					300,
					cartCurrent.message
				);
			}
			var productCurrent = await productServices.findProductByIdAsync(cartCurrent.data.productId)
			if(productCurrent.success != true)
			{
				return controller.sendSuccess(
					res,
					productCurrent.data,
					300,
					productCurrent.message
				);
			}
			totalWeight = totalWeight + cartCurrent.data.quantity * productCurrent.data.weight;
			totalMoney = totalMoney + productCurrent.data.price *cartCurrent.data.quantity;
			cartCurrent.data.status = defaultStatusCart.InActive;
			cartCurrent.data.save();
			var cartPush = {
				productId: productCurrent.data.id,
				price: productCurrent.data.price,
				quantity: cartCurrent.data.quantity,
				weight: productCurrent.data.weight,
				name: productCurrent.data.name,
				nameGroup: productCurrent.data.groupProduct.name
			}
			arrCart.push(cartPush)
		}
		
		var areaShip = await shipFeeServices.getShipFeeByIdAsync(req.value.body.area);
		totalShip = areaShip.data.fee * totalWeight;
		var history = {
			title: "Đơn hàng vừa mới tạo",
			createdAt: Date.now()
		}
		req.value.body.area = req.value.body.area;
		req.value.body.product = arrCart;
		req.value.body.shipFee =totalShip;
		req.value.body.totalMoney =totalMoney;
		req.value.body.history = history;
		const resServices = await orderServices.createOrderAsync(req.value.body);
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
exports.updateOrderAsync = async (req, res, next) => {
	try {
		const resServices = await orderServices.updateOrderAsync(req.value.body.id,req.value.body);
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
		console.log(req.query.id)
		const resServices = await orderServices.cancelOrderAsync(req.query.id);
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
exports.GetOrderByUserAsync = async (req, res, next) => {
	try {
		const { decodeToken } = req.value.body;
		const id = decodeToken.data.id;
		let query = {
			search: req.query.search || '',
			limit: req.query.limit || '15',
			skip: req.query.skip || '1',
			status: req.query.status || '',
			customerId: id,
		};
		const resServices = await orderServices.GetOrderByUser(query);
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