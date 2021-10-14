const USER = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwtServices = require('./jwt.services');
const { defaultRoles } = require('../config/defineModel');
const otpGenerator = require('otp-generator');
const { configEnv } = require('../config/index');
const nodemailer = require('nodemailer');
const { sendMail } = require('./sendMail.service');

exports.registerUserAsync = async body => {
	try {
		const { email, password, phone, name, address } = body;
		//check if email is already in the database
		const emailExist = await USER.findOne({
			email: email
		});
		if (emailExist)
			return {
				message: 'Email already exists',
				success: false
			};
		var otp = otpGenerator.generate(6, {
			upperCase: false,
			specialChars: false
		});
		console.log(otp);
		const hashedPassword = await bcrypt.hash(password, 8);
		const newUser = new USER({
			email: email,
			password: hashedPassword,
			phone: phone,
			name: name,
			address: address,
			otp: otp
		});
		await newUser.save();
		const generateToken = jwtServices.createToken({
			id: newUser._id,
			role: newUser.role
		});
		return {
			message: 'Successfully Register',
			success: true,
			data: generateToken
		};
	} catch (err) {
		console.log(err);
		return {
			error: 'Internal Server',
			success: false
		};
	}
};

exports.loginAsync = async body => {
	try {
		const { email, password } = body;
		const user = await USER.findOne({
			email: email
		});
		if (!user) {
			return {
				message: 'Invalid Email !!',
				success: false
			};
		}
		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			return {
				message: 'Invalid password !!',
				success: false
			};
		}
		const generateToken = jwtServices.createToken({
			id: user._id,
			role: user.role
		});
		return {
			message: 'Successfully login',
			success: true,
			data: {
				token: generateToken
			}
		};
	} catch (err) {
		console.log(err);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.findUserByIdAsync = async body => {
	try {
		const user = await USER.findById(body);
		if (!user) {
			return {
				message: 'Get User Fail',
				success: false
			};
		}
		return {
			message: 'Successfully Get User',
			success: true,
			data: user
		};
	} catch (err) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.changePasswordAsync = async (id, body) => {
	try {
		const user = await USER.findById(id);
		const oldPassword = body.oldPassword;
		const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
		if (!isPasswordMatch) {
			return {
				message: 'Wrong PassWord Old',
				success: false,
				data: user
			};
		}
		const newPassword = await bcrypt.hash(body.newPassword, 8);
		user.password = newPassword;
		await user.save();
		return {
			message: 'Change Password Successfully',
			success: true
		};
	} catch (error) {
		console.log(error);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.fotgotPassword = async body => {
	try {
		const email = body.email;
		const result = await USER.findOne({ email: email });
		if (result != null) {
			const mailOptions = {
				to: result.email,
				from: configEnv.Email,
				subject: 'Quên mật khẩu Fresh Food',
				text: 'Mã OTP của bạn là:' + result.otp,
			};
			const resultSendMail = await sendMail(mailOptions);
			console.log(resultSendMail);
			if (!resultSendMail) {
				return {
					message: 'Send Email Failed',
					success: false
				};
			} else {
				console.log('voo nef');
				return {
					message: 'Send Email Success',
					success: true
				};
			}
		} else {
			return {
				message: 'Do not email',
				success: false
			};
		}
	} catch (error) {
		console.log(error);
		return {
			message: 'Internal Server',
			success: false
		};
	}
};
exports.resetPassword = async body => {
	try {
		const { otp, password, email } = body;
		let user = await USER.findOne({ email: email });
		if (user != null) {
			if (otp == user.otp) {
				const hashedPassword = await bcrypt.hash(password, 8);
				const otp = otpGenerator.generate(6, {
					upperCase: false,
					specialChars: false
				});
				user.password = hashedPassword;
				user.otp = otp;
				user.save();
				return {
					message: 'Reset Password success',
					success: true
				};
			} else {
				return {
					message: 'OTP invalid',
					success: false
				};
			}
		} else {
			return {
				message: 'Do not Email',
				success: false
			};
		}
	} catch (error) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports._findAdminByRoleAsync = async () => {
	try {
		const user = await ACCOUNT.findOne({
			role: DFRole.admin
		});
		return user;
	} catch (err) {
		console.log(err);
		return null;
	}
};
