const { defaultRoles, defaultStatusCart } = require('../config/defineModel');
const EVELUATE = require('../models/Eveluate.model')
const PRODUCT = require('../models/Product.model')
const uploadServices = require('../services/uploadS3.service');



exports.createEveluateAsync = async body => {
	try {
		const eveluate = new EVELUATE(body);
		await eveluate.save();
		return {
			message: 'Successfully create eveluate',
			success: true,
			data: cart
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
exports.getCartByIdAsync = async (id) => {
	try {
		const cart = await CART.findById(id);
		return {
			message: 'Successfully delete Cart',
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
exports.getAllCartByIdUser = async (id) => {
	try {
		const cartsCurrent = await CART.find({customerId: id, status: defaultStatusCart.Active}).sort({createdAt: -1});
		console.log(cartsCurrent.length)
		let arrResult = [];
		for(let i = 0 ; i < cartsCurrent.length; i++)
		{
			var productCurrent = await PRODUCT.findById(cartsCurrent[i].productId);
			var costCart = 0;
			var images = [];
			for (let j = 0; j < productCurrent.image.length; j++) {
				var image = await uploadServices.getImageS3(productCurrent.image[j]);
				images.push(image);
			}
			costCart = productCurrent.price * cartsCurrent[i].quantity;

			var newCart = {
				status: cartsCurrent[i].status,
        quantity: cartsCurrent[i].quantity,
        name: cartsCurrent[i].name,
        nameGroup: cartsCurrent[i].nameGroup,
        _id: cartsCurrent[i].id,
        productId: cartsCurrent[i].productId,
        customerId: cartsCurrent[i].customerId,
				image: images,
				cost: productCurrent.price,
				totalCost: costCart,
        createdAt: cartsCurrent[i].createdAt,
        updatedAt: cartsCurrent[i].updatedAt,
			}
			arrResult.push(newCart)
		}
		return {
			message: 'Successfully Get Cart',
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