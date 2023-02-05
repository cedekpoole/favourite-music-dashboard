console.log("hey");
var resultsHeading = $("#resultsHeading");

// $("#invalid-input").hide();
resultsHeading.hide();
$("#clearFavourites").hide();

function showLyricData(e) {
  e.preventDefault();

  $("#playlistContainer").empty();

  // Using jQuery, connect this to the value of the search input
  let artist = $("#search-input").val();

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
    if (songResponse.error) {
      resultsHeading.hide();
      invalidSearch(artist, true);
    }
    else if (songResponse.total === 0) {
      resultsHeading.hide();
      invalidSearch(artist, false);
    }
    else {
      // clear search field
      $("#search-input").val("");

      // adding artist name to h2
      resultsHeading.text("Top Results for " + artist);
      resultsHeading.show();

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
          coverImage: value.album.cover_big,
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
        if(!localStorage.getItem('songData')) {
          songResultContainer.attr(
              "class",
              "resultContainer col-md-6 col-lg-3  flex-fill d-flex align-items-stretch"
            );
      } else {
          songResultContainer.attr(
              "class",
              "resultContainer col-xl-4 col-lg-4 col-md-6 flex-fill d-flex align-items-stretch"
            );
      };
        row.append(songResultContainer);

        //create bootstrap card
        var songResultCard = $("<div>");
        songResultCard.attr("class", "card result mt-4 w-100");
        // songResultCard.attr('style', 'width: 12rem;');
        songResultContainer.append(songResultCard);

        //add image to card
        var songResultImg = $("<img>");
        songResultImg.attr("class", "card-img-top");
        songResultImg.attr("src", songResultsArray[i].coverImage ? songResultsArray[i].coverImage : 'assets/images/default-cover-art.jpg');
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
        songResultDivider.attr("style", "margin: .5rem 0 !important; color: white;");
        songResultCardBody.append(songResultDivider);

        //add artist name
        var songResultArtistName = $("<h3>");
        songResultArtistName.attr(
          "style",
          "font-size: calc(.5rem + .6vw) !important; margin-bottom: 0;"
        );
        songResultArtistName.text("Artist: " + songResultsArray[i].songArtist);
        songResultCardBody.append(songResultArtistName);

        // add line
        var songResultDivider = $("<hr>");
        songResultDivider.attr("class", "hr");
        songResultDivider.attr("style", "margin: .5rem 0 !important; color: white;");
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
          .attr("data-artistName", songResultsArray[i].songArtist)
          .attr("data-coverImg", songResultsArray[i].coverImage);
        songResultButtonDiv.append(songResultLyricsBtn);

        var songResultFavBtn = $("<button>");
        songResultFavBtn
          .attr("class", "btn btn-primary flex-fill favsButton")
          .attr("data-songName", songResultsArray[i].songTitle)
          .attr("data-artistName", songResultsArray[i].songArtist)
          .attr("data-coverImg", songResultsArray[i].coverImage);
        songResultFavBtn.text("Add to Favs");
        songResultButtonDiv.append(songResultFavBtn);

        currentIteration++;
      }

      $("#cardContainer").append(row);
    }

  });
}

function invalidSearch(searchString, apiFail) {
  $("#lyricsModalTitle").text("Oops!");
  $("#retryButton").hide();

  if (searchString === "") {
    $("#lyricsModalContent").text(`You have to search for something!`);
  }
  else if (apiFail) {
    $("#lyricsModalContent").text(`Our system failed to handle your request at this moment. Please try again.`);
    $("#retryButton").show();
  }
  else {
    $("#lyricsModalContent").text(`We weren't able to find any results for "${searchString}"`);
  }
  $("#favouritesButton").hide();
  $("#lyricsModal").modal("show");
}

$("#search-button").on("click", showLyricData);
$("#retryButton").on("click", showLyricData);

// Create a function that reveals favourite song cards 
function showFavourites() {
  // If nothing is saved to local storage, set the variable to an empty array
  var songs = JSON.parse(localStorage.getItem("songData")) || [];
  // Loop through local storage to create a card for each song
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
      '<button class="btn btn-primary lyricsButton" data-songName="' + song.songTitle + '" data-artistName="' + song.songArtist + '">View Lyrics</button>' +
      "</div>" +
      "</div>" +
      "</div>"
    );
    $("#favourites").append(card);
    $("#clearFavourites").html('<button id="clearFavsButton" class="btn rounded-sm btn-dark btn-block mt-3">Clear Favourites</button>')
    if (songs.length === 0) {
      $("#clearFavourites").hide();
    }
    else {
      $("#clearFavourites").show();
    }
  }
}

