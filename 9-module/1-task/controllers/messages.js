const Message = require("../models/Message");

module.exports.messageList = async function messages(ctx, next) {
  const { user } = ctx;

  const messageList = await Message.find({ chat: user._id })
    .sort("-date")
    .limit(20);
  const messages = messageList.map(record => ({
    date: record.date,
    text: record.text,
    id: record._id,
    user: record.user
  }));

  ctx.body = { messages };
};
