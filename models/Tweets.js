// Require mongoose
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var TweetsSchema = new Schema({
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

  about: [{
    type: Schema.Types.ObjectId,
    ref: "About"
  }]
});

// Create the Tweets model with the TweetsSchema
var Tweets = mongoose.model("Tweets", TweetsSchema);

// Export the model
module.exports = Tweets;
