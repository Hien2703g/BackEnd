const { query, application } = require("express");
const Product = require("../../models/product.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../Helper/filterStatus");
const SearchHelper = require("../../Helper/search");
const PagitationHelper = require("../../Helper/pagitation");
// [Get] / admin / products;
module.exports.index = async (req, res) => {
  // FilterSatus
  const filterStatus = filterStatusHelper(req.query);
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
  const products = await Product.find(find)
    .sort({ position: "desc" })
    .limit(objectPagitation.limitItem)
    .skip(objectPagitation.skip);
  // console.log(products);
  res.render("admin/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagitation: objectPagitation,
  });
};

// [PATCH]/admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  // console.log(req.params);
  const status = req.params.status;
  const id = req.params.id;
  await Product.updateOne({ _id: id }, { status: status });
  req.flash("success", "Cập nhật trạng thái thành công!");
  res.redirect("back");
};

// [PATCH] /admin /products/change - multi;
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await Product.updateMany(
        {
          _id: { $in: ids },
        },
        {
          status: "active",
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
        { status: "inactive" }
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
        { deleted: true, deletedAt: new Date() }
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
          { position: position }
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
};
// [DELETE] /admin/products/Delete;
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  // await Product.deleteOne({ _id: id });
  await Product.updateOne(
    { _id: id },
    { deleted: true, deletedAt: new Date() }
  );
  req.flash("success", `Xóa sản phẩm thành công!!!`);
  res.redirect("back");
};

//[GET] admin/products/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
  });
};

//[POST] admin/products/create
module.exports.createPost = async (req, res) => {
  // console.log(req.body);
  // console.log(req.file);
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.price);
  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  // if (req.file) {
  //   req.body.thumbnail = `/uploads/${req.file.filename}`;
  // }
  const product = new Product(req.body);
  await product.save();
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};
//[POST] admin/products/edit
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find);
    // console.log(product);
    res.render("admin/pages/products/edit", {
      pageTitle: "Chinh sua mot san pham",
      product: product,
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
  req.body.stock = parseInt(req.body.price);
  req.body.position = parseInt(req.body.position);
  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
  try {
    await Product.updateOne(
      {
        _id: id,
      },
      req.body
    );
    req.flash("success", `Sản phẩm đã cập nhập thành công`);
  } catch (error) {
    req.flash("error", `Sản phẩm cập nhật thất bại`);
  }
  res.redirect("back");
};

//[POST] admin/products/detail
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find);
    // console.log(product);
    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    req.flash("error", `Sản phẩm không tồn tại`);
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
