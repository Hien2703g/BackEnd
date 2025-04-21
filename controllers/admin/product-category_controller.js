const { query, application } = require("express");
const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../Helper/filterStatus");
const SearchHelper = require("../../Helper/search");
const PagitationHelper = require("../../Helper/pagitation");
const createTreeHelper = require("../../Helper/createTree");

// [Get] / admin / products-category;
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
    find.title = objectSearch.regex;
  }
  //End Search
  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);
  // console.log(newRecords);
  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    records: newRecords,
  });
};

// [PATCH]/admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  // console.log(req.params);
  const status = req.params.status;
  const id = req.params.id;
  await ProductCategory.updateOne({ _id: id }, { status: status });
  req.flash("success", "Cập nhật trạng thái thành công!");
  res.redirect("back");
};

// [PATCH] /admin /products-category/change - multi;
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await ProductCategory.updateMany(
        {
          _id: { $in: ids },
        },
        {
          status: "active",
        }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái ${ids.length} danh mục thành công!!!`
      );
      break;
    case "inactive":
      await ProductCategory.updateMany(
        {
          _id: { $in: ids },
        },
        { status: "inactive" }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái ${ids.length} danh mục thành công!!!`
      );
      break;
    case "delete-all":
      await ProductCategory.updateMany(
        {
          _id: { $in: ids },
        },
        { deleted: true, deletedAt: new Date() }
      );
      req.flash("success", `Xóa ${ids.length} sản phẩm thành công!!!`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await ProductCategory.updateOne(
          {
            _id: id,
          },
          { position: position }
        );
      }
      req.flash(
        "success",
        `Cập nhật vị trí ${ids.length} danh mục thành công!!!`
      );
      break;
    default:
      break;
  }
  res.redirect("back");
};

//[GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await ProductCategory.find(find);
  const newRecords = createTreeHelper.tree(records);
  res.render("admin/pages/products-category/create", {
    pageTitle: "Tạo danh mục sản phẩm",
    records: newRecords,
  });
};

//[POST] admin/products-category/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const countProductCategory = await ProductCategory.countDocuments();
    req.body.position = countProductCategory + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  const records = new ProductCategory(req.body);
  await records.save();
  req.flash("success", "Tạo danh mục thành công!!!");
  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};

//[GET] admin/products-category/edit
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await ProductCategory.findOne({
      _id: id,
      deleted: false,
    });
    const records = await ProductCategory.find({
      deleted: false,
    });

    const newRecords = createTreeHelper.tree(records);

    res.render("admin/pages/products-category/edit", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      data: data,
      records: newRecords,
    });
  } catch (error) {
    req.flash("error", `Danh mục không tồn tại`);
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

//[PATCH] admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.position = parseInt(req.body.position);
  try {
    await ProductCategory.updateOne(
      {
        _id: id,
      },
      req.body
    );
    req.flash("success", `Danh mục sản phẩm đã cập nhập thành công`);
  } catch (error) {
    req.flash("error", `Danh mục sản phẩm cập nhật thất bại`);
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
    const records = await ProductCategory.findOne(find);
    res.render("admin/pages/products-category/detail", {
      pageTitle: records.title,
      records: records,
    });
  } catch (error) {
    req.flash("error", `Sản phẩm không tồn tại`);
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

// [DELETE] /admin/products-category/Delete;
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  // await Product.deleteOne({ _id: id });
  await Product.updateOne(
    { _id: id },
    { deleted: true, deletedAt: new Date() }
  );
  req.flash("success", `Xóa danh mục sản phẩm thành công!!!`);
  res.redirect("back");
};
