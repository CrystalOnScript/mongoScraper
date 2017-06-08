``// dependencies
var express     = require("express");
var exphbs      = require("express-handlebars");
var mongoose    = require("mongoose");
var bodyParser  = require("body-parser");
var logger      = require("morgan");

// inport models
var About       = require("./models/About.js");
var Tweets      = require("./models/Tweets.js");

var request     = require("request");
var cheerio     = require("cheerio");

mongoose.Promise = Promise;
// PORT
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();


app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
// express handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("./public"));

// database connection
if (process.env.MONGODB_URI){
  mongoose.connect(process.env.MONGODB_URI)
}else{
  mongoose.connect("mongodb://localhost/trumpTweets");
}



var db = mongoose.connection;

// routes to home, check DB for tweets
app.get("/", function(req, res) {

  Tweets.find({tweetAuthor: "Donald J. Trump"}).then(function(data) {

    var hbsObject = {
      Tweets: data
    };
    res.render("index", hbsObject);
  });
});

// scrapes twitter for data
app.get("/scrape", function(req, res) {
  db.dropDatabase();

  request("https://twitter.com/realDonaldTrump", function(error, response, html) {

    var $ = cheerio.load(html);
    var saveTweets = [];
    // loop through each element that is a div with the class of content
    $("div.content").each(function(i, element) {

      var result = {};

      // finds the author of the tweet - this is here to stop confusion of retweets
      result.tweetAuthor = $(this).children("div.stream-item-header").children("a.account-group").children("span.FullNameGroup").children("strong.fullname").text();
      // finds the timestamp of tweet
      result.tweetTime = $(this).children("div.stream-item-header").children("small.time").children("a.tweet-timestamp").children("span._timestamp").text();
      // finds the text of the tweet
      result.tweetText = $(this).children("div.js-tweet-text-container").children("p.tweet-text").text();

      saveTweets.push(result);
    })
    var hbsObject = {
      Tweets: saveTweets
    };

    saveTweets.forEach(function(items){
      var entry = new Tweets(items);
      entry.save(function(err, entry) {
        if (err) {
          console.log(err);
        }
        else {
          console.log("success");
          ;
        }
      });
    });
    console.log("this is hbsObject", hbsObject.Tweets[0])
  res.render("index.handlebars", hbsObject);
  });
});


// saves a tweet so you can comment
app.post("/savetweet/:id", function(req, res, data) {
  console.log(data)
  var query = {"_id": req.params.id};
  var update = {"saved": true};
  var options = {new: true};
      Tweets.findOneAndUpdate(query, update, options, function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          res.send(doc);
        }
      });
  console.log("saved tweet")
});

// unsaves tweet
app.post("/removetweet/:id", function(req, res, data) {
  var query = {"_id": req.params.id};
  var update = {"saved": false};
  var options = {new: true};
      Tweets.findOneAndUpdate(query, update, options).then(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          res.json({ success: true});
        }
      });

  console.log("removed tweet")

});

// views all the saved tweets
app.get("/viewTweets", function(req, res) {
    Tweets.find({tweetAuthor: "Donald J. Trump"}).then(function(data) {
      var hbsObject = {
        Tweets: data
      };
      console.log("this is the hbs object" + hbsObject);
      res.render("savedtweets", hbsObject);
    });
});

// creates box to make note
app.get("/makeNote/:id", function(req, res) {
      Tweets.findOne({ "_id": req.params.id })
      .populate("note")
      .exec(function(error, doc) {
        if (error) {
          console.log(error);
        }
        else {
          res.json(doc);
        }
      });
      console.log("created note")
});

 // saves created note
app.post("/savenote/:id", function(req, res) {
  var newNote = new About(req.body);
  console.log("this is newNote", newNote)
  newNote.save(function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      Tweets.findOneAndUpdate({ "_id": req.params.id }, {$push: {"about": newNote }})
      .exec(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          res.send(doc);
        }
      });
    }
  });
});

// show saved notes
app.get("/seenote/:id", function(req, res) {
  Tweets.findOne({ "_id": req.params.id })
  .populate("about").exec(function(error, data) {
    console.log("THIS IS DOC \n" +data)
    if (error) {
      console.log(error);
    }
    else {
      res.json(data);
    }
  });
});

// deletes a note
app.post("/removenote/:id", function(req, res) {
  About.remove({ _id: req.params.id }, function(err) {
    if (err) {
      console.log(err);
    }
    else {
      res.send("deleted");
    }
  });
});

// listens to port
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
