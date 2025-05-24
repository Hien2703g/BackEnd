const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

const productsHelper = require("../../Helper/product");
// [GET] /order
module.exports.index = (req, res) => {
  res.render("client/pages/orders/index", {
    pageTitle: "Đơn hàng ",
  });
};
