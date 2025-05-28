const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const filterStatusHelper = require("../../Helper/filterStatus");
const SearchHelper = require("../../Helper/search");
const PagitationHelper = require("../../Helper/pagination");
const systemConfig = require("../../config/system");
const productsHelper = require("../../Helper/product");
// [GET] admin/order
module.exports.index = async (req, res) => {
  try {
    // FilterSatus
    const filterStatus = filterStatusHelper.order(req.query);
    let find = {
      deleted: false,
    };
    if (req.query.status) {
      find.status = req.query.status;
    }
    //End FilterStatus

    // Search
    const objectSearch = SearchHelper(req.query);
    if (objectSearch.regex) {
      find.name = objectSearch.regex;
    }
    //End Search

    const countOrder = await Order.countDocuments(find);
    //Pagitation
    let objectPagitation = PagitationHelper(
      req.query,
      {
        limitItem: 5,
        currentPage: 1,
      },
      countOrder
    );
    // //Sort
    // let sort = {};
    // if (req.query.sortKey && req.query.sortValue) {
    //   sort[req.query.sortKey] = req.query.sortValue;
    // } else {
    //   sort.fullName = "asc";
    // }

    // //End Sort
    const records = await Order.find(find)
      // .sort(sort)
      .limit(objectPagitation.limitItem)
      .skip(objectPagitation.skip);
    for (const record of records) {
      for (const product of record.products) {
        const productInfo = await Product.findOne({
          _id: product.product_id,
        }).select("title thumbnail");
        // console.log(productInfo);
        product.productInfo = productInfo;
        // console.log(product.productInfo.title);
      }
    }
    res.render("admin/pages/orders/index", {
      pageTitle: "Đơn hàng",
      records: records,
      keyword: objectSearch.keyword,
      pagitation: objectPagitation,
      filterStatus: filterStatus,
    });
  } catch (error) {
    req.flash("error", "Hành động xem thất bại");
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  }
};

// [PATCH] /admin /orders/change - multi;
module.exports.changeMulti = async (req, res) => {
  try {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    switch (type) {
      case "initial":
        await Order.updateMany(
          {
            _id: { $in: ids },
          },
          {
            status: "initial",
            $push: { updatedBy: updatedBy },
          }
        );
        req.flash(
          "success",
          `Cập nhật trạng thái ${ids.length} đơn hàng thành công!!!`
        );
        break;

      case "handle":
        await Order.updateMany(
          {
            _id: { $in: ids },
          },
          {
            status: "handle",
            $push: { updatedBy: updatedBy },
          }
        );
        req.flash(
          "success",
          `Cập nhật trạng thái ${ids.length} đơn hàng thành công!!!`
        );
        break;
      case "complete":
        await Order.updateMany(
          {
            _id: { $in: ids },
          },
          { status: "complete", $push: { updatedBy: updatedBy } }
        );

        req.flash(
          "success",
          `Cập nhật trạng thái ${ids.length} đơn hàng thành công!!!`
        );
        break;
      case "refuse":
        for (const id of ids) {
          const order = await Order.findOne({
            _id: id,
          });
          // console.log(order);
          for (const product of order.products) {
            const item = await Product.findOne({
              _id: product.product_id,
            });
            // console.log(item.stock);
            // console.log(product.quantity);
            item.stock = parseInt(item.stock) + parseInt(product.quantity);
            // console.log(item.stock);
            await Product.updateOne(
              {
                _id: product.product_id,
              },
              {
                stock: item.stock,
              }
            );
          }
        }
        await Order.updateMany(
          {
            _id: { $in: ids },
          },
          { status: "refuse", $push: { updatedBy: updatedBy } }
        );
        req.flash(
          "success",
          `Cập nhật trạng thái ${ids.length} đơn hàng thành công!!!`
        );
        break;
      case "delete-all":
        await Order.updateMany(
          {
            _id: { $in: ids },
          },
          {
            deleted: true,
            deletedBy: {
              account_id: res.locals.user.id,
              deletedAt: new Date(),
            },
          }
        );
        req.flash("success", `Xóa ${ids.length} đơn hàng thành công!!!`);
        break;
      default:
        break;
    }
    res.redirect("back");
  } catch (error) {
    req.flash("error", "Cập nhật trạng thái thất bại!");
    res.redirect(`${systemConfig.prefixAdmin}/orders`);
  }
};

// [DELETE] /admin/orders/delete;
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    // await Product.deleteOne({ _id: id });

    await Order.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedBy: {
          account_id: res.locals.user.id,
          deletedAt: new Date(),
        },
      }
    );

    req.flash("success", `Đã xóa đơn hàng thành công!!!`);
    res.redirect("back");
  } catch (error) {
    req.flash("error", "Hành động xóa đặt hàng thất bại!");
    res.redirect(`${systemConfig.prefixAdmin}/orders`);
  }
};

// [GET] /admin//detail/:orderId
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

    res.render("admin/pages/orders/detail", {
      pageTitle: "Chi tiết đơn hàng",
      order: order,
    });
  } catch (error) {
    req.flash("error", "Hành động xem thất bại!");
    res.redirect(`${systemConfig.prefixAdmin}/orders`);
  }
};
