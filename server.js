``// dependencies
var express     = require("express");
var exphbs      = require("express-handlebars");
var mongoose    = require("mongoose");
var bodyParser  = require("body-parser");
var logger      = require("morgan");


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

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("./public"));


if (process.env.MONGODB_URI){
  mongoose.connect(process.env.MONGODB_URI)
}else{
  mongoose.connect("mongodb://localhost/trumpTweets");
}



var db = mongoose.connection;

// DROPS DATABASE
// db.dropDatabase();

app.get("/", function(req, res) {

  Tweets.find({tweetAuthor: "Donald J. Trump"}).then(function(data) {

    var hbsObject = {
      Tweets: data
    };
    console.log("this is the hbs object" + hbsObject);
    res.render("index", hbsObject);
  });
});


app.get("/scrape", function(req, res) {
  db.dropDatabase();
  request("https://twitter.com/realDonaldTrump", function(error, response, html) {

    var $ = cheerio.load(html);

    // loop through each element that is a div with the class of content
    $("div.content").each(function(i, element) {

      var result = {};

      // finds the author of the tweet - this is here to stop confusion of retweets
      result.tweetAuthor = $(this).children("div.stream-item-header").children("a.account-group").children("span.FullNameGroup").children("strong.fullname").text();
      // finds the timestamp of tweet
      result.tweetTime = $(this).children("div.stream-item-header").children("small.time").children("a.tweet-timestamp").children("span._timestamp").text();
      // finds the text of the tweet
      result.tweetText = $(this).children("div.js-tweet-text-container").children("p.tweet-text").text();


      console.log(result);

      var entry = new Tweets(result);

      // Now, save that entry to the db
      entry.save(function(err, entry) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(entry);
          ;
        }
      });

    });

    Tweets.find({tweetAuthor: "Donald J. Trump"}).then(function(data) {

      var hbsObject = {
        Tweets: data
      };
      res.json(data);
    });
  });
});

app.post("/savetweet/:id", function(req, res, data) {

  console.log(data)
  var query = {"_id": req.params.id};
  var update = {"saved": true};
  var options = {new: true};
      // Use the article id to find and update it's note
      Tweets.findOneAndUpdate(query, update, options, function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);

        }
      });

  console.log("saved tweet")

});

app.post("/removetweet/:id", function(req, res, data) {

  var query = {"_id": req.params.id};
  var update = {"saved": false};
  var options = {new: true};
      // Use the article id to find and update it's saved status
      Tweets.findOneAndUpdate(query, update, options).then(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.json({ success: true});

        }
      });

  console.log("removed tweet")

});


app.get("/viewTweets", function(req, res) {

    Tweets.find({tweetAuthor: "Donald J. Trump"}).then(function(data) {

      var hbsObject = {
        Tweets: data
      };
      console.log("this is the hbs object" + hbsObject);
      res.render("savedtweets", hbsObject);
    });
});

app.get("/makeNote/:id", function(req, res) {

  console.log("this is req id \n\n"+ req.params.id);
      // Use the article id to find and update it's note
      Tweets.findOne({ "_id": req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      // now, execute our query
      .exec(function(error, doc) {
        // Log any errors
        if (error) {
          console.log(error);
        }
        // Otherwise, send the doc to the browser as a json object
        else {
          res.json(doc);
        }
      });
      console.log("created note")
});

app.post("/savenote/:id", function(req, res) {

  var newNote = new About(req.body);
  console.log("this is newNote", newNote)
  // And save the new note the db
  newNote.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Tweets.findOneAndUpdate({ "_id": req.params.id }, {$push: {"about": newNote }})
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});

app.get("/seenote/:id", function(req, res) {

  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Tweets.findOne({ "_id": req.params.id })
  .populate("about").exec(function(error, data) {

    console.log("THIS IS DOC \n" +data)
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(data);
    }
  });
});

app.post("/removenote/:id", function(req, res) {

  About.remove({ _id: req.params.id }, function(err) {
    if (err) {
      console.log(err);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.send("deleted");
    }
  });

});

// listens to port
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
