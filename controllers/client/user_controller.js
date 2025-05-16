const md5 = require("md5");

const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");

const generateHelper = require("../../Helper/generate");
// const sendMailHelper = require("../../helpers/send-mail");

// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
};
// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  const existEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });

  if (existEmail) {
    req.flash("error", `Email đã tồn tại!`);
    res.redirect("back");
    return;
  }

  req.body.password = md5(req.body.password);

  const user = new User(req.body);
  // user.tokenUser = generateHelper.generateRandomString(20);
  await user.save();
  console.log(user);
  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/");
};

// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng ký tài khoản",
  });
};
// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", `Email không tồn tại!`);
    res.redirect("back");
    return;
  }

  if (md5(password) != user.password) {
    req.flash("error", `Sai mật khẩu!`);
    res.redirect("back");
    return;
  }

  if (user.status == "inactive") {
    req.flash("error", `Tài khoản bị khoá!`);
    res.redirect("back");
    return;
  }

  res.cookie("tokenUser", user.tokenUser);

  // Lưu user_id vào collection carts
  await Cart.updateOne(
    {
      _id: req.cookies.cartId,
    },
    {
      user_id: user.id,
    }
  );

  res.redirect("/");
};

//[GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/");
};
//[GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Forgot-password",
  });
};
//[POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email khong ton tai!!!");
    res.redirect("back");
    return;
  }
  //Luu thong tin vao DB
  const otp = generateHelper.generateRandomNumber(5);
  const objectForgotPassword = {
    email: email,
    opt: otp,
    expireAt: Date.now(),
  };
  // console.log(objectForgotPassword);
  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();
  //Neu ton tai thi gui ma OTP
  res.send("OK");
};
