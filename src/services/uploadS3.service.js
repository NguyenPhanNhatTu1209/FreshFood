const { configEnv } = require('../config');
const aws = require("aws-sdk");
const { optional } = require('@hapi/joi');
const { ConnectionStates } = require('mongoose');

exports.uploadImageS3 = async (body,expires = 300) => {
	try {
		console.log(body.name)
		console.log(body.type)
		var s3 = new aws.S3({
			accessKeyId: configEnv.AWS_ACCESS_KEY,
			secretAccessKey: configEnv.AWS_SECRET_KEY,
			region: configEnv.REGION,
			// endpoint: 'lambiengcode.tk', 
		});
		const s3Params = {
			Bucket: configEnv.BUCKET,
			Key: body.name,
			Expires: expires,
			ContentType: body.type
		};
		console.log(s3Params)
		const signedUrl = await s3.getSignedUrl('putObject', s3Params);
		return signedUrl;
	} catch (e) {
		console.log(e);
		return null;
	}
};

exports.getImageS3 = async (body,expires = 60*60*24) => {
	try {
		var s3 = new aws.S3({
			accessKeyId: configEnv.AWS_ACCESS_KEY,
			secretAccessKey: configEnv.AWS_SECRET_KEY,
			region: configEnv.REGION,
		});
		const s3Params = {
			Bucket: configEnv.BUCKET,
			Key: body,
			Expires: expires,
		};
		const signedUrl = await s3.getSignedUrl('getObject', s3Params);
		return signedUrl;
	} catch (e) {
		console.log(e);
		return null;
	}
};
