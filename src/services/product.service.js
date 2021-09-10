const USER = require('../models/User.model');
const { defaultRoles } = require('../config/defineModel');
const GROUPPRODUCT = require('../models/GroupProduct.model');
const PRODUCT = require('../models/Product.model');

exports.createProductAsync = async body => {
	try {
		var groupProduct = await GROUPPRODUCT.findOne({ key: body.groupProduct });
		if (groupProduct == null)
			return {
				message: 'GroupProduct not exit',
				success: false
			};
		body.groupProduct = {
			name: groupProduct.name,
			key: groupProduct.key
		};
		const product = new PRODUCT(body);
		await product.save();
		return {
			message: 'Successfully create Product',
			success: true,
			data: product
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.updateProductAsync = async (id, body) => {
	try {
		console.log(id);
		var groupProduct = await GROUPPRODUCT.findOne({ key: body.groupProduct });
		if (groupProduct == null)
			return {
				message: 'GroupProduct not exit',
				success: false
			};
		body.groupProduct = {
			name: groupProduct.name,
			key: groupProduct.key
		};
		const product = await PRODUCT.findOneAndUpdate({ _id: id }, body, {
			new: true
		});
		console.log(product)
		return {
			message: 'Successfully update Product',
			success: true,
			data: product
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.deleteProductAsync = async id => {
	try {
		const product = await PRODUCT.findOneAndUpdate(
			{ _id: id },
			{ status: 'DELETED' },
			{ new: true }
		);
		return {
			message: 'Successfully delete Product',
			success: true,
			data: product
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.findProductByIdAsync = async id => {
	try {
		const product = await PRODUCT.findById(id);
		return {
			message: 'Successfully Get Product',
			success: true,
			data: product
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
