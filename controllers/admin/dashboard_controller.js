const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");
const Order = require("../../models/order.model");
// [GET]/amdin/dashboard
module.exports.index = async (req, res) => {
  try {
    const statistic = {
      categoryProduct: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      product: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      account: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      user: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      order: {
        total: 0,
        initial: 0,
        handle: 0,
        complete: 0,
        refuse: 0,
      },
    };

    // ProductCategory
    statistic.categoryProduct.total = await ProductCategory.countDocuments({
      deleted: false,
    });

    statistic.categoryProduct.active = await ProductCategory.countDocuments({
      status: "active",
      deleted: false,
    });

    statistic.categoryProduct.inactive = await ProductCategory.countDocuments({
      status: "inactive",
      deleted: false,
    });
    // End ProductCategory

    // Product
    statistic.product.total = await Product.countDocuments({
      deleted: false,
    });

    statistic.product.active = await Product.countDocuments({
      status: "active",
      deleted: false,
    });

    statistic.product.inactive = await Product.countDocuments({
      status: "inactive",
      deleted: false,
    });
    // End Product

    // Account
    statistic.account.total = await Account.countDocuments({
      deleted: false,
    });

    statistic.account.active = await Account.countDocuments({
      status: "active",
      deleted: false,
    });

    statistic.account.inactive = await Account.countDocuments({
      status: "inactive",
      deleted: false,
    });
    // End Account

    // User
    statistic.user.total = await User.countDocuments({
      deleted: false,
    });

    statistic.user.active = await User.countDocuments({
      status: "active",
      deleted: false,
    });

    statistic.user.inactive = await User.countDocuments({
      status: "inactive",
      deleted: false,
    });
    // End User
    // Oder
    statistic.order.total = await Order.countDocuments({
      deleted: false,
    });

    statistic.order.initial = await Order.countDocuments({
      status: "initial",
      deleted: false,
    });

    statistic.order.handle = await Order.countDocuments({
      status: "handle",
      deleted: false,
    });
    statistic.order.complete = await Order.countDocuments({
      status: "complete",
      deleted: false,
    });
    // End Oder
    res.render("admin/pages/dashboard/index.pug", {
      pageTitle: "Dashboard",
      statistic: statistic,
    });
    // res.send("Trang tong quan");
  } catch (error) {
    req.flash("error", `Loi `);
    res.render("errors/404", {
      pageTitle: "404 Not Found",
    });
  }
};
