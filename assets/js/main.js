console.log("hey");
var resultsHeading = $("#resultsHeading");

$("#invalid-input").hide();
resultsHeading.hide();

function showLyricData(e) {
  e.preventDefault();

  $("#playlistContainer").empty();

  // Using jQuery, connect this to the value of the search input
  let artist = $("#search-input").val();

  //clearing search input field
  $("#search-input").val("");

  // adding artist name to h2
  resultsHeading.text("Most Popular Songs by " + artist);
  resultsHeading.show();

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

  $.ajax(settings).done(function (songResponse) {
    // console.log(songResponse);
    // Get query URL for the lyric API

    // Account for both submitting an empty string or writing an
    // unknown artist. Only writing an empty string (or ajax request limit problems etc)
    //creates a response error object, otherwise it just returns an response object with a total of 0
    if (songResponse.error || songResponse.total === 0) {
      resultsHeading.hide();
      $("#invalid-input").show();
      // remove the pop up after a designated amount of time
      setTimeout(() => {
        $("#invalid-input").hide();
      }, 3000);
    }
    // store song response information
    var songResults = songResponse.data;
    var songResultsArray = [];

    // loop through the data for the first 12 responses
    $.each(songResults, function (index, value) {
      if (index == 12) {
        return false;
      }
      // get the title, artist, cover image and album for each song
      songsObj = {
        songTitle: value.title,
        songArtist: value.artist.name,
        coverImage: value.album.cover,
        songAlbum: value.album.title,
      };
      console.log(songsObj);

      songResultsArray.push(songsObj);
    });

    currentIteration = 0;
    var row = $('<div class="row w-100 justify-content-between"></div>');

    $("#cardContainer").empty();

    // loop through the stored song info and display in bootstrap cards
    for (let i = 0; i < songResultsArray.length; i++) {
      //create div to hold each card
      var songResultContainer = $("<div>");
      songResultContainer.attr(
        "class",
        "col-md-6 col-lg-4 col-xlg-3 flex-fill d-flex align-items-stretch"
      );
      row.append(songResultContainer);

      //create bootstrap card
      var songResultCard = $("<div>");
      songResultCard.attr("class", "card result mt-4 w-100");
      // songResultCard.attr('style', 'width: 12rem;');
      songResultContainer.append(songResultCard);

      //add image to card
      var songResultImg = $("<img>");
      songResultImg.attr("class", "card-img-top");
      songResultImg.attr("src", songResultsArray[i].coverImage);
      songResultCard.append(songResultImg);

      // add card body div
      var songResultCardBody = $("<div>");
      songResultCardBody.attr("class", "d-flex card-body flex-column");
      songResultCard.append(songResultCardBody);

      //add song title heading
      var songResultTitle = $("<h2>");
      songResultTitle.attr("class", "card-title");
      songResultTitle.attr(
        "style",
        "font-size: calc(.5rem + .9vw) !important; margin-bottom: 0 !important;"
      );
      songResultTitle.text(songResultsArray[i].songTitle);
      songResultCardBody.append(songResultTitle);

      // add line
      var songResultDivider = $("<hr>");
      songResultDivider.attr("class", "hr");
      songResultDivider.attr("style", "margin: .5rem 0 !important;");
      songResultCardBody.append(songResultDivider);

      //add album name
      var songResultAlbumName = $("<h3>");
      songResultAlbumName.attr(
        "style",
        "font-size: calc(.5rem + .6vw) !important; margin-bottom: 2rem;"
      );
      songResultAlbumName.text("Album: " + songResultsArray[i].songAlbum);
      songResultCardBody.append(songResultAlbumName);

      //add buttons div
      var songResultButtonDiv = $("<div>");
      songResultButtonDiv.attr("class", "d-flex flex-wrap gap-2 mt-auto");
      songResultCardBody.append(songResultButtonDiv);

      //add buttons to div
      var songResultLyricsBtn = $("<button>");
      songResultLyricsBtn.attr(
        "class",
        "btn btn-primary flex-fill lyricsButton"
      );
      // songResultLyricsBtn.attr("style", "margin-right: .5rem !important;");
      songResultLyricsBtn
        .text("View Lyrics")
        .attr("data-songName", songResultsArray[i].songTitle)
        .attr("data-artistName", songResultsArray[i].songArtist);
      songResultButtonDiv.append(songResultLyricsBtn);

      var songResultFavBtn = $("<button>");
      songResultFavBtn
        .attr("class", "btn btn-primary flex-fill favsButton")
        .attr("data-songName", songResultsArray[i].songTitle)
        .attr("data-coverImg", songResultsArray[i].coverImage);
      songResultFavBtn.text("Add to Favs");
      songResultButtonDiv.append(songResultFavBtn);

      currentIteration++;
    }

    $("#cardContainer").append(row);
  });
}

