console.log("jQuery is here")

$(".saveTweet").on("click", function() {

  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  // Now make an ajax call for the Article
  $.ajax({
    method: "POST",
    url: "/savetweet/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
    });
});

$(".makeNote").on("click", function() {

  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  // Now make an ajax call for the Article
  $.ajax({
    method: "POST",
    url: "/makeNote/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
    });
});

$(".makeNote").on("click", function() {

  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  // Now make an ajax call for the Article
  $.ajax({
    method: "POST",
    url: "/makeNote/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.tweetAuthor + "</h2><br>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' ><br>");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea><br>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' class='btn btn-primary savenote'>Save Note</button><br>");
      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

$(".seeNote").on("click", function() {
  console.log("see note")
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/seeNote/" + thisId
    })
      // With that done, add the note information to the page
      .done(function(data) {
        console.log("DATA"+data.body);
        $("#notes").append("<h2>" + data.about + "</h2><br>");

  });
});
// When you click the savenote button
$(document).on("click", ".savenote", function() {
  // Grab the id associated with the article from the submit button
  console.log("clicked save")
  var thisId = $(this).attr("data-id");
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/saveNote/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log("this is save note data \n" + data);
      // Empty the notes section
      $("#notes").empty();
    });
  // // Also, remove the values entered in the input and textarea for note entry
  // $("#titleinput").val("");
  // $("#bodyinput").val("");
});
