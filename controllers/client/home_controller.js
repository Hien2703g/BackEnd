const Product = require("../../models/product.model");
const productsHelper = require("../../Helper/product");
//[GET]/
module.exports.index = async (req, res) => {
  // Lấy ra sản phẩm nổi bật.
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  }).limit(3);
  // console.log(productsFeatured);
  const newFeatured = productsHelper.priceNewProducts(productsFeatured);
  //end sản phẩm nổi bật

  //Hiển thị danh sách sản phẩm mới nhất
  const productsNew = await Product.find({
    deleted: false,
    status: "active",
  })
    .sort({ position: "desc" })
    .limit(3);
  const newproduct = productsHelper.priceNewProducts(productsNew);
  //End Hiển thị danh sách sản phẩm mới nhất

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    // layoutProductsCategory: newProductsCategory,
    productsFeatured: newFeatured,
    productsNew: newproduct,
  });
};
