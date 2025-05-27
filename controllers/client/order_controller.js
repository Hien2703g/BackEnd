const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const User = require("../../models/user.model");

const productsHelper = require("../../Helper/product");
// [GET] /order
module.exports.index = async (req, res) => {
  try {
    const user = await User.findOne({
      tokenUser: req.cookies.tokenUser,
      deleted: false,
      status: "active",
    });
    let find = {
      user_id: user.id,
      deleted: false,
    };
    const records = await Order.find(find);
    for (const record of records) {
      for (const product of record.products) {
        const productInfo = await Product.findOne({
          _id: product.product_id,
        }).select("title thumbnail");
        // console.log(productInfo);
        product.productInfo = productInfo;
        // record.product = product;
        // console.log(product.productInfo.title);
      }
    }
    res.render("client/pages/orders/index", {
      pageTitle: "Đơn hàng ",
      records: records,
    });
  } catch (error) {
    req.flash("error", "Hành động xem thất bại!!!");
    req.flash(
      "error",
      "Bạn chưa đăng nhập, hãy đăng nhập để xem thêm chi tiết"
    );
    res.redirect(`/`);
  }
};

// [GET] order/detail/:orderId
module.exports.detail = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
    });
    // console.log(order);
    for (const product of order.products) {
      const productInfo = await Product.findOne({
        _id: product.product_id,
      }).select("title thumbnail");

      product.productInfo = productInfo;

      productsHelper.priceNewProduct(product);

      product.totalPrice = product.priceNew * product.quantity;
    }

    order.totalPrice = order.products.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    res.render("client/pages/orders/detail", {
      pageTitle: "Chi tiết đơn hàng",
      order: order,
    });
  } catch (error) {
    req.flash("error", "Hành động xem thất bại!");
    res.redirect(`/order`);
  }
};
