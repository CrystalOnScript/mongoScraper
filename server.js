// dependencies
var express     = require("express");
var exphbs      = require("express-handlebars");
var mongojs     = require("mongojs");
var mongoose    = require("mongoose");
var bodyParser  = require("body-parser");
var request     = require("request");
var cheerio     = require("cheerio")
var router      = require("./controllers/controller.js");
// PORT
var PORT = process.env.PORT || 8000;

// Initialize Express
var app = express();
var databaseUrl = "trumpTweets";
var collections = ["tttext"];

// database
var db = mongojs(databaseUrl, collections);

// TODO delete - this is for testing
db.dropDatabase()

// requests trump twitter page
request("https://twitter.com/realDonaldTrump", function(error, response, html) {

  var $ = cheerio.load(html);

  // loop through each element that is a div with the class of content
  $("div.content").each(function(i, element) {


    // finds the text of the tweet
    var tweetText = $(element).children("div.js-tweet-text-container").children("p.tweet-text").text();
    // finds the author of the tweet - this is here to stop confusion of retweets
    var tweetAuthor = $(element).children("div.stream-item-header").children("a.account-group").children("span.FullNameGroup").children("strong.fullname").text();
    // finds the timestamp of tweet
    var tweetTime = $(element).children("div.stream-item-header").children("small.time").children("a.tweet-timestamp").children("span._timestamp").text();



    // push tweet info to mongo db
    db.trumpTweets.insert({"tweetAuthor": tweetAuthor, "tweetTime": tweetTime, "tweetText": tweetText});


  });
});

// init handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("./public"));
app.use("/", router)

// listens to port 
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
