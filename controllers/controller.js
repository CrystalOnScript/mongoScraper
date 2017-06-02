// dependencies
var express     = require("express");
var router      = express.Router();
var path        = require("path")
var mongojs     = require("mongojs");
var mongoose    = require("mongoose");
var databaseUrl = "trumpTweets";
var collections = ["tttext"];
var db          = mongojs(databaseUrl, collections);

// TODO gets database info and returns in json - needs to be updated
router.get("/", function(req, res) {

  db.trumpTweets.find({}, function(error, found) {

    if (error) {
      console.log(error);
    }

    else {

      res.json(found);
    }
  });
})

module.exports = router;
