const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = require("./../../models/User");
const Session = require("./../../models/Session");
const uuid = require("uuid/v4");

module.exports = new LocalStrategy(
  { usernameField: "email", session: false },
  async function(email, password, done) {
    const user = await User.findOne({ email }, {}).select("+password +salt");
    if (!user) {
      return done(null, false, "Нет такого пользователя");
    }
    if (!(await user.checkPassword(password))) {
      return done(null, false, "Неверный пароль");
    }
    // const user = await User.findOne({ email }, {}).select("+password +salt");
    // return done(null, user);

    const id = user._id;

    try {
      const session = { user, lastVisit: new Date(), token: uuid() };
      const s = await Session.findOneAndUpdate(
        {
          user: mongoose.Types.ObjectId(id)
        },
        session,
        {
          new: true,
          upsert: true
        }
      );
      await s.save();
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
);
