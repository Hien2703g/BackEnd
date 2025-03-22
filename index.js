const express = require("express");
require("dotenv").config();

const database = require("./config/database");

const systemConfig = require("./config/system");

const app = express();
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const port = process.env.PORT;
database.connect();
app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static("public"));

// App locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Router
route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
