const md5 = require("md5");

const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");

const generateHelper = require("../../Helper/generate");
const sendMailHelper = require("../../Helper/send-mail");

// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
};
// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  if (req.cookies.tokenUser) {
    res.clearCookie("tokenUser");
  }
  res.clearCookie("cartId");
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
  res.clearCookie("cartId");
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập tài khoản",
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
  const cart = await Cart.findOne({
    user_id: user.id,
  });
  if (cart) {
    // console.log(cart);
    res.cookie("cartId", cart.id);
  } else {
    //Lưu user_id vào collection carts
    await Cart.updateOne(
      {
        _id: req.cookies.cartId,
      },
      {
        user_id: user.id,
      }
    );
  }
  res.cookie("tokenUser", user.tokenUser);
  await User.updateOne(
    {
      tokenUser: user.tokenUser,
    },
    {
      statusOnline: "online",
    }
  );
  _io.once("connection", (socket) => {
    socket.broadcast.emit("SERVER_RETURN_USER_ONLINE", user.id);
  });
  res.redirect("/");
};

//[GET] /user/logout
module.exports.logout = async (req, res) => {
  await User.updateOne(
    {
      tokenUser: req.cookies.tokenUser,
    },
    {
      statusOnline: "offline",
    }
  );
  res.clearCookie("tokenUser");
  res.clearCookie("cartId");
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
    otp: otp,
    expireAt: Date.now(),
  };
  // console.log(objectForgotPassword);
  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();
  //Neu ton tai thi gui ma OTP qua email
  const subject = "Mã OTP xác minh lấy lại mật khẩu";
  const html = `Mã OTP lấy lại mật khẩu Ecommerce là :<b>${otp}</b>. Thời hạn sử dụng là 3 phút. Hế, đại đại nha bà`;
  sendMailHelper.sendMail(email, subject, html);

  res.redirect(`/user/password/otp?email=${email}`);
};
//[GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;
  // console.log(email);
  res.render("client/pages/user/otp-password", {
    pageTitle: "Confirm-password",
    email: email,
  });
};
//[POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });
  if (!result) {
    req.flash("error", "OTP khong hop le!!");
    res.redirect("back");
    return;
  }
  const user = await User.findOne({
    email: email,
  });
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/user/password/reset");
};
//[GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Reset-password",
  });
};
//[POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  // const confirmPassword = req.body.confirmPassword;
  const tokenUser = req.cookies.tokenUser;
  // console.log(password);
  // console.log(tokenUser);
  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    {
      password: md5(password),
    }
  );
  res.redirect("/");
};

// [GET] /user/info
module.exports.info = async (req, res) => {
  const tokenUser = req.cookies.tokenUser;

  const infoUser = await User.findOne({
    tokenUser: tokenUser,
  }).select("-password");

  res.render("client/pages/user/info", {
    pageTitle: "Thông tin người dùng",
    infoUser: infoUser,
  });
};
// [GET] /user/edit
module.exports.edit = async (req, res) => {
  // console.log("ok");
  res.render("client/pages/user/edit", {
    pageTitle: "Chỉnh sửa thông tin cá nhân",
  });
};
// [PATCH] /user/edit
module.exports.editPatch = async (req, res) => {
  const id = res.locals.user.id;

  const emailExist = await User.findOne({
    _id: {
      $ne: id,
    },
    email: req.body.email,
    deleted: false,
  });

  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại!`);
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }

    await User.updateOne(
      {
        _id: id,
      },
      req.body
    );

    req.flash("success", "Cập nhật tài khoản thành công!");
  }

  res.redirect("back");
};
