const controller = require('./controller');
const productServices = require('../services/product.service');
const uploadServices = require('../services/uploadS3.service');
const { defaultRoles } = require('../config/defineModel');
const { configEnv } = require('../config');
var AWS = require('aws-sdk');
exports.createProductAsync = async (req, res, next) => {
	try {
		const file = req.files;
		console.log(file);
		let s3bucket = new AWS.S3({
			accessKeyId: configEnv.AWS_ACCESS_KEY,
			secretAccessKey: configEnv.AWS_SECRET_KEY
		});
		var ResponseData = [];
		file.forEach(item => {
			var timeCurrent = Date.now();
			var params = {
				Bucket: 'freshfoodbe',
				Key: `FreshFood/${timeCurrent}${item.originalname}`,
				Body: item.buffer,
				ContentType: item.mimetype
			};
			console.log('itemne');
			console.log(item);
			s3bucket.upload(params, async function (err, data) {
				if (err) {
					return controller.sendSuccess(res, err, 300, 'Upload Image Fail');
				} else {
					var name = `FreshFood/${timeCurrent}${item.originalname}`;
					ResponseData.push(name);
					console.log('ResponseData');
					console.log(ResponseData);
					if (ResponseData.length == file.length) {
						req.body.image = ResponseData;
						const resServices = await productServices.createProductAsync(
							req.body
						);
						var images = [];
						for (let i = 0; i < ResponseData.length; i++) {
							var image = await uploadServices.getImageS3(ResponseData[i]);
							images.push(image);
						}
						console.log(images);
						if (resServices.success) {
							var result = {
								price: resServices.data.price,
								image: images,
								status: resServices.data.status,
								weight: resServices.data.weight,
								quantity: resServices.data.quantity,
								_id: resServices.data._id,
								name: resServices.data.name,
								detail: resServices.data.detail,
								groupProduct: resServices.data.groupProduct,
								createdAt: resServices.data.createdAt,
								updatedAt: resServices.data.updatedAt
							};
							return controller.sendSuccess(
								res,
								result,
								200,
								resServices.message
							);
						}
						return controller.sendSuccess(
							res,
							resServices.data,
							300,
							resServices.message
						);
					}
				}
			});
		});
	} catch (error) {
		// bug
		console.log(error);
		return controller.sendError(res);
	}
};
exports.updateProductAsync = async (req, res, next) => {
	try {
		const file = req.files;
		console.log(file.length);
		if (file.length != 0) {
			console.log("co file")
			let s3bucket = new AWS.S3({
				accessKeyId: configEnv.AWS_ACCESS_KEY,
				secretAccessKey: configEnv.AWS_SECRET_KEY
			});
			var ResponseData = [];
			file.forEach(item => {
				var timeCurrent = Date.now();
				var params = {
					Bucket: 'freshfoodbe',
					Key: `FreshFood/${timeCurrent}${item.originalname}`,
					Body: item.buffer,
					ContentType: item.mimetype
				};
				s3bucket.upload(params, async function (err, data) {
					if (err) {
						return controller.sendSuccess(res, err, 300, 'Upload Image Fail');
					} else {
						var name = `FreshFood/${timeCurrent}${item.originalname}`;
						ResponseData.push(name);
						console.log('ResponseData');
						console.log(ResponseData);
						if (ResponseData.length == file.length) {
							req.body.image = ResponseData;
							const resServices = await productServices.updateProductAsync(
								req.body.id,
								req.body
							);
							var images = [];
							for (let i = 0; i < ResponseData.length; i++) {
								var image = await uploadServices.getImageS3(ResponseData[i]);
								images.push(image);
							}
							console.log(images);
							if (resServices.success) {
								console.log("datane");
								console.log(resServices.data);

								var result = {
									price: resServices.data.price,
									image: images,
									status: resServices.data.status,
									weight: resServices.data.weight,
									quantity: resServices.data.quantity,
									_id: resServices.data._id,
									name: resServices.data.name,
									detail: resServices.data.detail,
									groupProduct: resServices.data.groupProduct,
									createdAt: resServices.data.createdAt,
									updatedAt: resServices.data.updatedAt
								};
								return controller.sendSuccess(
									res,
									result,
									200,
									resServices.message
								);
							}
							return controller.sendSuccess(
								res,
								resServices.data,
								300,
								resServices.message
							);
						}
					}
				});
			});
		} else {
			console.log("ko file")
			var currentProduct = await productServices.findProductByIdAsync(
				req.body.id
			);
			if (currentProduct.success != true) {
				return controller.sendSuccess(
					res,
					currentProduct.data,
					300,
					currentProduct.message
				);
			}
			var images = [];
			for (let i = 0; i < currentProduct.data.image.length; i++) {
				var image = await uploadServices.getImageS3(
					currentProduct.data.image[i]
				);
				images.push(image);
			}
			const resServices = await productServices.updateProductAsync(
				req.body.id,
				req.body
			);
			if (resServices.success) {
				var result = {
					price: resServices.data.price,
					image: images,
					status: resServices.data.status,
					weight: resServices.data.weight,
					quantity: resServices.data.quantity,
					_id: resServices.data._id,
					name: resServices.data.name,
					detail: resServices.data.detail,
					groupProduct: resServices.data.groupProduct,
					createdAt: resServices.data.createdAt,
					updatedAt: resServices.data.updatedAt
				};
				return controller.sendSuccess(res, result, 200, resServices.message);
			}
		}
	} catch (error) {
		// bug
		console.log(error);
		return controller.sendError(res);
	}
};
exports.deleteProductAsync = async (req, res, next) => {
	try {
		const resServices = await productServices.deleteProductAsync(req.query.id);
		if (resServices.success) {
			return controller.sendSuccess(
				res,
				resServices.data,
				200,
				resServices.message
			);
		}
		return controller.sendSuccess(
			res,
			resServices.data,
			300,
			resServices.message
		);
	} catch (error) {
		// bug
		console.log(error);
		return controller.sendError(res);
	}
};
exports.findAllProductAsync = async (req, res, next) => {
	try {
		let query = {
			search: req.query.search || '',
			limit: req.query.limit || '15',
			skip: req.query.skip || '1',
		};
		const resServices = await productServices.findAllProduct(query);
		if (resServices.success) {
			var resultArr =[];
			for(let i =0;i<resServices.data.length;i++)
			{
				var responseData = resServices.data[i].image;
				var images = [];
				for (let i = 0; i < responseData.length; i++) {
					var image = await uploadServices.getImageS3(responseData[i]);
					images.push(image);
				}
				var result = {
					price: resServices.data[i].price,
					image: images,
					status: resServices.data[i].status,
					weight: resServices.data[i].weight,
					quantity: resServices.data[i].quantity,
					_id: resServices.data[i]._id,
					name: resServices.data[i].name,
					detail: resServices.data[i].detail,
					groupProduct: resServices.data[i].groupProduct,
					createdAt: resServices.data[i].createdAt,
					updatedAt: resServices.data[i].updatedAt
				};
				resultArr.push(result);
			}
			return controller.sendSuccess(
				res,
				resultArr,
				200,
				resServices.message
			);
		}
		return controller.sendSuccess(
			res,
			resServices.data,
			300,
			resServices.message
		);
	} catch (error) {
		// bug
		console.log(error);
		return controller.sendError(res);
	}
};