const controller = require('./controller');
const userServices = require('../services/user.services');
const { defaultRoles } = require('../config/defineModel');
const ORDER = require('../models/Order.model');
const USER = require('../models/User.model');
const otpGenerator = require('otp-generator');

const paypal = require("paypal-rest-sdk");
const PaypalModel = require('../models/Paypal.model');
const { sortObject } = require('../helper');
const { body } = require('../validators');
var AWS = require('aws-sdk');
const { configEnv } = require('../config');
const uploadServices = require('../services/uploadS3.service');

exports.registerAsync = async (req, res, next) => {
	try {
		const resServices = await userServices.registerUserAsync(req.value.body);
		if (!resServices.success)
			return controller.sendSuccess(
				res,
				resServices.data,
				300,
				resServices.message
			);
		return controller.sendSuccess(
			res,
			resServices.data,
			200,
			resServices.message
		);
	} catch (err) {
		console.log(err);
		return controller.sendError(res);
	}
};

exports.loginAsync = async (req, res, next) => {
	try {
		const resServices = await userServices.loginAsync(req.value.body);
		if (!resServices.success) {
			return controller.sendSuccess(res, {}, 300, resServices.message);
		}
		return controller.sendSuccess(
			res,
			resServices.data,
			200,
			resServices.message
		);
	} catch (err) {
		console.log(err);
		return controller.sendError(res);
	}
};
exports.updateCodeAdminAsync = async (req, res, next) => {
	try {
		const code = req.query.code;
		const resServices = await userServices.updateCodeAdmin({ code: code });
		if (!resServices.success) {
			return controller.sendSuccess(
				res,
				resServices.success,
				300,
				resServices.message
			);
		}

		return controller.sendSuccess(
			res,
			resServices.data,
			200,
			resServices.message
		);
	} catch (error) {
		return controller.sendError(res);
	}
};
exports.forgotPasswordAsync = async (req, res, next) => {
	try {
		const { email } = req.query;
		console.log(email);
		const resServices = await userServices.fotgotPassword({email: email});
		var restartOtp = async function  () {
			const otp = otpGenerator.generate(6, {
				upperCase: false,
				specialChars: false,
				alphabets: false
			});
			console.log(otp);
			var user = await USER.findOne({email: email})
			user.otp = otp;
			user.save();
		};

		setTimeout(restartOtp, 300000);
		if (!resServices.success) {
			return controller.sendSuccess(
				res,
				resServices.success,
				300,
				resServices.message
			);
		}
		return controller.sendSuccess(
			res,
			resServices.data,
			200,
			resServices.message
		);
	} catch (error) {
		console.log(error);
		return controller.sendError(res);
	}
};
exports.resetPasswordAsync = async (req, res, next) => {
	try {
		const resServices = await userServices.resetPassword(req.value.body);
		if (!resServices.success) {
			return controller.sendSuccess(
				res,
				resServices.success,
				300,
				resServices.message
			);
		}

		return controller.sendSuccess(
			res,
			resServices.data,
			200,
			resServices.message
		);
	} catch (error) {
		console.log(error);
		return controller.sendError(res);
	}
};
exports.confirmOtp = async (req, res, next) => {
	try {
		const resServices = await userServices.confirmOtp(req.value.body);
		if (!resServices.success) {
			return controller.sendSuccess(
				res,
				resServices.success,
				300,
				resServices.message
			);
		}
		return controller.sendSuccess(
			res,
			resServices.data,
			200,
			resServices.message
		);
	} catch (error) {
		console.log(error);
		return controller.sendError(res);
	}
};
exports.ChangePassWithOtp = async (req, res, next) => {
	try {
		const resServices = await userServices.changePasswordWithOtp(req.value.body);
		console.log(resServices)
		if (!resServices.success) {
			return controller.sendSuccess(
				res,
				resServices.success,
				300,
				resServices.message
			);
		}
		return controller.sendSuccess(
			res,
			resServices.data,
			200,
			resServices.message
		);
	} catch (error) {
		console.log(error);
		return controller.sendError(res);
	}
};
exports.loginAsync = async (req, res, next) => {
	try {
		const resServices = await userServices.loginAsync(req.value.body);
		if (!resServices.success) {
			return controller.sendSuccess(res, {}, 300, resServices.message);
		}
		return controller.sendSuccess(
			res,
			resServices.data,
			200,
			resServices.message
		);
	} catch (err) {
		console.log(err);
		return controller.sendError(res);
	}
};

exports.findUserByIdAsync = async (req, res, next) => {
	try {
		const { decodeToken } = req.value.body;
		const _id = decodeToken.data.id;
		const resServices = await userServices.findUser(_id);
		return controller.sendSuccess(
			res,
			resServices.data,
			200,
			resServices.message
		);
	} catch (error) {
		// bug
		console.log(error);
		return controller.sendError(res);
	}
};