$("#search-button").on("click", showLyricData);

function showFavourites() {
  var songs = JSON.parse(localStorage.getItem("songData")) || [];
  for (var song of songs) {
    var card = $("<div>");
    card.attr("class", "card mb-3").attr("style", "max-width: 540px;");
    card.html(
      '<div class="row g-0">' +
        '<div class="col-md-4">' +
        '<img src="' +
        song.image +
        '" class="rounded-start h-100 w-100"' +
        'alt="...">' +
        "</div>" +
        '<div class="col-md-8 d-flex flex-column p-3">' +
        '<div class="mb-auto pt-3">' +
        '<h5 class="card-title">' +
        song.songTitle +
        "</h5>" +
        "</div>" +
        '<div class="pb-2">' +
        '<button class="btn btn-primary">View Lyrics</button>' +
        "</div>" +
        "</div>" +
        "</div>"
    );
    $("#favourites").append(card);
  }
}

$("#cardContainer").on("click", ".favsButton", function () {
  $("#favourites").empty();
  var songs = JSON.parse(localStorage.getItem("songData")) || [];
  var songObject = {
    image: $(this).attr("data-coverImg"),
    songTitle: $(this).attr("data-songName"),
  };
  songs.push(songObject);
  localStorage.setItem("songData", JSON.stringify(songs));

  showFavourites();
});

function clearFavourites() {
  $("#favourites").empty();
  localStorage.clear();
}

$("#clearFavourites").on("click", clearFavourites);

$(document).on("click", ".lyricsButton", showModal);

function showModal(e) {
  e.preventDefault();
  var button = $(e.target);
  var songName = button.attr("data-songName");
  var artistName = button.attr("data-artistName");

  $("#lyricsModalTitle").empty();
  $("#favouritesButton").hide();
  $("#lyricsModalContent").html(
    '<div class="d-flex justify-content-center">' +
      '<div class="spinner-border"' +
      'role="status">' +
      "</div>" +
      "</div>"
  );

  queryURL = "https://some-random-api.ml/lyrics?title=" + songName + artistName;

  $.ajax({
    url: queryURL,
    method: "GET",
  })
    .then(function (response) {
      console.log(response);
      $("#lyricsModalTitle").text(`${songName} by ${artistName}  - Lyrics`);
      $("#lyricsModalContent").html(response.lyrics); // LOCAL STORAGE STUFF (will go in showLyricData function later)
      $("#favouritesButton").show();
    })
    .fail(function () {
      $("#lyricsModalTitle").text("Oops!");
      $("#lyricsModalContent").text(
        "We weren't able to find lyrics for that song! :("
      );
      $("#favouritesButton").hide();
    });
  $("#lyricsModal").modal("show");
}

// $( document ).ajaxError(function(event, jqxhr, settings, thrownError ) {
//  console.log(event);
// });

showPlaylist();

