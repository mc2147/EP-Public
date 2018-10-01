var onlineURL = "https://immense-mesa-37246.herokuapp.com";
var localURL = "http://localhost:5000";

process.env.BASE_URL =
  process.env.PORT && process.env.LIVE ? onlineURL : localURL;

const path = require("path");
var api = require("./api");
var models = require("./models");

const express = require("express");
const session = require("express-session");
const app = express();
var nunjucks = require("nunjucks");
var routes = require("./routes");
var bodyParser = require("body-parser");
var history = require("connect-history-api-fallback");
var cors = require("cors");

var loadData = require("./data");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: true,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
  })
);

var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
  next();
};

app.use(allowCrossDomain);

app.use(function(req, res, next) {
  next();
});

app.use(
  cors({
    origin: [process.env.CORS_ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true, // enable set cookie
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Content-Length",
      "X-Requested-With"
    ]
  })
);

app.use("/api", api);

app.use("/", routes);

app.use(express.static(path.join(__dirname, "..", "views")));

app.set("view engine", "html"); // have res.render work with html files

app.engine("html", nunjucks.render); // when giving html files to res.render, tell it to use nunjucks

nunjucks.configure("views", { noCache: true });

models.db
  .sync()
  .then(function() {
    console.log("All tables created!");
    app.listen(process.env.PORT || 5000, function() {
      console.log("Server is listening on port 5000!");
    });
  })
  .catch(console.error.bind(console));
