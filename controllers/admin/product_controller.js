const { query, application } = require("express");
const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const ProductReview = require("../../models/review_products.model");

const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../Helper/filterStatus");
const SearchHelper = require("../../Helper/search");
const PagitationHelper = require("../../Helper/pagination");
const createTreeHelper = require("../../Helper/createTree");
const Format = require("../../Helper/format");
// [Get] / admin / products;
module.exports.index = async (req, res) => {
  try {
    // FilterSatus
    const filterStatus = filterStatusHelper.item(req.query);
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
      // keyword = req.query.keyword;
      // const regex = new RegExp(keyword, "i");
      find.title = objectSearch.regex;
    }
    //End Search

    const countProducts = await Product.countDocuments(find);
    //Pagitation
    let objectPagitation = PagitationHelper(
      req.query,
      {
        limitItem: 4,
        currentPage: 1,
      },
      countProducts
    );
    //End Patitation

    //Sort
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    } else {
      sort.position = "desc";
    }

    //End Sort
    const products = await Product.find(find)
      .sort(sort)
      .limit(objectPagitation.limitItem)
      .skip(objectPagitation.skip);
    // console.log(products);
    for (const product of products) {
      //Lấy ra thông tin người tạo
      const user = await Account.findOne({
        _id: product.createdBy.account_id,
      });
      // console.log(user);
      if (user) {
        product.accountFullName = user.fullName;
      }
      // Lấy thông tin người cập nhật gần nhất
      //Lấy ra thông tin người cập nhật gần nhất
      const updatedBy = product.updatedBy[product.updatedBy.length - 1];
      if (updatedBy) {
        const userUpdated = await Account.findOne({
          _id: updatedBy.account_id,
        });

        updatedBy.accountFullName = userUpdated.fullName;
      }
    }
    res.render("admin/pages/products/index", {
      pageTitle: "Danh sách sản phẩm",
      products: products,
      filterStatus: filterStatus,
      keyword: objectSearch.keyword,
      pagitation: objectPagitation,
    });
  } catch (error) {
    req.flash("error", `Hành động xem lỗi`);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  }
};

// [PATCH]/admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    // console.log(req.params);
    const status = req.params.status;
    const id = req.params.id;
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    await Product.updateOne(
      { _id: id },
      { status: status, $push: { updatedBy: updatedBy } }
    );
    req.flash("success", "Cập nhật trạng thái thành công!");
    res.redirect("back");
  } catch (error) {
    req.flash("error", "Cập nhật trạng thái thất bại!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /admin /products/change - multi;
module.exports.changeMulti = async (req, res) => {
  try {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    switch (type) {
      case "active":
        await Product.updateMany(
          {
            _id: { $in: ids },
          },
          {
            status: "active",
            $push: { updatedBy: updatedBy },
          }
        );
        req.flash(
          "success",
          `Cập nhật trạng thái ${ids.length} sản phẩm thành công!!!`
        );
        break;
      case "inactive":
        await Product.updateMany(
          {
            _id: { $in: ids },
          },
          { status: "inactive", $push: { updatedBy: updatedBy } }
        );
        req.flash(
          "success",
          `Cập nhật trạng thái ${ids.length} sản phẩm thành công!!!`
        );
        break;
      case "delete-all":
        await Product.updateMany(
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
        req.flash("success", `Xóa ${ids.length} sản phẩm thành công!!!`);
        break;
      case "change-position":
        for (const item of ids) {
          // console.log(item.split("-"));
          let [id, position] = item.split("-");
          position = parseInt(position);
          await Product.updateOne(
            {
              _id: id,
            },
            { position: position, $push: { updatedBy: updatedBy } }
          );
        }
        req.flash(
          "success",
          `Cập nhật vị trí ${ids.length} sản phẩm thành công!!!`
        );
        break;
      default:
        break;
    }
    // console.log(type);
    // console.log(ids);
    res.redirect("back");
  } catch (error) {
    req.flash("error", `Sản phẩm không tồn tại`);
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
// [DELETE] /admin/products/Delete;
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    // await Product.deleteOne({ _id: id });
    await Product.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedBy: {
          account_id: res.locals.user.id,
          deletedAt: new Date(),
        },
      }
    );
    req.flash("success", `Xóa sản phẩm thành công!!!`);
    res.redirect("back");
  } catch (error) {
    req.flash("error", `Hành động thất bại`);
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

//[GET] admin/products/create
module.exports.create = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };
    const category = await ProductCategory.find(find);
    const newCategory = createTreeHelper.tree(category);

    // console.log(newRecords);
    res.render("admin/pages/products/create", {
      pageTitle: "Thêm mới sản phẩm",
      category: newCategory,
    });
  } catch (error) {
    req.flash("error", `Hành động thất bại`);
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

//[POST] admin/products/create
module.exports.createPost = async (req, res) => {
  try {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if (req.body.position == "") {
      const countProducts = await Product.countDocuments();
      req.body.position = countProducts + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }
    // if (req.file) {
    //   req.body.thumbnail = `/uploads/${req.file.filename}`;
    // }
    req.body.createdBy = {
      account_id: res.locals.user.id,
    };
    const product = new Product(req.body);
    await product.save();
    req.flash("success", "Tạo sản phẩm thành công!!!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  } catch (error) {
    req.flash("error", `Hành động thất bại`);
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
//[GET] admin/products/edit
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find);
    // console.log(product);
    const category = await ProductCategory.find({ deleted: false });
    const newCategory = createTreeHelper.tree(category);
    res.render("admin/pages/products/edit", {
      pageTitle: "Chinh sua mot san pham",
      product: product,
      category: newCategory,
    });
  } catch (error) {
    req.flash("error", `Sản phẩm không tồn tại`);
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
//[PATCH] admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  // console.log(req.body);
  // res.send("OK");
  const id = req.params.id;
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);
  // if (req.file) {
  //   req.body.thumbnail = `/uploads/${req.file.filename}`;
  // }
  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    // req.body.updatedBy = updatedBy;
    await Product.updateOne(
      {
        _id: id,
      },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
    );

    req.flash("success", `Sản phẩm đã cập nhập thành công`);
  } catch (error) {
    req.flash("error", `Sản phẩm cập nhật thất bại`);
  }
  res.redirect("back");
};

//[GET] admin/products/detail
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find);
    const category = await ProductCategory.find({
      deleted: false,
    });
    const newCategory = createTreeHelper.tree(category);
    // console.log(product);
    //hien thi danh gia
    const reviews = await ProductReview.find({
      product_slug: product.slug,
      status: "done",
    });
    const countReview = await ProductReview.countDocuments({
      product_slug: product.slug,
      status: "done",
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
    // console.log(reviews);
    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product,
      category: newCategory,
      reviews: reviews,
    });
  } catch (error) {
    req.flash("error", `Sản phẩm không tồn tại`);
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