// Create a function that removes songs from local data and clears favourites cards
function clearFavourites() {
  $("#favourites").empty();
  localStorage.clear();
  $("#clearFavourites").hide();

  if(!localStorage.getItem('songData')) {
    $('aside').hide();
    $('#resultsDiv').removeClass('col-lg-8 col-md-9');
    $('.resultContainer').removeClass('col-xl-4 col-lg-4 col-md-6').addClass('col-md-6 col-lg-3 ');
    
} else {
    $('aside').show();
};

};

// When 'clear favourites' button is clicked, clear favourites cards
$("#clearFavourites").on("click", clearFavourites);

$(document).on("click", ".lyricsButton", showModal);

function showModal(e) {
  e.preventDefault();
  var button = $(e.target);
  var songName = button.attr("data-songName");
  var artistName = button.attr("data-artistName");
  var coverImg = button.attr("data-coverImg");

  $("#lyricsModalTitle").empty();
  $("#favouritesButton").hide();
  $("#lyricsModalContent").html(
    '<div class="d-flex justify-content-center">' +
    '<div class="spinner-border"' +
    'role="status">' +
    "</div>" +
    "</div>");
  $("#retryButton").hide();

  queryURL = "https://some-random-api.ml/lyrics?title=" + songName + artistName;

  $.ajax({
    url: queryURL,
    method: "GET",
  })
    .then(function (response) {
      console.log(response);
      $("#lyricsModalTitle").text(`${songName} by ${artistName}  - Lyrics`);
      $("#lyricsModalContent").html(response.lyrics); 

      $("#favouritesButton").attr("data-songName", songName)
        .attr("data-artistName", artistName)
        .attr("data-coverImg", coverImg);
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
        coverImage: value.album.cover_big,
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

      if(!localStorage.getItem('songData')) {
        playlistTracksContainer
      .attr(
        "class",
        "resultContainer col-md-6 col-lg-3  flex-fill d-flex align-items-stretch"
      );
    } else {
        playlistTracksContainer
        .attr(
          "class",
          "resultContainer col-xl-4 col-lg-4 col-md-6 flex-fill d-flex align-items-stretch"
        );
    };
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
      playlistDivider.attr("style", "margin: .5rem 0 !important; color: white;");
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
      playlistDivider2.attr("style", "margin: .5rem 0 !important; color: white;");
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
        .attr("data-artistName", playlistTracksArray[i].songArtist)
        .attr("data-coverImg", playlistTracksArray[i].coverImage);
      playlistButtonDiv.append(playlistLyricsBtn);

      var playlistFavBtn = $("<button>");
      playlistFavBtn
        .attr("class", "btn btn-primary flex-fill favsButton")
        .attr("data-songName", playlistTracksArray[i].songTitle)
        .attr("data-artistName", playlistTracksArray[i].songArtist)
        .attr("data-coverImg", playlistTracksArray[i].coverImage);
      playlistFavBtn.text("Add to Favs");
      playlistButtonDiv.append(playlistFavBtn);
    }

    $("#playlistContainer").append(playlistRow);
  });
}

// When the 'Add to favourites' button is clicked, save song to local storage
$(document).on("click", ".favsButton", function () {
  $("#favourites").empty();
  var songs = JSON.parse(localStorage.getItem("songData")) || [];
  var songObject = {
    image: $(this).attr("data-coverImg"),
    songTitle: $(this).attr("data-songName"),
    songArtist: $(this).attr("data-artistName")
  };
  songs.push(songObject);
  localStorage.setItem("songData", JSON.stringify(songs));

  $('.resultContainer').removeClass('col-md-6 col-lg-3 ').addClass('col-xl-4 col-lg-4 col-md-6');
  $('aside').show();
  $('#resultsDiv').addClass('col-lg-8 col-md-9');
  
  // Execute function that shows favourites cards
  showFavourites();
});

showFavourites();
showPlaylist();


if(!localStorage.getItem('songData')) {
  $('aside').hide();
  $('#resultsDiv').removeClass('col-lg-8 col-md-9');
} else {
  $('aside').show();
};