const { defaultRoles, defaultStatusCart } = require('../config/defineModel');
const IVENTORYHISTORY = require('../models/inventoryHistory');
const PRODUCT = require('../models/Product.model');
const USER = require('../models/User.model');

exports.createIventoryHistoryAsync = async body => {
	try {
		const userUpdate = await USER.findById(body.idUser);
		if (userUpdate === null) {
			return {
				message: 'User not found',
				success: false,
				data: null
			};
		}

		body.nameUser = userUpdate.name;
		for (let i = 0; i < body.history.length; i++) {
			var productCurrent = await PRODUCT.findById(body.history[i].id);
			if(body.history[i].quantity < 0)
			{
				if(body.history[i].quantity + productCurrent.quantity < 0)
				{
					return {
						message: 'Update quantity product fail',
						success: false
					};
				}
			}

			body.history[i].quantity += productCurrent.quantity;
			 await PRODUCT.findOneAndUpdate(
				{ _id: body.history[i].id },
				body.history[i],
				{ new: true }
			);
		}

		const iventoryHistory = new IVENTORYHISTORY(body);
		await iventoryHistory.save();
		return {
			message: 'Successfully create iventory history',
			success: true,
			data: iventoryHistory
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.updateIventoryHistoryAsync = async (id, body) => {
	try {
		const iventoryHistory = await IVENTORYHISTORY.findOneAndUpdate(
			{ _id: id },
			body,
			{
				new: true
			}
		);

		return {
			message: 'Successfully update iventory history',
			success: true,
			data: iventoryHistory
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.getIventoryHistoryByIdAsync = async id => {
	try {
		const iventoryHistory = await IVENTORYHISTORY.findById(id);
		return {
			message: 'Successfully get iventory history',
			success: true,
			data: iventoryHistory
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.getAllIventoryHistoryAsync = async query => {
	try {
		const {skip, limit } = query;
		const iventoryHistory = await IVENTORYHISTORY.find({})
			.sort({ createdAt: -1 })
			.skip(Number(limit) * Number(skip) - Number(limit))
			.limit(Number(limit));

		return {
			message: 'Successfully get all iventory history',
			success: true,
			data: iventoryHistory
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
