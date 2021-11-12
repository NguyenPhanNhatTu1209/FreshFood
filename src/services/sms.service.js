const nodemailer = require('nodemailer');
const { configEnv } = require('../config');
const twilio = require('twilio');
require('dotenv');
const client = twilio(process.env.Account_SID,process.env.Auth_Token);
exports.sendSmsTwilio = async body => {
	var tachSoDienThoai = '';
  console.log(body.phoneSend)
	for (let i = 1; i < body.phoneSend.length; i++) {
		tachSoDienThoai = tachSoDienThoai + body.phoneSend[i];
	}
	console.log(tachSoDienThoai);
	 var check = await client.messages
		.create({
			body: 'Mã OTP của bạn là: ' + `${body.Otp}`,
			from: process.env.Phone,
			to: '+84' + `${tachSoDienThoai}` //replace this with your registered phone number
		})
		.then(data => {
			console.log(data);
			return true;
		})
		.catch(error => {
			console.log(error);
      console.log("abcss")
			return false;
		});
  console.log("abc");
  console.log(check);
  return check;
};
