const Message = require("../models/Message");

module.exports.messageList = async function messages(ctx, next) {
  const message = await Message.find;
  const messages = Message.find({})
    .sort("-date")
    .limit(20);
  ctx.body = { messages };
};
