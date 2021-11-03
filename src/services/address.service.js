const { defaultRoles, defaultStatusCart } = require('../config/defineModel');
const ADDRESS = require('../models/address.model')

const uploadServices = require('../services/uploadS3.service');



exports.createAddressAsync = async body => {
	try {
		const address = new ADDRESS(body);
		await address.save();
		return {
			message: 'Successfully create Address',
			success: true,
			data: address
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.updateAddressAsync = async (id, body) => {
	try {
		const address = await ADDRESS.findOneAndUpdate(
			{ _id: id },
			body,
			{
				new: true
			}
		);
		return {
			message: 'Successfully update Address',
			success: true,
			data: address
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.deleteAddressAsync = async (id) => {
	try {
		const address = await ADDRESS.deleteOne({_id: id});
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
exports.getAddressByIdAsync = async (id) => {
	try {
		const address = await ADDRESS.findById(id);
		return {
			message: 'Successfully get Address',
			success: true,
			data: address
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.getAllAddressByIdUser = async (id) => {
	try {
		const arrAddress = await ADDRESS.find({customerId: id}).sort({createdAt: -1});
		return {
			message: 'Successfully Get Address',
			success: true,
			data: arrAddress
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};