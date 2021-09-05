// const { defaultChatSocket } = require('../config/defineModel');
// const chatService = require('../services/chat.service');
// const sockets = require('./index');
// const USER = require('../models/User.model');
// const ACCOUNT = require('../models/Account.model');
// const ROOM = require('../models/Room.model');
// const DEVICE = require('../models/Device.model');
// const { pushNotification, pushMultipleNotification } = require('../services/fcmNotify');
// const { convertObjectFieldString } = require('../helper');
// exports.joinRoom = async (socket, data) => {
// 	console.log('Join Room');
// 	const { idAccount } = data;
// 	console.log('Room: ', idAccount);
// 	socket.Room = idAccount;
// 	socket.join(idAccount);
// 	const user = sockets.findUserById(socket.id);
//   console.log(user)
// 	await chatService.updateSendByUser(user.userId);
// };
// exports.leaveRoom = (socket, data) => {
// 	console.log('Leave Room');
// 	const { idAccount } = data;
// 	console.log('Room_IdAccount: ', idAccount);
// 	socket.leave(idAccount);
// 	socket.removeAllListeners(idAccount);
// 	delete socket.Room;
// 	// socket.adapter.rooms
// };

// exports.chatMessage = async (socket, data) => {
// 	console.log(data);
// 	const user = sockets.findUserById(socket.id);
// 	if (user) {
// 		console.log(`LHA:  ===> file: chat.socket.js ===> line 86 ===> user`, user);
// 		const admin = await ACCOUNT.findOne({
// 			role: 1
// 		});
//     console.log("admin")
//     console.log(admin);
//     let obj;
//     if(user.role == 0)
//     {
//       obj= Object.assign(data, {
//         creatorUser: user.userId,
//         seenByUser: [user.userId],
// 				idRoom: socket.Room
//         // from: `${user.userId}`,
//         // recive: admin._id
//       });
//     }
//     else if(user.role ==1)
//     {
//       obj= Object.assign(data, {
//         creatorUser: user.userId,
//         seenByUser: [user.userId],
// 				idRoom: socket.Room
//         // from:  admin._id,
//         // recive: `${user.userId}`
//       });
//     }
// 		console.log(obj);
// 		const message = await chatService.createChat(obj);
//     console.log("message");
//     console.log(message);
// 		const userRoom = await ACCOUNT.findById(socket.Room);
// 		sockets.emitRoom(
// 			socket.Room,
// 			defaultChatSocket.sendMessageSSC,
// 			message.data
// 		);
// 		const room = await ROOM.findOne({idRoom: socket.Room})

// 		if(room!= null)
// 		{
// 			room.idLastMessage = message.data._id
// 			await room.save();
// 		}
// 		else
// 		{
// 			var bodyRoom = {
// 				idRoom: socket.Room,
// 				idLastMessage:message.data._id,
// 				name:  userRoom.phone
// 			}
// 			await ROOM.create(bodyRoom);
// 		}
// 		const dataMessage = Object.assign(
// 			{},
// 			JSON.parse(JSON.stringify(message.data)),
// 			{
// 				action: 'MESSAGE'
// 			}
// 		);
// 		if (user.role === 0) {
// 			//user
// 			const admin = await ACCOUNT.findOne({
// 				role: 1
// 			});
// 			const devicesAdmin = await DEVICE.find({ creatorUser: admin._id });
// 			const user1 = await ACCOUNT.findById(socket.Room);
// 			const datafcm = convertObjectFieldString(Object.assign(dataMessage));
// 			var newArr = devicesAdmin.map((val) => {
// 				return val.fcm;
// 			})
// 			console.log(newArr);
// 			console.log(user1)
// 			pushMultipleNotification(`Tin nhắn từ ${user1.phone}`,`${message.data.message}`,'',datafcm,newArr);
// 		} else if (user.role === 1) {
// 			console.log('Admin');
// 			const deviceUser = await DEVICE.find({creatorUser: socket.Room});
// 			const datafcm = convertObjectFieldString(
// 				Object.assign(dataMessage)
// 			);
// 			var newArr = deviceUser.map((val) => {
// 				return val.fcm;
// 			})
// 			pushMultipleNotification(`CSKH Trực Tuyến`,`${message.data.message}`,'',datafcm,newArr);
// 		}
// 	} else {
// 		sockets.emitToSocketId(socket.id, defaultChatSocket.sendMessageSSC, {
// 			message: 'Do not find User'
// 		});
// 	}
// };
exports.a = "abc";
