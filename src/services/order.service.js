const { defaultRoles, defaultStatusProduct, defaultStatusOrder } = require('../config/defineModel');
const CART = require('../models/Cart.model');
const ORDER = require('../models/Order.model');
const PRODUCT = require('../models/Product.model');
const SHIPFEE =require('../models/ShipFee.model');
const { body } = require('../validators');
const uploadServices = require('../services/uploadS3.service');

exports.createOrderAsync = async body => {
	const session = await ORDER.startSession();
	session.startTransaction();
	let check = 0;
	while (true) {
		try {
			if (body.product.length == 0) {
				return {
					message: 'No item quantity available',
					success: false
				};
			}
			while (check < body.product.length) {
				const session1 = await PRODUCT.startSession();
				session1.startTransaction();
				console.log(body.product.length);

				for (let i = 0; i < body.product.length; i++) {
					var currentProduct = await PRODUCT.findById(body.product[i].productId);
					console.log(currentProduct.name);
					var quantityProduct = currentProduct.quantity;
					if (quantityProduct < body.product[i].quantity) {
						session1.endSession(); // ko chac co hay khong
						return {
							message: 'Not enough quantity',
							success: false
						};
					}
					currentProduct.quantity =
						currentProduct.quantity - body.product[i].quantity;
					currentProduct.sold = currentProduct.sold + body.product[i].quantity;
					if(currentProduct.quantity == 0)
					{
						currentProduct.status = defaultStatusProduct.InActive;
					}
					console.log(currentProduct.quantity);
					currentProduct.save();
					check = check+1;
				}
				session1.commitTransaction();
				session1.endSession();
			}
			let arr = await ORDER.find();
			if (arr.length >= 1) {
				var orderCode = arr[arr.length - 1].orderCode;
				var splitted = orderCode.split('-', 2);
				let number = splitted[1];
				let bill = `${Number(number) + 1}`;
				let newBillCode = '0'.repeat(8 - bill.length) + bill;
				newBillCode = "FF" + '-' + newBillCode;
				body.orderCode = newBillCode;
			} else {
				let bill = `1`;
				let newBillCode = '0'.repeat(8 - bill.length) + bill;
				newBillCode = "FF" + '-' + newBillCode;
				body.orderCode = newBillCode;
			}
			const order = new ORDER(body);
			await order.save();
			session.commitTransaction();
			session.endSession();
			return {
				message: 'Successfully create Order',
				success: true,
				data: order
			};
		} catch (e) {
			console.log(e);
			return {
				message: 'An error occurred',
				success: false
			};
		}
	}
};
exports.updateOrderAsync = async (id, body) => {
	try {
		var address = await SHIPFEE.findById(body.area);
		var ordersCurrent = await ORDER.findById(id);
		let totalWeight = 0;
		let totalShip = 0;
		for(let i=0;i<ordersCurrent.product.length;i++)
		{
			totalWeight = totalWeight + ordersCurrent.product[i].quantity * ordersCurrent.product[i].weight;
		}
		totalShip = address.fee * totalWeight;
		body.shipFee = totalShip;
		const order = await ORDER.findOneAndUpdate({ _id: id }, body, {
			new: true
		});
		return {
			message: 'Successfully update Order',
			success: true,
			data: order
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.updateStatusOrderAsync = async (id, body) => {
	try {
		console.log(body)
		const order = await ORDER.findOneAndUpdate({ _id: id }, body, {
			new: true
		});
		return {
			message: 'Successfully update status Order',
			success: true,
			data: order
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.cancelOrderAsync = async id => {
	try {
		var ordersCurrent = await ORDER.findById(id);
		console.log(ordersCurrent)
		var productOrder = ordersCurrent.product;
		for (let i = 0; i < productOrder.length; i++) {
			var productCurrent = await PRODUCT.findById(productOrder[i].productId);
			productCurrent.quantity =
				productCurrent.quantity + productOrder[i].quantity;
			productCurrent.sold = productCurrent.sold + productOrder[i].quantity;
			productCurrent.status = defaultStatusProduct.Active;
			productCurrent.save();
		}
		const orders = await ORDER.findOneAndUpdate(
			{ _id: id },
			{ status: defaultStatusOrder.DaHuy },
			{ new: true }
		);
		return {
			message: 'Successfully delete orders',
			success: true,
			data: orders
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.GetOrderByUser = async body => {
	try {
		const { search,skip,limit,status, customerId} = body;
		var ordersCurrent = await ORDER.find({ customerId: customerId, status: status }).sort({createdAt: -1}).skip(Number(limit) * Number(skip) - Number(limit)).limit(Number(limit));
		var ordersSearch  = [];
		console.log(ordersCurrent.length)
		for(let i=0;i<ordersCurrent.length;i++)
		{
			for(let j = 0;j<ordersCurrent[i].product.length;j++)
			{
				var convertSearch = search.toLocaleLowerCase();
				var nameProduct = ordersCurrent[i].product[j].name.toLocaleLowerCase();
				if(nameProduct.includes(convertSearch) == true)
					{
						var resultImage = [];
						// var productCurrent = await PRODUCT.findById(ordersCurrent[i].product[j].productId);
						var image = await uploadServices.getImageS3(ordersCurrent[i].product[j].image[0]);
						resultImage.push(image);
						ordersCurrent[i].product[j].image = resultImage;						
						ordersSearch.push(ordersCurrent[i]);
						break;
					}
			}
		}
		console.log("ordersSearch[0].product")

		console.log(ordersSearch[0].product)

		return {
			message: 'Successfully get orders',
			success: true,
			data: ordersSearch
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.findOrderByIdAsync = async id => {
	try {
		console.log(id);
		const order = await ORDER.findById(id);
		return {
			message: 'Successfully Get Product',
			success: true,
			data: order
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};