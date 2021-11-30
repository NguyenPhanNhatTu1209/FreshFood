const USER = require('../models/User.model');
const { defaultRoles } = require('../config/defineModel');
const GROUPPRODUCT = require('../models/GroupProduct.model');
const PRODUCT = require('../models/Product.model');

exports.createProductAsync = async body => {
	try {
		var groupProduct = await GROUPPRODUCT.findOne({ key: body.groupProduct });
		console.log(body)
		if (groupProduct == null)
			return {
				message: 'GroupProduct not exit',
				success: false
			};
		body.groupProduct = {
			name: groupProduct.name,
			key: groupProduct.key
		};
		console.log()
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
		console.log(id);
		const product = await PRODUCT.findById(id);
		if(product == null)
		{
			return {
				message: 'An error occurred',
				success: false
			};
		}
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
exports.findAllProduct = async body => {
	try {
		const { groupProduct, search,skip,limit} = body;
		var product;
		console.log("groupProduct")
		console.log(groupProduct)

		if(groupProduct === '')
		{
			product = await PRODUCT.find({ name: { $regex: `${search}`, $options: '$i' } }).sort({createdAt: -1}).skip(Number(limit) * Number(skip) - Number(limit)).limit(Number(limit));
		}
		else
		{
			product = await PRODUCT.find({ name: { $regex: `${search}`, $options: '$i' },
					'groupProduct.key': groupProduct
			}).sort({createdAt: -1}).skip(Number(limit) * Number(skip) - Number(limit)).limit(Number(limit));
		}
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
exports.getProductRecommend = async (id) => {
	try {
		const products = await PRODUCT.find().sort({sold: -1});
		var arrResult = [];
		for(let i=0;i<5;i++)
		{
			arrResult.push(products[i]);
		}
		return {
			message: 'Successfully get product recommend',
			success: true,
			data: arrResult
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};