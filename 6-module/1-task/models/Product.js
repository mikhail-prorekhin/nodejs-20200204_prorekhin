const mongoose = require("mongoose");
const connection = require("../libs/connection");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  images: [String]
});

module.exports = connection.model("Product", productSchema);
/**
- `title`, в этом поле будет находиться название товара, например, "Коляска Adamex Barletta".
    - строковое
    - обязательное
- `description`, описание товара.
    - строковое
    - обязательное
- `price`, цена товара.
    - числовое
    - обязательное
- `category`, идентификатор категории товара.
    - ObjectId (ref='Category')
    - обязательное
- `subcategory`, идентификатор категории товара.
    - ObjectId
    - обязательное
- `images`, массив ссылок изображений
    - массив строк
 */
