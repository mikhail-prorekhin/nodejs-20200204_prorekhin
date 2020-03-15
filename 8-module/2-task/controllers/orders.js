const Order = require("../models/Order");
const sendMail = require("../libs/sendMail");
const Product = require("./../models/Product");

module.exports.checkout = async function checkout(ctx, next) {
  const { phone, address } = ctx.request.body;
  const productId = ctx.request.body.product;
  const { user } = ctx;

  if (!user) {
    ctx.throw(401, "пользователь не авторизован");
  }
  //   if (!productId || !phone || !address) {
  //     ctx.throw(
  //       400,
  //       "описанием ошибки валидации при неправильно сформированном запросе"
  //     );
  //   }

  const product = await Product.findById(productId);

  try {
    let order = await Order.create({
      user,
      product,
      phone,
      address
    });
    await order.validate();

    await order.save();
    ctx.response.body = { order: order._id };
    await sendMail({
      template: "order-confirmation",
      locals: { id: order._id, product },
      to: user.email,
      subject: "Подтвердите почту"
    });
  } catch (e) {
    ctx.status = 400;
    ctx.body = { errors: {} };
    for (let path in e.errors) {
      ctx.body.errors[path] = e.errors[path].message;
    }
  }
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const { user } = ctx;

  if (!user) {
    ctx.throw(401, "пользователь не авторизован");
  }
  const orders = await Order.find({ user });
  ctx.response.body = { orders };
};
