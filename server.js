// dependencies
var express     = require("express");
var exphbs      = require("express-handlebars");
var mongojs     = require("mongojs");
var mongoose    = require("mongoose");
var bodyParser  = require("body-parser");
var request     = require("request");
var cheerio     = require("cheerio")

// PORT
var PORT = process.env.PORT || 8000;

// Initialize Express
var app = express();

// Set up a static folder (public)
// app.use(express.static("public"));

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
