const socketIO = require("socket.io");

const Session = require("./models/Session");
const Message = require("./models/Message");

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    const token = socket.handshake.query.token;
    const session = await Session.findOne({ token }).populate("user");
    if (!session) {
      return next(new Error("anonymous sessions are not allowed"));
    }
    return next();
    /*  if (isValid(token)) {
      return next();
    }
    return next(new Error('authentication error'));*/
  });

  io.on("connection", function(socket) {
    socket.on("message", async msg => {
      const token = socket.handshake.query.token;
      const session = await Session.findOne({ token }).populate("user");

      const message = await Message.create({
        user: session.user.displayName,
        chat: session.user._id,
        text: msg,
        date: new Date()
      });
      message.save();
    });
  });

  return io;
}

module.exports = socket;
