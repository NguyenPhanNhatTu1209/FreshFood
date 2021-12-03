const controller = require('./controller');
const cartServices = require('../services/cart.service');
const orderServices = require('../services/order.service');
const productServices = require('../services/product.service');
const shipFeeServices = require('../services/shipFee.service');
const ORDER = require('../models/Order.model');
const USER = require('../models/User.model');
const DEVICE = require('../models/Device.model');

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
		var arrCart = [];
		var totalWeight = 0;
		var totalShip = 0;
		var totalMoney = 0;
		var totalMoneyProduct = 0;
		const admin = await USER.findOne({ role: 1 });
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
				totalMoneyProduct +
				productCurrent.data.price * cartCurrent.data.quantity;
			cartCurrent.data.status = defaultStatusCart.InActive;
			cartCurrent.data.save();
			var cartPush = {
				productId: productCurrent.data.id,
				price: productCurrent.data.price,
				quantity: cartCurrent.data.quantity,
				weight: productCurrent.data.weight,
				name: productCurrent.data.name,
				image: productCurrent.data.image,
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
					weight: totalWeight * 1000
				},
				headers: { Token: configEnv.API_GHTK }
			})
			.then(function (response) {
				totalShip = response.data.fee.fee;
				console.log(response.data);
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
			});
		totalMoney = totalMoneyProduct + totalShip;
		req.value.body.area = req.value.body.area;
		req.value.body.product = arrCart;
		req.value.body.shipFee = totalShip;
		req.value.body.totalMoney = totalMoney;
		req.value.body.totalMoneyProduct = totalMoneyProduct;
		req.value.body.history = history;
		console.log(req.value.body);
		const resServices = await orderServices.createOrderAsync(req.value.body);
		var changePriceOrder = FormatDollar(totalMoney / 24000);
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
				if (admin) {
					const devices = await DEVICE.find({
						creatorUser: admin._id,
						statusDevice: 1
					});
					var newArr = devices.map(val => {
						return val.fcm;
					});
					pushMultipleNotification(
						'Khách hàng mới tạo đơn',
						'Hãy kiểm tra yêu cầu và xác nhận đơn hàng',
						'',
						{
							action: 'NEW_ORDER',
							_id: `${idOrderNew}`
						},
						newArr
					);
				}
			} else if (req.value.body.typePaymentOrder == defaultPayment.VNPay) {
				var ipAddr =
				req.headers['x-forwarded-for'] ||
				req.connection.remoteAddress ||
				req.socket.remoteAddress ||
				req.connection.socket.remoteAddress;
			var tmnCode = 'ME42CH34';
			var secretKey = 'XNMGSWNPSCFQPUFDPXZBERQFLZFBKBKR';
			var vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
			var returnUrl = 'http://18.140.53.176:3005/user/successVnPay';
			var date = new Date();
			var createDate =
				date.getFullYear() +
				('0' + (date.getMonth() + 1)).slice(-2) +
				('0' + date.getDate()).slice(-2) +
				('0' + date.getHours()).slice(-2) +
				('0' + date.getMinutes()).slice(-2) +
				('0' + date.getSeconds()).slice(-2);
			var orderId = createDate.slice(8, 14);
			var amount = totalMoney;
			var bankCode = 'NCB';
			var orderInfo = idOrderNew;
			var orderType = 'other';
			var locale = 'vn';

			var currCode = 'VND';
			var vnp_Params = {};
			vnp_Params['vnp_Version'] = '2.1.0';
			vnp_Params['vnp_Command'] = 'pay';
			vnp_Params['vnp_TmnCode'] = tmnCode;
			// vnp_Params['vnp_Merchant'] = ''
			vnp_Params['vnp_Locale'] = locale;
			vnp_Params['vnp_CurrCode'] = currCode;
			vnp_Params['vnp_TxnRef'] = orderId;
			vnp_Params['vnp_OrderInfo'] = idOrderNew;
			vnp_Params['vnp_OrderType'] = orderType;
			vnp_Params['vnp_Amount'] = amount * 100;
			vnp_Params['vnp_ReturnUrl'] = returnUrl;
			vnp_Params['vnp_IpAddr'] = ipAddr;
			vnp_Params['vnp_CreateDate'] = createDate;
			if (bankCode !== null && bankCode !== '') {
				vnp_Params['vnp_BankCode'] = bankCode;
			}

			vnp_Params = sortObject(vnp_Params);

			var querystring = require('qs');
			var signData = querystring.stringify(vnp_Params, { encode: false });
			var crypto = require('crypto');
			var hmac = crypto.createHmac('sha512', secretKey);
			var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
			vnp_Params['vnp_SecureHash'] = signed;
			vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

			if (admin) {
				const devices = await DEVICE.find({
					creatorUser: admin._id,
					statusDevice: 1
				});
				var newArr = devices.map(val => {
					return val.fcm;
				});
				pushMultipleNotification(
					'Khách hàng mới tạo đơn',
					'Hãy kiểm tra yêu cầu và xác nhận đơn hàng',
					'',
					{
						action: 'NEW_ORDER',
						_id: `${idOrderNew}`
					},
					newArr
				);
			}
			return controller.sendSuccess(
				res,
				{ link: vnpUrl },
				200,
				'Success'
			);
			} else {
				var updateOrder = await ORDER.findOneAndUpdate(
					{ _id: idOrderNew },
					{ typePayment: 'COD' },
					{ new: true }
				);
				if (admin) {
					const devices = await DEVICE.find({
						creatorUser: admin._id,
						statusDevice: 1
					});
					var newArr = devices.map(val => {
						return val.fcm;
					});
					pushMultipleNotification(
						'Khách hàng mới tạo đơn',
						'Hãy kiểm tra yêu cầu và xác nhận đơn hàng',
						'',
						{
							action: 'NEW_ORDER',
							_id: `${idOrderNew}`
						},
						newArr
					);
				}
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
		const userCreateOrder = await USER.findOne({ id: resServices.data.customerId });

		if (userCreateOrder) {
			const devices = await DEVICE.find({
				creatorUser: userCreateOrder._id,
				statusDevice: 1
			});
			var newArr = devices.map(val => {
				return val.fcm;
			});
			pushMultipleNotification(
				'Đơn hàng của bạn mới chuyển trạng thái',
				'Hãy kiểm tra đơn hàng ngay',
				'',
				{
					action: 'UPDATE_STATUS_ORDER',
					_id: `${resServices.data._id}`
				},
				newArr
			);
		}
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
			return controller.sendSuccessPaging(
				res,
				resServices.data,
				resServices.numberPage,
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
exports.GetOrderByAdminAsync = async (req, res, next) => {
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
		const resServices = await orderServices.GetOrderByAdmin(query);
		if (resServices.success) {
			return controller.sendSuccessPaging(
				res,
				resServices.data,
				resServices.numberPage,
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
		console.log('bodyne');
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
			nameGroup: productCurrent.data.groupProduct.name,
			image: productCurrent.data.image
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
					weight: totalWeight * 1000
				},
				headers: { Token: configEnv.API_GHTK }
			})
			.then(function (response) {
				totalShip = response.data.fee.fee;
				console.log(response.data);
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
			});
		totalMoney = totalMoneyProduct + totalShip;
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
				var tmnCode = 'ME42CH34';
				var secretKey = 'XNMGSWNPSCFQPUFDPXZBERQFLZFBKBKR';
				var vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
				var returnUrl = 'http://18.140.53.176:3005/user/successVnPay';
				var date = new Date();
				var createDate =
					date.getFullYear() +
					('0' + (date.getMonth() + 1)).slice(-2) +
					('0' + date.getDate()).slice(-2) +
					('0' + date.getHours()).slice(-2) +
					('0' + date.getMinutes()).slice(-2) +
					('0' + date.getSeconds()).slice(-2);
				var orderId = createDate.slice(8, 14);
				var amount = totalMoney;
				var bankCode = 'NCB';
				var orderInfo = idOrderNew;
				var orderType = 'other';
				var locale = 'vn';

				var currCode = 'VND';
				var vnp_Params = {};
				vnp_Params['vnp_Version'] = '2.1.0';
				vnp_Params['vnp_Command'] = 'pay';
				vnp_Params['vnp_TmnCode'] = tmnCode;
				// vnp_Params['vnp_Merchant'] = ''
				vnp_Params['vnp_Locale'] = locale;
				vnp_Params['vnp_CurrCode'] = currCode;
				vnp_Params['vnp_TxnRef'] = orderId;
				vnp_Params['vnp_OrderInfo'] = idOrderNew;
				vnp_Params['vnp_OrderType'] = orderType;
				vnp_Params['vnp_Amount'] = amount * 100;
				vnp_Params['vnp_ReturnUrl'] = returnUrl;
				vnp_Params['vnp_IpAddr'] = ipAddr;
				vnp_Params['vnp_CreateDate'] = createDate;
				if (bankCode !== null && bankCode !== '') {
					vnp_Params['vnp_BankCode'] = bankCode;
				}

				vnp_Params = sortObject(vnp_Params);

				var querystring = require('qs');
				var signData = querystring.stringify(vnp_Params, { encode: false });
				var crypto = require('crypto');
				var hmac = crypto.createHmac('sha512', secretKey);
				var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
				vnp_Params['vnp_SecureHash'] = signed;
				vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

				// res.status(200).json({ code: '00', data: vnpUrl });
				return controller.sendSuccess(
					res,
					{ link: vnpUrl },
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
