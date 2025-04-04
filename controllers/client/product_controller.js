const Product = require("../../models/product.model");

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
  console.log(req.params.slug);

  // res.render("client/pages/products/detail", {
  //   pageTitle: "Chi tiet san pham",
  // });
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
    };
    const product = await Product.findOne(find);
    // console.log(product);
    res.render("client/pages/products/detail", {
      pageTitle: "Chi tiet san pham",
      product: product,
    });
  } catch (error) {
    req.flash("error", `Sản phẩm không tồn tại`);
    res.redirect(`/products`);
  }
};
