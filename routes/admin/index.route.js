const systemConfig = require("../../config/system");
const authMiddleware = require("../../middlewares/admin/auth.middleware");
const settingMiddleware = require("../../middlewares/admin/setting.middleware");

const dashboardRoute = require("./dashboard.route");
const productRoute = require("./product_route");
const productCategoryRoute = require("./product-category.route");
const roleRoute = require("./role.route");
const accountRoute = require("./account.route");
const authRoute = require("./auth.route");
const articleRoute = require("./article.route");
const myAccountRoutes = require("./my-account.route");
const usersRoute = require("./user.route");
const settingRoutes = require("./setting.route");
const orderRoute = require("./order.route");

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;
  app.use(settingMiddleware.settingGeneral);
  app.use(
    PATH_ADMIN + "/dashboard",
    authMiddleware.requireAuth,
    dashboardRoute
  );

  app.use(PATH_ADMIN + "/products", authMiddleware.requireAuth, productRoute);

  app.use(
    PATH_ADMIN + "/products-category",
    authMiddleware.requireAuth,
    productCategoryRoute
  );

  app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth, roleRoute);

  app.use(PATH_ADMIN + "/accounts", authMiddleware.requireAuth, accountRoute);

  app.use(PATH_ADMIN + "/users", authMiddleware.requireAuth, usersRoute);

  app.use(PATH_ADMIN + "/orders", authMiddleware.requireAuth, orderRoute);

  app.use(PATH_ADMIN + "/articles", authMiddleware.requireAuth, articleRoute);

  app.use(PATH_ADMIN + "/auth", authRoute);

  app.use(
    PATH_ADMIN + "/my-account",
    authMiddleware.requireAuth,
    myAccountRoutes
  );
  app.use(PATH_ADMIN + "/settings", authMiddleware.requireAuth, settingRoutes);
};
