var otpGenerator = require('otp-generator')

var a = otpGenerator.generate(6, { upperCase: false, specialChars: false });
console.log(a);