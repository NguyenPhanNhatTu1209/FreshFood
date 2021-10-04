const CHAT = require('../models/Chat.model');
const ROOM = require('../models/Room.model');
exports.createChat = async body => {
	try {
		console.log(body);
		const newChat = await CHAT.create(body);
		console.log(
			`LHA:  ===> file: chat.service.js ===> line 6 ===> newChat`,
			newChat
		);
		return {
			message: 'Successfully create chat',
			success: true,
			data: newChat
		};
	} catch (error) {
		console.log(error);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.updateChat = async (body, optional = {}) => {
	try {
		const newChat = await CHAT.findOneAndUpdate(
			query,
			body,
			Object.assign(
				{
					new: true
				},
				optional
			)
		);
		return {
			message: 'Successfully create chat',
			success: true,
			data: newChat
		};
	} catch (error) {
		console.log(error);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.updateSendByUser = async idUser => {
	try {
		console.log('co run khong ');
		const chats = await CHAT.find({
			seenByUser: {
				$exists: true,
				$nin: [idUser]
			}
		}).sort({
			createAt: -1
		});
		for (chat of chats) {
			chat.seenByUser.push(idUser);
			await chat.save();
		}
		return {
			message: 'Successfully create chat',
			success: true,
			data: chats
		};
	} catch (error) {
		console.log(error);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.getMessages = async body => {
	try {
		const { idRoom, skip, limit } = body;
		console.log(body);
		const chatGetByRoom = await CHAT.find({
			idRoom
		})
			.sort({
				createdAt: -1
			})
			.skip(Number(skip))
			.limit(Number(limit));
		return {
			message: 'Successfully get chat',
			success: true,
			data: chatGetByRoom
		};
	} catch (err) {
		console.log(err);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.getRoomAdmin = async body => {
	try {
		const { skip, limit } = body;
		const getRoomByAdmin = await ROOM.find(
			{},
			{ _id: 1, createdAt: 0, __v: 0, updatedAt: 0 }
		)
			.sort({
				updatedAt: -1
			})
			.skip(Number(skip))
			.limit(Number(limit));
		let arrResult = [];
		for (let i = 0; i < getRoomByAdmin.length; i++) {
			let chat = await CHAT.findById(getRoomByAdmin[i].idLastMessage);
			var roomNew = {
				idRoom: getRoomByAdmin[i].idRoom,
				idLastMessage: getRoomByAdmin[i].idLastMessage,
				name: getRoomByAdmin[i].name,
				seenByUser: chat.seenByUser,
				message: chat.message
			};
			arrResult.push(roomNew);
		}
		return {
			message: 'Successfully get room',
			success: true,
			data: arrResult
		};
	} catch (err) {
		console.log(err);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
