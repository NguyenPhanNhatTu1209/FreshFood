const { defaultRoles, defaultStatusCart } = require('../config/defineModel');
const DISCOUNT = require('../models/discount.model');
const PRODUCT = require('../models/Product.model');

const uploadServices = require('../services/uploadS3.service');
const { configEnv } = require('../config');

exports.createDiscountAsync = async body => {
	try {
		console.log(body)
		const discount = new DISCOUNT(body);
		console.log("abc")
		await discount.save();
		return {
			message: 'Successfully create discount',
			success: true,
			data: discount
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.updateDiscountAsync = async (id, body) => {
	try {
		const discount = await DISCOUNT.findOneAndUpdate({ _id: id }, body, {
			new: true
		});
		return {
			message: 'Successfully update DISCOUNT',
			success: true,
			data: discount
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.deleteDiscontAsync = async id => {
	try {
		const discount = await DISCOUNT.deleteOne({ _id: id });
		return {
			message: 'Successfully delete Discount',
			success: true
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.getDiscountAsync = async id => {
	try {
		const discount = await DISCOUNT.findById(id);
		return {
			message: 'Successfully get discount',
			success: true,
			data: discount
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.getAllDiscount = async ()=> {
	try {
		const arrDiscount = await DISCOUNT.find().sort({
			createdAt: -1
		});
		return {
			message: 'Successfully Get discount',
			success: true,
			data: arrDiscount
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.getAllDiscountActiveProduct = async (id)=> {
	try {
		var timeCurrent = Date.UTC();
		var arrResult = [];
		const arrDiscount = await DISCOUNT.find().sort({
			createdAt: -1
		});
		var productCurrent = await PRODUCT.findById(id);
		if(productCurrent == null)
			return {
				message: 'Product not exit',
				success: false
			};
		var groupProductCurrent = await GROUPPRODUCT.find({key: productCurrent.key})
		arrDiscount.forEach(discount => {
			 var durationTime = new Date(discount.duration).getTime();
			 console.log(timeCurrent)
			 console.log(durationTime)
			 if(timeCurrent <= durationTime)
			 {
				if(discount.totalProduct != false )
					arrResult.push(discount);
				else if(discount.idGroupProduct != null &&  discount.idGroupProduct == groupProductCurrent.id)
					arrResult.push(discount);
				else if(discount.idProduct != null && discount.idProduct == productCurrent.id) {
					arrResult.push(discount);
				}
			 }
		});
		return {
			message: 'Successfully Get discount',
			success: true,
			data: arrResult
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};