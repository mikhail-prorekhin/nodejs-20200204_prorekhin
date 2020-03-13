const uuid = require("uuid/v4");
const User = require("../models/User");
const sendMail = require("../libs/sendMail");
const connection = require("../libs/connection");

module.exports.register = async (ctx, next) => {
  //await User.deleteMany();

  const { email, displayName, password } = ctx.request.body;
  const verificationToken = uuid();
  const user = new User({ email, displayName, verificationToken });
  try {
    await user.setPassword(password);
    await user.save();
    ctx.body = { verificationToken };
    ctx.status = 201;

    await sendMail({
      template: "confirmation",
      locals: { token: verificationToken },
      to: email,
      subject: "Подтвердите почту"
    });
  } catch (e) {
    console.log(`${JSON.stringify(e, null, 2)}`);
    ctx.status = 400;
    ctx.body = { errors: {} };
    for (let path in e.errors) {
      ctx.body.errors[path] = e.errors[path].message;
    }
  }
};

module.exports.confirm = async (ctx, next) => {
  console.log(`______${JSON.stringify(ctx.params, null, 2)}______`);
};

/*

POST http://localhost:3000/confirm/f76bbcb6-d945-4c8a-aa8c-e807a43bb04a

###

*/
