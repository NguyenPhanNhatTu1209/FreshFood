const { defaultRoles, defaultStatusCart } = require('../config/defineModel');
const EVELUATE = require('../models/Eveluate.model')
const PRODUCT = require('../models/Product.model')
const uploadServices = require('../services/uploadS3.service');



exports.createEveluateAsync = async body => {
	try {
		console.log("eveluate ne")
		console.log(body)
		const eveluate = new EVELUATE(body);
		await eveluate.save();
		return {
			message: 'Successfully create eveluate',
			success: true,
			data: eveluate
		};
	} catch (e) {
		console.log(e)
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.updateEveluateAsync = async (id, body) => {
	try {
		const eveluate = await EVELUATE.findOneAndUpdate(
			{ _id: id },
			body,
			{
				new: true
			}
		);
		return {
			message: 'Successfully update Eveluate',
			success: true,
			data: eveluate
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.deleteEveluateAsync = async (id) => {
	try {
		const eveluate = await EVELUATE.deleteOne({_id: id});
		return {
			message: 'Successfully delete Eveluate',
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
exports.getEveluateByOrderAndUserAndProductAsync = async (customerId,orderId,productId) => {
	try {
		const eveluate = await EVELUATE.find({customerId: customerId,orderId: orderId, productId: productId});
		console.log("danh gia trc");
		console.log(customerId)
		console.log(orderId)
		console.log(productId)

		console.log(eveluate)
		return {
			message: 'Successfully get Eveluate',
			success: true,
			data: eveluate
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.getEveluateByProduct = async (body) => {
	try {
		const { productId, skip, limit } = body;
		console.log("body");
		console.log(body);
		const eveluates = await EVELUATE.find({productId: productId}).sort({createdAt: -1}).skip(Number(limit) * Number(skip) - Number(limit)).limit(Number(limit))
		return {
			message: 'Successfully Get eveluates',
			success: true,
			data: eveluates
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};