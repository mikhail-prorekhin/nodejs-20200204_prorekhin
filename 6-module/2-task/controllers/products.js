const mongoose = require("mongoose");
const connection = require("../libs/connection");
const Category = require("../models/Category");
const Product = require("../models/Product");
const { ObjectId } = require("mongodb");

const transformProduct = ({
  title,
  description,
  price,
  images,
  category,
  subcategory,
  _id
}) => ({
  title,
  description,
  price,
  images,
  category,
  subcategory,
  id: _id
});

module.exports.productsBySubcategory = async function productsBySubcategory(
  ctx,
  next
) {
  const { subcategory } = ctx.request.query;
  if (!subcategory) {
    await next();
    return;
  }

  if (!ObjectId.isValid(subcategory)) {
    ctx.throw(400, "invalid id");
  }
  const _products = await Product.find({ subcategory });
  const products = _products.map(transformProduct);
  ctx.status = 200;
  ctx.body = {
    products
  };
};

module.exports.productList = async function productList(ctx, next) {
  // let product;

  // product = await Product.create({
  //   title: "aaa bbb ccc",
  //   description: "xxx yyy",
  //   price: 10,
  //   category: ObjectId("5e60af67a7a90e7b42dd0764"),
  //   subcategory: ObjectId("5e60af67a7a90e7b42dd0765"),
  //   images: ["image1"]
  // });

  // product = await Product.create({
  //   title: "xxx yyy",
  //   description: "aaa bbb ccc",
  //   price: 33,
  //   category: ObjectId("5e60af67a7a90e7b42dd0766"),
  //   subcategory: ObjectId("5e60af67a7a90e7b42dd0767"),
  //   images: ["image12", "image13", "image14"]
  // });

  const _products = await Product.find();
  //await mongoose.disconnect();
  await next();
  const products = _products.map(transformProduct);
  ctx.status = 200;
  ctx.body = {
    products
  };
};

module.exports.productById = async function productById(ctx, next) {
  const { id } = ctx.params;

  if (!ObjectId.isValid(id)) {
    ctx.throw(400, "invalid id");
  }

  const _product = await Product.findById(id);

  await next();
  if (!_product) {
    ctx.throw(404, "Not found");
  }
  ctx.body = { product: transformProduct(_product) };
  ctx.status = 200;
};
