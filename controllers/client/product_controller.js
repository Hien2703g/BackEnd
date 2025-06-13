const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const productsHelper = require("../../Helper/product");
const productsCategoryHelper = require("../../Helper/product-category");
const ProductReview = require("../../models/review_products.model");
const Format = require("../../Helper/format");
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
  //hien thi danh gia
  const reviews = await ProductReview.find({
    product_slug: req.params.slugProduct,
  });
  const countReview = await ProductReview.countDocuments({
    product_slug: req.params.slugProduct,
  });
  reviews.totalRank = 0;
  for (const review of reviews) {
    reviews.totalRank = reviews.totalRank + review.reviewValue;
    review.createdAtStr = Format.formatDate(review.createdAt);
  }
  // console.log(reviews.totalRank);
  if (countReview) {
    reviews.TBReview = (reviews.totalRank / countReview).toFixed(2);
    // console.log(reviews.TBReview);
  }
  productsHelper.priceNewProduct(product);
  // console.log(reviews);
  res.render("client/pages/products/detail", {
    pageTitle: product.title,
    product: product,
    reviews: reviews,
  });
  // try {

  // } catch (error) {
  //   req.flash("error", `Sản phẩm không tồn tại`);
  //   res.redirect(`/products`);
  // }
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
//[GET] /products/review/:slugProduct
module.exports.review = async (req, res) => {
  const find = {
    deleted: false,
    slug: req.params.slugProduct,
    status: "active",
  };
  const product = await Product.findOne(find);
  res.render("client/pages/products/review", {
    pageTitle: "Đánh giá sản phẩm",
    product: product,
  });
};
//[POST] /products/review/:slugProduct
module.exports.reviewPost = async (req, res) => {
  try {
    const newReview = new ProductReview({
      product_slug: req.params.slugProduct,
      user_id: res.locals.user.id,
      userName: res.locals.user.fullName,
      reviewMessage: req.body.description,
      reviewValue: req.body.rank,
    });
    await newReview.save();
    req.flash("success", `đánh giá thành công`);
    res.redirect(`/products`);
  } catch (error) {
    req.flash("error", `đánh giá thất bại`);
    res.redirect(`/products`);
  }
};
