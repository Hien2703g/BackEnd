const Product = require("../../models/product.model");
const productsHelper = require("../../Helper/product");
const Article = require("../../models/article.model");
const Format = require("../../Helper/format");
//[GET]/
module.exports.index = async (req, res) => {
  //article
  //end article
  const posts = await Article.findOne({ deleted: false }).sort({
    position: "desc",
  });
  posts.createdAtStr = Format.formatDate(posts.createdAt);

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
    post: posts,
  });
};
