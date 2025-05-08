const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productsHelper = require("../../Helper/product");
//[GET] /cart/
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId,
  });

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({
        _id: productId,
      }).select("title thumbnail slug price discountPercentage");

      productInfo.priceNew = productsHelper.priceNewProduct(productInfo);
      item.productInfo = productInfo;
      item.totalPrice = item.quantity * productInfo.priceNew;
    }
  }
  // console.log(cart);

  cart.totalPrice = cart.products.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  res.render("client/pages/carts/index", {
    pageTitle: "Gio hang",
    cartDetail: cart,
  });
};
//[POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cart = await Cart.findOne({
    _id: cartId,
  });
  // console.log(cart);
  const existProductInCart = cart.products.find(
    (item) => item.product_id == productId
  );
  if (existProductInCart) {
    const newQuantity = quantity + existProductInCart.quantity;
    await Cart.updateOne(
      {
        _id: cartId,
        "products.product_id": productId,
      },
      {
        "products.$.quantity": newQuantity,
      }
    );
  } else {
    const objectCart = {
      product_id: productId,
      quantity: quantity,
    };
    // console.log(cartId)
    // console.log(productId);
    // console.log(quantity);

    await Cart.updateOne(
      {
        _id: cartId,
      },
      {
        $push: { products: objectCart },
      }
    );
  }

  req.flash("success", "them thanh cong");
  res.redirect("back");
};
//[GET] /cart/delete/productId

module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      $pull: { products: { product_id: productId } },
    }
  );
  req.flash("success", "xoa thanh cong");
  res.redirect("back");
};

//[GET] /cart/update/productId/quantity

module.exports.update = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = req.params.quantity;
  await Cart.updateOne(
    {
      _id: cartId,
      "products.product_id": productId,
    },
    {
      "products.$.quantity": quantity,
    }
  );
  req.flash("success", "da cap nhat so luong");
  res.redirect("back");
};
