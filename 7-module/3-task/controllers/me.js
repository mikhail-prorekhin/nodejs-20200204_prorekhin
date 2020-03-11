module.exports.me = async function me(ctx, next) {
  if (ctx.user) {
    ctx.body = {
      email: ctx.user.email,
      displayName: ctx.user.displayName
    };
  } else {
    ctx.status = 401;

    ctx.body = { error: "Пользователь не залогинен" };
  }
};
