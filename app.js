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
var app = express();
var databaseUrl = "trumpTweets";
var collections = ["tttext"];
// Set up a static folder (public)
// app.use(express.static("public"));

var db = mongojs(databaseUrl, collections);
db.dropDatabase()

request("https://twitter.com/realDonaldTrump", function(error, response, html) {

  var $ = cheerio.load(html);


  var result = [];
  $("span.FullNameGroup").each(function(i, element){

        var tweetAuthor = $(element).children("strong.fullname").text();
        console.log(tweetAuthor);

        var tweetObj = {

          tweetAuthor: tweetAuthor,

        };


          result.push(tweetObj);

          db.trumpTweets.insert({"tweetAuthor": tweetAuthor});

        });
});

app.get("/", function(req, res) {

  db.trumpTweets.find({}, function(error, found) {

    if (error) {
      console.log(error);
    }

    else {
      var authorArray = [];
      for(var i=0; i < found.length; i++){
        authorArray.push(found[i].tweetAuthor)
      }
      res.json(authorArray)
    }
  });
})


app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
