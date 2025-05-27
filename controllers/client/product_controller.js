const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const productsHelper = require("../../Helper/product");
const productsCategoryHelper = require("../../Helper/product-category");
//[GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = products.map((item) => {
    item.priceNew = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(0);
    return item;
  });

  // console.log(products);

  res.render("client/pages/products/index", {
    pageTitle: "products",
    products: newProducts,
  });
};
//[GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slugProduct,
      status: "active",
    };

    const product = await Product.findOne(find);

    if (product.product_category_id) {
      const category = await ProductCategory.findOne({
        _id: product.product_category_id,
        status: "active",
        deleted: false,
      });

      product.category = category;
    }

    productsHelper.priceNewProduct(product);

    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    req.flash("error", `Sản phẩm không tồn tại`);
    res.redirect(`/products`);
  }
};
//[GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  try {
    const category = await ProductCategory.findOne({
      slug: req.params.slugCategory,
      status: "active",
      deleted: false,
    });

    const listSubCategory = await productsCategoryHelper.getSubCategory(
      category.id
    );

    const listSubCategoryId = listSubCategory.map((item) => item.id);

    const products = await Product.find({
      product_category_id: {
        $in: [category.id, ...listSubCategoryId],
      },
      deleted: false,
    }).sort({
      position: "desc",
    });

    const newProducts = productsHelper.priceNewProducts(products);

    res.render("client/pages/products/index", {
      category: category,
      pageTitle: category.title,
      products: newProducts,
    });
  } catch (error) {
    req.flash("error", `Danh muc không tồn tại`);
    res.redirect(`/products`);
  }
};
