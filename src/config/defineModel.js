 const defaultModel = {
  date: { type: Date },
  string: { type: String, default: "" },
  stringR: { type: String, required: true },
  stringRef: { type: String, required: true, match: /^[a-fA-F0-9]{24}$/ },
  stringPhone: { type: String, required: true, match: /^0\d{9}$/ },
  stringUnique: { type: String, required: true, unique: true },
  array: { type: Array, default: [] },
  number: { type: Number, default: 0 },
  boolean: { type: Boolean, default: true },
  booleanFalse: { type: Boolean, default: false },
  object: { type: Object, default: {} },
};
const defaultRoles = {
  Admin: 1,
  User:0,
  Staff:2
}
const defaultChatSocket={
  sendMessageSSC:"SEND_MESSAGE_SSC",
  sendMessageCSS:"SEND_MESSAGE_CSS", 
  joinRoomCSS:"JOIN_ROOM_CSS",
  leaveRoomCSS:"LEAVE_ROOM_CSS"
}
module.exports ={
  defaultModel,
  defaultRoles,
  defaultChatSocket
}