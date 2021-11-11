const controller = require('./controller');
const cartServices = require('../services/cart.service');
const orderServices = require('../services/order.service');
const productServices = require('../services/product.service');
const shipFeeServices = require('../services/shipFee.service');
const ORDER = require('../models/Order.model');
const axios = require('axios').default;
const {
	defaultRoles,
	defaultStatusCart,
	defaultPayment
} = require('../config/defineModel');
const { paymentMethod, FormatDollar, sortObject } = require('../helper');
const { configEnv } = require('../config');
exports.createOrderAsync = async (req, res, next) => {
	try {
		const { decodeToken } = req.value.body;
		const id = decodeToken.data.id;
		console.log(id);
		req.value.body.customerId = id;
		console.log("bodyne")
		// console.log(req.value.body);
		var arrCart = [];
		var totalWeight = 0;
		var totalShip = 0;
		var totalMoney = 0;
		var totalMoneyProduct = 0;
		for (let i = 0; i < req.value.body.cartId.length; i++) {
			var cartCurrent = await cartServices.getCartByIdAsync(
				req.value.body.cartId[i]
			);
			if (cartCurrent.success != true) {
				return controller.sendSuccess(
					res,
					cartCurrent.data,
					300,
					cartCurrent.message
				);
			}
			var productCurrent = await productServices.findProductByIdAsync(
				cartCurrent.data.productId
			);
			if (productCurrent.success != true) {
				return controller.sendSuccess(
					res,
					productCurrent.data,
					300,
					productCurrent.message
				);
			}
			totalWeight =
				totalWeight + cartCurrent.data.quantity * productCurrent.data.weight;
			totalMoneyProduct =
				totalMoneyProduct + productCurrent.data.price * cartCurrent.data.quantity;
			cartCurrent.data.status = defaultStatusCart.InActive;
			cartCurrent.data.save();
			var cartPush = {
				productId: productCurrent.data.id,
				price: productCurrent.data.price,
				quantity: cartCurrent.data.quantity,
				weight: productCurrent.data.weight,
				name: productCurrent.data.name,
				nameGroup: productCurrent.data.groupProduct.name
			};
			arrCart.push(cartPush);
		}
		var history = {
			title: 'Đơn hàng vừa mới tạo',
			createdAt: Date.now()
		};
		await axios
			.get('https://services.giaohangtietkiem.vn/services/shipment/fee', {
				params: {
					address: req.value.body.area.address,
					province: req.value.body.area.province,
					district: req.value.body.area.district,
					pick_province: 'Hồ Chí Minh',
					pick_district: 'Thủ Đức',
					weight: totalWeight*1000
				},
				headers: { Token: configEnv.API_GHTK }
			})
			.then( function (response) {
				totalShip =  response.data.fee.fee;
				console.log(response.data);
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
			});
		totalMoney = totalMoneyProduct+ totalShip;
		req.value.body.area = req.value.body.area;
		req.value.body.product = arrCart;
		req.value.body.shipFee = totalShip;
		req.value.body.totalMoney = totalMoney;
		req.value.body.totalMoneyProduct = totalMoneyProduct;
		req.value.body.history = history;
		console.log(req.value.body);
		const resServices = await orderServices.createOrderAsync(req.value.body);
		var changePriceOrder = FormatDollar(totalMoney / 24000);
		console.log(changePriceOrder);
		var resultPayment;
		if (resServices.success) {
			var idOrderNew = resServices.data._id;
			if (req.value.body.typePaymentOrder == defaultPayment.PayPal) {
				paymentMethod(
					changePriceOrder,
					idOrderNew,
					async function (error, payment) {
						if (error) {
							resultPayment = error;
						} else {
							for (let i = 0; i < payment.links.length; i++) {
								if (payment.links[i].rel === 'approval_url') {
									resultPayment = payment.links[i].href;
									console.log(resultPayment);
									return controller.sendSuccess(
										res,
										{ link: resultPayment },
										200,
										'success'
									);
								}
							}
						}
					}
				);
			} else if (req.value.body.typePaymentOrder == defaultPayment.VNPay) {
				var ipAddr =
					req.headers['x-forwarded-for'] ||
					req.connection.remoteAddress ||
					req.socket.remoteAddress ||
					req.connection.socket.remoteAddress;

				const dateFormat = require('dateformat');

				var tmnCode = 'JCO3SG7X';
				var secretKey = 'BKPYNKKKBEAZCHZFHLIXKMXXCODHEVSU';
				var vnpUrl = 'http://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
				var returnUrl = 'http://localhost:3005/user/successVnPay';

				var date = new Date();

				var createDate = dateFormat(date, 'yyyymmddHHmmss');
				var orderId = dateFormat(date, 'HHmmss');
				var amount = totalMoney.toString();
				var bankCode = 'NCB';
				var idOrder = `${idOrderNew}`;
				var orderInfo = idOrder;
				var orderType = 'payment';
				var locale = 'vn';

				var currCode = 'VND';
				var vnp_Params = {};
				vnp_Params['vnp_Version'] = '2';
				vnp_Params['vnp_Command'] = 'pay';
				vnp_Params['vnp_TmnCode'] = tmnCode;
				// vnp_Params['vnp_Merchant'] = ''
				vnp_Params['vnp_Locale'] = locale;
				vnp_Params['vnp_CurrCode'] = currCode;
				vnp_Params['vnp_TxnRef'] = orderId;
				vnp_Params['vnp_OrderInfo'] = orderInfo;
				vnp_Params['vnp_OrderType'] = orderType;
				// id don
				vnp_Params['vnp_Amount'] = amount * 100;
				vnp_Params['vnp_ReturnUrl'] = returnUrl;
				vnp_Params['vnp_IpAddr'] = ipAddr;
				vnp_Params['vnp_CreateDate'] = createDate;
				if (bankCode !== null && bankCode !== '') {
					vnp_Params['vnp_BankCode'] = bankCode;
				}

				vnp_Params = sortObject(vnp_Params);

				var querystring = require('qs');
				var signData =
					secretKey + querystring.stringify(vnp_Params, { encode: false });

				var sha256 = require('sha256');

				var secureHash = sha256(signData);

				vnp_Params['vnp_SecureHashType'] = 'SHA256';
				vnp_Params['vnp_SecureHash'] = secureHash;
				vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true });
				resultPayment = vnpUrl;
				console.log(resultPayment);
				return controller.sendSuccess(
					res,
					{ link: resultPayment },
					200,
					'Success'
				);
			} else {
				var updateOrder = await ORDER.findOneAndUpdate(
					{ _id: idOrderNew },
					{ typePayment: 'COD' },
					{ new: true }
				);
				return controller.sendSuccess(res, updateOrder, 200, 'Success');
			}
		} else {
			return controller.sendSuccess(
				res,
				resServices.data,
				300,
				resServices.message
			);
		}
	} catch (error) {
		// bug
		console.log(error);
		return controller.sendError(res);
	}
};
exports.changeStatusOrder = async (req, res, next) => {
	try {
		var history;
		if (req.value.body.status === 1) {
			history = {
				title: 'Đơn hàng vừa được xác nhận',
				createdAt: Date.now()
			};
		} else if (req.value.body.status === 2) {
			history = {
				title: 'Đơn hàng đang được vận chuyển',
				createdAt: Date.now()
			};
		} else if (req.value.body.status === 3) {
			history = {
				title: 'Đơn hàng đã giao thành công',
				createdAt: Date.now()
			};
		} else {
			history = {
				title: 'Đơn hàng đã bị hủy',
				createdAt: Date.now()
			};
		}
		var bodyNew = {
			status: req.value.body.status
		};
		const resServices = await orderServices.updateStatusOrderAsync(
			req.value.body.id,
			bodyNew
		);
		await resServices.data.history.push(history);
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
		console.log(req.query.id);
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
			customerId: id
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


exports.CreateOrderWithByNowAsync = async (req, res, next) => {
	try {
		const { decodeToken } = req.value.body;
		const id = decodeToken.data.id;
		req.value.body.customerId = id;
		console.log("bodyne");
		console.log(req.value.body);
		var arrProduct = [];
		var totalWeight = 0;
		var totalShip = 0;
		var totalMoney = 0;
		var totalMoneyProduct = 0;
		var productCurrent = await productServices.findProductByIdAsync(
			req.value.body.productId
			);
			totalWeight = req.value.body.quantity * productCurrent.data.weight;
			totalMoneyProduct = productCurrent.data.price * req.value.body.quantity;
			var productPush = {
				productId: productCurrent.data.id,
				price: productCurrent.data.price,
				quantity: req.value.body.quantity,
				weight: productCurrent.data.weight,
				name: productCurrent.data.name,
				nameGroup: productCurrent.data.groupProduct.name
			};
		arrProduct.push(productPush);
		var history = {
			title: 'Đơn hàng vừa mới tạo',
			createdAt: Date.now()
		};
		await axios
			.get('https://services.giaohangtietkiem.vn/services/shipment/fee', {
				params: {
					address: req.value.body.area.address,
					province: req.value.body.area.province,
					district: req.value.body.area.district,
					pick_province: 'Hồ Chí Minh',
					pick_district: 'Thủ Đức',
					weight: totalWeight*1000
				},
				headers: { Token: configEnv.API_GHTK }
			})
			.then( function (response) {
				totalShip =  response.data.fee.fee;
				console.log(response.data);
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
			});
		totalMoney = totalMoneyProduct+ totalShip;
		req.value.body.area = req.value.body.area;
		req.value.body.product = arrProduct;
		req.value.body.shipFee = totalShip;
		req.value.body.totalMoney = totalMoney;
		req.value.body.totalMoneyProduct = totalMoneyProduct;
		req.value.body.history = history;
		console.log(req.value.body);
		const resServices = await orderServices.createOrderAsync(req.value.body);
		var changePriceOrder = FormatDollar(totalMoney / 24000);
		console.log(changePriceOrder);
		var resultPayment;
		if (resServices.success) {
			var idOrderNew = resServices.data._id;
			if (req.value.body.typePaymentOrder == defaultPayment.PayPal) {
				paymentMethod(
					changePriceOrder,
					idOrderNew,
					async function (error, payment) {
						if (error) {
							resultPayment = error;
						} else {
							for (let i = 0; i < payment.links.length; i++) {
								if (payment.links[i].rel === 'approval_url') {
									resultPayment = payment.links[i].href;
									console.log(resultPayment);
									return controller.sendSuccess(
										res,
										{ link: resultPayment },
										200,
										'success'
									);
								}
							}
						}
					}
				);
			} else if (req.value.body.typePaymentOrder == defaultPayment.VNPay) {
				var ipAddr =
					req.headers['x-forwarded-for'] ||
					req.connection.remoteAddress ||
					req.socket.remoteAddress ||
					req.connection.socket.remoteAddress;

				const dateFormat = require('dateformat');

				var tmnCode = 'JCO3SG7X';
				var secretKey = 'BKPYNKKKBEAZCHZFHLIXKMXXCODHEVSU';
				var vnpUrl = 'http://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
				var returnUrl = 'http://localhost:3005/user/successVnPay';

				var date = new Date();

				var createDate = dateFormat(date, 'yyyymmddHHmmss');
				var orderId = dateFormat(date, 'HHmmss');
				var amount = totalMoney.toString();
				var bankCode = 'NCB';
				var idOrder = `${idOrderNew}`;
				var orderInfo = idOrder;
				var orderType = 'payment';
				var locale = 'vn';

				var currCode = 'VND';
				var vnp_Params = {};
				vnp_Params['vnp_Version'] = '2';
				vnp_Params['vnp_Command'] = 'pay';
				vnp_Params['vnp_TmnCode'] = tmnCode;
				// vnp_Params['vnp_Merchant'] = ''
				vnp_Params['vnp_Locale'] = locale;
				vnp_Params['vnp_CurrCode'] = currCode;
				vnp_Params['vnp_TxnRef'] = orderId;
				vnp_Params['vnp_OrderInfo'] = orderInfo;
				vnp_Params['vnp_OrderType'] = orderType;
				// id don
				vnp_Params['vnp_Amount'] = amount * 100;
				vnp_Params['vnp_ReturnUrl'] = returnUrl;
				vnp_Params['vnp_IpAddr'] = ipAddr;
				vnp_Params['vnp_CreateDate'] = createDate;
				if (bankCode !== null && bankCode !== '') {
					vnp_Params['vnp_BankCode'] = bankCode;
				}

				vnp_Params = sortObject(vnp_Params);

				var querystring = require('qs');
				var signData =
					secretKey + querystring.stringify(vnp_Params, { encode: false });

				var sha256 = require('sha256');

				var secureHash = sha256(signData);

				vnp_Params['vnp_SecureHashType'] = 'SHA256';
				vnp_Params['vnp_SecureHash'] = secureHash;
				vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true });
				resultPayment = vnpUrl;
				console.log(resultPayment);
				return controller.sendSuccess(
					res,
					{ link: resultPayment },
					200,
					'Success'
				);
			} else {
				var updateOrder = await ORDER.findOneAndUpdate(
					{ _id: idOrderNew },
					{ typePayment: 'COD' },
					{ new: true }
				);
				return controller.sendSuccess(res, updateOrder, 200, 'Success');
			}
		} else {
			return controller.sendSuccess(
				res,
				resServices.data,
				300,
				resServices.message
			);
		}
	} catch (error) {
		// bug
		console.log(error);
		return controller.sendError(res);
	}
};