// Require mongoose
var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

// Create the Note schema
var AboutSchema = new Schema({
  // Just a string
  title: {
    type: String
  },
  body: {
    type: String
  }
});

// Remember, Mongoose will automatically save the ObjectIds of the notes
// These ids are referred to in the Article model

// Create the Note model with the NoteSchema
var About = mongoose.model("About", AboutSchema);

// Export the Note model
module.exports = About;
