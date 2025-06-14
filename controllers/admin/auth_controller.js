const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

const md5 = require("md5");

//[GET] /admin/auth/login
module.exports.login = (req, res) => {
  // console.log(req.cookies.token);
  if (req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
  } else {
    res.render("admin/pages/auth/login.pug", {
      pageTitle: "Login",
    });
  }
};
//[POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  //   console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  const user = await Account.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Không tồn tại tài khoản !!!");
    res.redirect("back");
    return;
  }
  if (md5(password) != user.password) {
    req.flash("error", "Sai mật khẩu !!!");
    res.redirect("back");
    return;
  }
  if (user.status != "active") {
    req.flash("error", "Tài khoản đã bị khóa !!!");
    res.redirect("back");
    return;
  }
  res.cookie("token", user.token);
  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
};

module.exports.logout = (req, res) => {
  // Xóa token trong cookie
  res.clearCookie("token");
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
};
//
