const Product = require("../models/Product");

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

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const { query } = ctx.request.query;
  let products = [];
  if (query) {
    const _products = await Product.find({ $text: { $search: query } });
    products = _products.map(transformProduct);
  }

  ctx.body = { products: products };
};
