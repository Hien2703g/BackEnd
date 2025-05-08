const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../Helper/createTree");
module.exports.category = async (req, res, next) => {
  const ProductsCategory = await ProductCategory.find({
    deleted: false,
  });
  const newProductsCategory = createTreeHelper.tree(ProductsCategory);
  res.locals.layoutProductsCategory = newProductsCategory;
  // console.log("Luôn chạy qua đay");
  next();
};
