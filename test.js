const otpGenerator = require("otp-generator");

const otp = otpGenerator.generate(6, {
	upperCase: false,
	specialChars: false,
	alphabets: false,
});
console.log(otp)