function showPlaylist() {
  const settings = {
    async: true,
    crossDomain: true,
    url: "https://deezerdevs-deezer.p.rapidapi.com/playlist/915487765",
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "ca3e3b7c4dmshcf0d18644a9b128p15b157jsnca8487f0f2a9",
      "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
    },
  };

  $.ajax(settings).done(function (playlistResponse) {
    console.log(playlistResponse);

    // store song response information
    var playlistTracks = playlistResponse.tracks.data;
    var playlistTracksArray = [];

    // loop through the data for the first 12 responses
    $.each(playlistTracks, function (index, value) {
      if (index == 12) {
        return false;
      }
      // get the title, artist, cover image and album for each song
      playlistObj = {
        songTitle: value.title,
        songArtist: value.artist.name,
        coverImage: value.album.cover,
        songAlbum: value.album.title,
      };
      console.log(playlistObj);

      playlistTracksArray.push(playlistObj);
    });

    var playlistRow = $(
      '<div class="row w-100 justify-content-between"></div>'
    );

    var playlistHeading = $("<h2>");
    playlistHeading
      .attr("class", "card-px-2 mt-4")
      .attr("style", "text-transform: Capitalize;")
      .attr("id", "playlistHeading");
    playlistHeading.text("Hits UK Playlist");
    $("#playlistContainer").prepend(playlistHeading);

    // loop through the stored song info and display in bootstrap cards
    for (let i = 0; i < playlistTracksArray.length; i++) {
      //create div to hold each card
      var playlistTracksContainer = $("<div>");
      playlistTracksContainer.attr(
        "class",
        "col-md-6 col-lg-4 col-xlg-3 flex-fill d-flex align-items-stretch"
      );
      playlistRow.append(playlistTracksContainer);

      //create bootstrap card
      var playlistCard = $("<div>");
      playlistCard.attr("class", "card result mt-4 w-100");
      // songResultCard.attr('style', 'width: 12rem;');
      playlistTracksContainer.append(playlistCard);

      //add image to card
      var playlistImg = $("<img>");
      playlistImg.attr("class", "card-img-top");
      playlistImg.attr("src", playlistTracksArray[i].coverImage);
      playlistCard.append(playlistImg);

      // add card body div
      var playlistCardBody = $("<div>");
      playlistCardBody.attr("class", "d-flex card-body flex-column");
      playlistCard.append(playlistCardBody);

      //add song title heading
      var playlistTitle = $("<h2>");
      playlistTitle.attr("class", "card-title");
      playlistTitle.attr(
        "style",
        "font-size: calc(.5rem + .9vw) !important; margin-bottom: 0 !important;"
      );
      playlistTitle.text(playlistTracksArray[i].songTitle);
      playlistCardBody.append(playlistTitle);

      // add line
      var playlistDivider = $("<hr>");
      playlistDivider.attr("class", "hr");
      playlistDivider.attr("style", "margin: .5rem 0 !important;");
      playlistCardBody.append(playlistDivider);

      // add artist
      var playlistArtistName = $("<h3>");
      playlistArtistName.attr(
        "style",
        "font-size: calc(.5rem + .6vw) !important; margin-bottom: 0 !important;"
      );
      playlistArtistName.text("By " + playlistTracksArray[i].songArtist);
      playlistCardBody.append(playlistArtistName);

      // add line
      var playlistDivider2 = $("<hr>");
      playlistDivider2.attr("class", "hr");
      playlistDivider2.attr("style", "margin: .5rem 0 !important;");
      playlistCardBody.append(playlistDivider2);

      //add album name
      var playlistAlbumName = $("<h3>");
      playlistAlbumName.attr(
        "style",
        "font-size: calc(.5rem + .6vw) !important; margin-bottom: 2rem;"
      );
      playlistAlbumName.text("Album: " + playlistTracksArray[i].songAlbum);
      playlistCardBody.append(playlistAlbumName);

      //add buttons div
      var playlistButtonDiv = $("<div>");
      playlistButtonDiv.attr("class", "d-flex flex-wrap gap-2 mt-auto");
      playlistCardBody.append(playlistButtonDiv);

      //add buttons to div
      var playlistLyricsBtn = $("<button>");
      playlistLyricsBtn.attr("class", "btn btn-primary flex-fill lyricsButton");
      // songResultLyricsBtn.attr("style", "margin-right: .5rem !important;");
      playlistLyricsBtn
        .text("View Lyrics")
        .attr("data-songName", playlistTracksArray[i].songTitle)
        .attr("data-artistName", playlistTracksArray[i].songArtist);
      playlistButtonDiv.append(playlistLyricsBtn);

      var playlistFavBtn = $("<button>");
      playlistFavBtn
        .attr("class", "btn btn-primary flex-fill favsButton")
        .attr("data-songName", playlistTracksArray[i].songTitle)
        .attr("data-coverImg", playlistTracksArray[i].coverImage);
      playlistFavBtn.text("Add to Favs");
      playlistButtonDiv.append(playlistFavBtn);
    }

    $("#playlistContainer").append(playlistRow);
  });
}

$("#playlistContainer").on("click", ".favsButton", function () {
  $("#favourites").empty();
  var songs = JSON.parse(localStorage.getItem("songData")) || [];
  var songObject = {
    image: $(this).attr("data-coverImg"),
    songTitle: $(this).attr("data-songName"),
  };
  songs.push(songObject);
  localStorage.setItem("songData", JSON.stringify(songs));

  showFavourites();
});

showFavourites();