exports.changePasswordAsync = async (req, res, next) => {
	try {
		const { decodeToken } = req.value.body;
		const id = decodeToken.data.id;
		const resServices = await userServices.changePasswordAsync(id, req.body);
		if (!resServices.success) {
			return controller.sendSuccess(
				res,
				resServices.success,
				300,
				resServices.message
			);
		}
		return controller.sendSuccess(
			res,
			resServices.success,
			200,
			resServices.message
		);
	} catch (error) {
		return controller.sendError(res);
	}
};
exports.paymentSuccess = (req, res, next) => {
	const payerId = req.query.PayerID;
	const paymentId = req.query.paymentId;
	const price = req.query.price;
	const idDonHang = req.query.idDonHang;
	var update = { typePayment: "PayPal" };
	const execute_payment_json = {
		payer_id: payerId,
		transactions: [
			{
				amount: {
					currency: "USD",
					total: `${price}`,
				},
			},
		],
	};
	paypal.payment.execute(
		paymentId,
		execute_payment_json,
		async function (error, payment) {
			if (error) {
				res.send("Payment Fail");
			} else {
				var resultDonHang = await ORDER.findOneAndUpdate(
					{ _id: idDonHang },
					update,
					{
						new: true,
					}
				);
				await PaypalModel.create({
					idOrder: idDonHang,
					Transaction: price,
					idPaypal: payment.transactions[0].related_resources[0].sale.id,
				});
				res.send({
					message: "Success",
					paymentId: payment.transactions[0].related_resources[0].sale.id,
					id_Order: idDonHang,
				});
			}
		}
	);
}
exports.cancelPayment = (req, res, next) => {
	res.send("Payment is canceled");
}
exports.successVnPayOrder = async (req, res, next) => {
	var vnp_Params = req.query;
	var secureHash = vnp_Params["vnp_SecureHash"];
	var id = vnp_Params["vnp_OrderInfo"];
	var amount = vnp_Params["vnp_Amount"] /100;
	delete vnp_Params["vnp_SecureHash"];
	delete vnp_Params["vnp_SecureHashType"];

	vnp_Params = sortObject(vnp_Params);

	var tmnCode = "JCO3SG7X";
	var secretKey = "BKPYNKKKBEAZCHZFHLIXKMXXCODHEVSU";

	var querystring = require("qs");
	var signData =
		secretKey + querystring.stringify(vnp_Params, { encode: false });

	var sha256 = require("sha256");

	var checkSum = sha256(signData);

	if (secureHash === checkSum) {
		//Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
		
		await ORDER.findOneAndUpdate(
			{ _id: id },
			{
				typePayment: "VnPay",
			},
			{
				new: true,
			}
		);
		res.send({
			message: "Success",
			paymentId: id,
			amount:amount,
		});
	} else {
		res.render("success", { code: "97" });
	}
}
exports.getInformation = async (req, res, next) => {
	try {
		const { decodeToken } = req.value.body;
		const id = decodeToken.data.id;
		const resServices = await userServices.findInformation(id);
		if (!resServices.success) {
			return controller.sendSuccess(res, {}, 300, resServices.message);
		}
		var result = resServices.data;
		var image = await uploadServices.getImageS3(result.avatar);
		result.avatar = image;
		return controller.sendSuccess(
			res,
			result,
			200,
			resServices.message
		);
	} catch (err) {
		console.log(err);
		return controller.sendError(res);
	}
};
exports.updateInformation = async (req, res, next) => {
	try {
		const { decodeToken } = req.value.body;
		const id = decodeToken.data.id;
		const resServices = await userServices.updateInformation(id,req.value.body);
		if (!resServices.success) {
			return controller.sendSuccess(res, {}, 300, resServices.message);
		}
		return controller.sendSuccess(
			res,
			resServices.data,
			200,
			resServices.message
		);
	} catch (err) {
		console.log(err);
		return controller.sendError(res);
	}
};
exports.uploadImage = async (req, res, next) => {
	try {
		const { decodeToken } = req.value.body;
		const id = decodeToken.data.id;
		const file = req.file;
		console.log("file ne");
		console.log(file);
		let s3bucket = new AWS.S3({
			accessKeyId: configEnv.AWS_ACCESS_KEY,
			secretAccessKey: configEnv.AWS_SECRET_KEY
		});
		var timeCurrent = Date.now();
		var params = {
			Bucket: 'freshfoodbe',
			Key: `Avatar/${timeCurrent}${file.originalname}`,
			Body: file.buffer,
			ContentType: file.mimetype
		};
		s3bucket.upload(params, async function (err, data) {
			if (err) {
				return controller.sendSuccess(res, err, 300, 'Upload Image Fail');
			} else {
				var name = `Avatar/${timeCurrent}${file.originalname}`;
					var bodyNew = {
						avatar: name
					}
					const resServices = await userServices.updateInformation(id,
						bodyNew
					);
					var image = await uploadServices.getImageS3(name);
					if (resServices.success) {
						var result = {
							fcm: resServices.data.fcm,
							image: image,
							email: resServices.data.email,
							phone: resServices.data.phone,
							name: resServices.data.name,
							_id: resServices.data._id,
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
		});
	} catch (error) {
		// bug
		console.log(error);
		return controller.sendError(res);
	}
};