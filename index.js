const express = require("express");
require("dotenv").config();

const multer = require("multer");

const flash = require("express-flash");
const database = require("./config/database");

const cookieParser = require("cookie-parser");
const session = require("express-session");

const systemConfig = require("./config/system");
const bodyParser = require("body-parser");
const app = express();

//flash
app.use(cookieParser("keyboard cat"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// methodOverride
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const port = process.env.PORT;
database.connect();
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.use(express.static(`${__dirname}/public`));

// App locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
// Router
route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// test
