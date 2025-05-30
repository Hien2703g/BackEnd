const express = require("express");
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const systemConfig = require("./config/system");
const database = require("./config/database");
const moment = require("moment");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();
const app = express();

//socketIO
const server = http.createServer(app);
const io = new Server(server);
global._io = io;
//end SocketIO

//flash
app.use(cookieParser("keyboard cat"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// methodOverride
//Tinymce
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);
//End Tinymce
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
const port = process.env.PORT;
database.connect();
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.use(express.static(`${__dirname}/public`));
app.locals.moment = moment;
// App locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
// Router
route(app);
routeAdmin(app);
app.get("*", (req, res) => {
  res.render("errors/404", {
    pageTitle: "404 Not Found",
  });
});

// app.listen(port, () => {
//   console.log(`App listening on port ${port}`);
// });
server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
