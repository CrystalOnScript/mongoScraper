// Require mongoose
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var AboutSchema = new Schema({
  title: {
    type: String
  },
  body: {
    type: String
  }
});

var About = mongoose.model("About", AboutSchema);

module.exports = About;
