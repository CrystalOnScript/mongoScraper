console.log("jQuery is here")

// tell server to scrape
$("#scrape").on("click", function() {

  $.ajax({
    method: "GET",
    url: "/scrape"
  })

    .done(function(data) {

      location.reload();
    });
});

// saves tweets
$(".saveTweet").on("click", function() {

  // Save the id from button
  var thisId = $(this).attr("data-id");
  // Now make an ajax call for the Tweet
  $.ajax({
    method: "POST",
    url: "/savetweet/" + thisId
  })
    .done(function(data) {
      console.log(data);
    });
});

// unsaves tweet
$(".removetweet").on("click", function() {

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/removetweet/" + thisId
  })
  location.reload()

    .done(function(data, err) {

      console.log(data)

    });
});

$(".makeNote").on("click", function() {

  console.log("clicked me")
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/makeNote/" + thisId
  })
    .then(function(data) {
      console.log("this is make note data", data);
      $("#notes").append("<h2>" + data.tweetAuthor + "</h2><br>");
      $("#notes").append("<input id='titleinput' name='title' ><br>");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea><br>");
      $("#notes").append("<button data-id='" + data._id + "' class='btn btn-primary savenote'>Save Note</button><br>");
    });
});

$(".seeNote").on("click", function() {
  console.log("see note")
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/seenote/" + thisId
  })
    .done(function(data) {
      console.log(data);
      $("#notes").append("<h2>" + data.tweetAuthor + "</h2>");

      var notes = data.about;
      for (var i = 0; i < notes.length; i++){
        $("#notes").append("<h1>"+ notes[i].title+"</h1><br><h3>"+notes[i].body+"</h3>");

        $("#notes").append("<button data-id='" + notes[i]._id + "' class='removeNote'>Remove</button");
      }
    });
});

// When you click the savenote button
$(document).on("click", ".savenote", function() {

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/savenote/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .done(function(data) {
      $("#notes").empty();
    });
});

$(document).on("click", ".removeNote", function() {
  console.log("clicked me")
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/removenote/" + thisId,
  })
    .done(function(data) {
      location.reload();
    });
});
