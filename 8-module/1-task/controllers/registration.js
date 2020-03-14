const uuid = require("uuid/v4");
const User = require("../models/User");
const sendMail = require("../libs/sendMail");
const connection = require("../libs/connection");

module.exports.register = async (ctx, next) => {
  //await User.deleteMany();

  const { email, displayName, password } = ctx.request.body;

  const verificationToken = uuid();
  // console.log(
  //   `____verificationToken____${verificationToken}____________________`
  // );
  const user = new User({ email, displayName, verificationToken });
  try {
    await user.setPassword(password);
    await user.save();
    ctx.body = { status: "ok" };
    //{ verificationToken };
    ctx.status = 201;

    await sendMail({
      template: "confirmation",
      locals: { token: verificationToken },
      to: email,
      subject: "Подтвердите почту"
    });
  } catch (e) {
    // console.log(`${JSON.stringify(e, null, 2)}`);
    ctx.status = 400;
    ctx.body = { errors: {} };
    for (let path in e.errors) {
      ctx.body.errors[path] = e.errors[path].message;
    }
  }
};

module.exports.confirm = async (ctx, next) => {
  const { verificationToken } = ctx.request.body;
  //const userChanges = { verificationToken: undefined };
  const user = await User.findOne({ verificationToken });

  //console.log(`______${JSON.stringify(user, null, 2)}______`);

  if (!user) {
    ctx.status = 400;
    ctx.body = {
      error: "Ссылка подтверждения недействительна или устарела"
    };

    return;
  }
  const token = await ctx.login(user);
  user.verificationToken = undefined;
  user.save();
  ctx.body = { token };
  //console.log(`______${JSON.stringify(user, null, 2)}______`);
};
