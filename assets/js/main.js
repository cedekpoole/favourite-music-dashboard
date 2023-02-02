console.log("hey");

function showLyricData() {
  // Using jQuery, connect this to the value of the search input
  let artist = prompt("Enter artist name");

  // Ajax request for artist (Deezer API)
  let settings = {
    async: true,
    crossDomain: true,
    url: "https://deezerdevs-deezer.p.rapidapi.com/search?q=" + artist,
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "ca3e3b7c4dmshcf0d18644a9b128p15b157jsnca8487f0f2a9",
      "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
    },
  };
  // Need to prompt user for song name here (depends on which card they click)
  $.ajax(settings).done(function (response) {
    console.log(response);
    // Get query URL for the lyric API
    // Dependent on song name given, change the index of response.data
    var queryURL =
      "https://some-random-api.ml/lyrics?title=" +
      response.data[0].artist.name +
      " " +
      response.data[0].title;
    // Send ajax request for lyrics data
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response.lyrics);
    });
  });
}

// $("**SEARCH BUTTON**").on("click", showLyricData);
