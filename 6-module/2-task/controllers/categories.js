const connection = require("../libs/connection");
const Category = require("../models/Category");
const mongoose = require("mongoose");

module.exports.categoryList = async function categoryList(ctx, next) {
  // let category1 = await Category.create({
  //   title: "Category1",
  //   subcategories: [
  //     {
  //       title: "Subcategory1"
  //     }
  //   ]
  // });
  // let category2 = await Category.create({
  //   title: "Category2",
  //   subcategories: [
  //     {
  //       title: "Subcategory2"
  //     }
  //   ]
  // });
  // let category3 = await Category.create({
  //   title: "Category3",
  //   subcategories: [
  //     {
  //       title: "Subcategory3"
  //     }
  //   ]
  // });
  // await category1.save();
  // await category2.save();
  // await category3.save();
  const _categories = await Category.find();

  const categories = _categories.map(_rec => ({
    id: _rec._id,
    title: _rec.title,
    subcategories: _rec.subcategories.map(_sub => ({
      id: _sub._id,
      title: _sub.title
    }))
  }));

  ctx.body = { categories };
  ctx.status = 200;
  await next();
};
