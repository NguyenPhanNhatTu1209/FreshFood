const { defaultRoles } = require('../config/defineModel');
const CART = require('../models/Cart.model')


exports.createCartAsync = async body => {
	try {
		const cart = new CART(body);
		await cart.save();
		return {
			message: 'Successfully create Cart',
			success: true,
			data: product
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.updateCartAsync = async (id, body) => {
	try {
		const cart = await CART.findOneAndUpdate(
			{ _id: id },
			body,
			{
				new: true
			}
		);
		return {
			message: 'Successfully update Cart',
			success: true,
			data: cart
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.deleteCartAsync = async (id) => {
	try {
		const cart = await CART.deleteOne({_id: id});
		return {
			message: 'Successfully delete Cart',
			success: true,
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};