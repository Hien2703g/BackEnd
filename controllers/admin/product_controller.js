const { query, application } = require("express");
const Product = require("../../models/product.model");

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
  console.log(req.params);
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({ _id: id }, { status: status });
  res.redirect("back");
};

// [PATCH] / admin / products / change - multi;
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
      break;
    case "inactive":
      await Product.updateMany(
        {
          _id: { $in: ids },
        },
        { status: "inactive" }
      );
      break;
    default:
      break;
  }
  // console.log(type);
  // console.log(ids);
  res.redirect("back");
};
