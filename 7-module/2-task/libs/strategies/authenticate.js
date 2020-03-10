const User = require("./../../models/User");

module.exports = async function authenticate(
  strategy,
  email,
  displayName,
  done
) {
  if (!email) {
    return done(null, false, "Не указан email");
  }

  const user = await User.findOne({ email }, {}).select("+password +salt");

  if (user) {
    return done(null, user);
  }
  try {
    const u = new User({ email, displayName });
    // await u.validate();
    await u.save();
    return done(null, u);
  } catch (error) {
    return done(error, false);
  }
};
