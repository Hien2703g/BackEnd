// [GET]/amdin/dashboard

module.exports.index = (req, res) => {
  res.render("admin/pages/dashboard/index.pug", {
    pageTitle: "Dashboard",
  });
  // res.send("Trang tong quan");
};
