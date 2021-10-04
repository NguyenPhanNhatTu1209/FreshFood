const { defaultRoles } = require('../config/defineModel');
const SHIPFEE = require('../models/ShipFee.model')


exports.createShipFeeAsync = async body => {
	try {
		const shipFee = new SHIPFEE(body);
		await shipFee.save();
		return {
			message: 'Successfully create ShippFee',
			success: true,
			data: shipFee
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.updateShipFeeAsync = async (id, body) => {
	try {
		const shipFee = await SHIPFEE.findOneAndUpdate(
			{ _id: id },
			body,
			{
				new: true
			}
		);
		return {
			message: 'Successfully update ShippFee',
			success: true,
			data: shipFee
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.deleteShipFeeAsync = async (id) => {
	try {
		const shipFee = await SHIPFEE.deleteOne({_id: id});
		return {
			message: 'Successfully delete ShippFee',
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
exports.getShipFeeByIdAsync = async (id) => {
	try {
		const shipFee = await SHIPFEE.findById(id);
		console.log(shipFee)
		return {
			message: 'Successfully Get ShippFee',
			success: true,
			data: shipFee
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.getAllShipFee = async (id) => {
	try {
		const shipFee = await SHIPFEE.find().sort({ createdAt: -1 });
		console.log(shipFee)
		return {
			message: 'Successfully Get ShippFee',
			success: true,
			data: shipFee
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};