const { query } = require("express");
const Product = require("../../models/product.model");

const filterStatusHelper = require("../../Helper/filterStatus");
const SearchHelper = require("../../Helper/search");
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
  // console.log(objectSearch);

  if (objectSearch.regex) {
    // keyword = req.query.keyword;
    // const regex = new RegExp(keyword, "i");
    find.title = objectSearch.regex;
  }
  //End Search

  const countProducts = await Product.countDocuments(find);

  // console.log(countProducts);
  //Pagitation
  let objectPagitation = {
    limitItem: 4,
    currentPage: 1,
  };
  if (req.query.page) {
    objectPagitation.currentPage = parseInt(req.query.page);
  }

  objectPagitation.skip =
    (objectPagitation.currentPage - 1) * objectPagitation.limitItem;
  // console.log(objectPagitation.currentPage);
  const totalPage = Math.ceil(countProducts / objectPagitation.limitItem);
  // console.log(totalPage);

  objectPagitation.totalPage = totalPage;
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
