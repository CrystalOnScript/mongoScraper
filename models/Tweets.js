// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var TweetsSchema = new Schema({
  // title is a required string
  tweetAuthor: {
    type: String,
    required: true
  },
  tweetTime: {
    type: String,
    required: true
  },
  tweetText: {
    type: String,
    required: true
  },

  saved: {
    type: Boolean,
    default: false
  },

  // This only saves one note's ObjectId, ref refers to the about model
  about: [{
    title: String,
    body: String,
    aboutId:{
    type: Schema.Types.ObjectId,
    ref: "About"
  },
}]
});

// Create the Tweets model with the TweetssSchema
var Tweets = mongoose.model("Tweets", TweetsSchema);

// Export the model
module.exports = Tweets;
