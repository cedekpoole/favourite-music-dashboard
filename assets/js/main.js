var resultsHeading = $("#resultsHeading");
resultsHeading.hide();

var playlistHeading = $('#playlistHeading');
playlistHeading.hide();

$("#clearFavourites").hide();
$('#backButton').hide();

//setting currentIndex for api url
currentIndex = -12;

//function to show the search result data
function showLyricData(e) {

  $('#loadMoreButton').show();
  //add loading spinner to show when response is loading
  var loadingSpinner = $("<div>").html(
    '<div id="spinnerContainer" class="d-flex justify-content-center align-items-center flex-column">' +
    '<div id="pageLoadSpinner" class="spinner-border mb-3" role="status">' +
    "</div>" +
    '<h3>Loading your songs...</h3>' +
    "</div>"
    );
    $("#main").prepend(loadingSpinner);
    loadingSpinner.show();
    
    // set the artist variable to either the 'search' key value or value of the search input
    let artist = JSON.parse(localStorage.getItem('search')) || $('#search-input').val();
    // add the artist variable to localStorage
    localStorage.setItem('search', JSON.stringify(artist));
    
    // Ajax request for artist + song (Deezer API)
    let settings = {
    async: true,
    crossDomain: true,
    url: "https://deezerdevs-deezer.p.rapidapi.com/search?q=" + artist + "&index=" + currentIndex + "&limit=12",
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "ca3e3b7c4dmshcf0d18644a9b128p15b157jsnca8487f0f2a9",
      "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
    },
  };
  
  $.ajax(settings).done(function (songResponse) {
    
    // Account for both submitting an empty string or writing an
    // unknown artist or song. Only writing an empty string (or ajax request limit problems etc)
    //creates a response error object, otherwise it just returns an response object with a total of 0
    loadingSpinner.hide();
    if (songResponse.error) {
      invalidSearch(artist, true);
    } else if (songResponse.total === 0) {
      $('#search-input').val('');
      invalidSearch(artist, false);
      $
    } else {
      
      $('#backButton').show();
      $("#playlistHeading").hide();
      $("#playlistContainer").empty();
      //check if event was triggered by the search button
      if (e !== undefined && e[0].id === "search-button") {
        $("#cardContainer").empty();
      }
      
      //add another 12 to the currentIndex to loop through the results of the api
      currentIndex += 12;
      // adding artist name to h2
      resultsHeading.text("Top Results for " + artist);
      resultsHeading.show();
      
      // store song response information
      var songResults = songResponse.data;
      var songResultsArray = [];
      
      // loop through the data for the first 12 responses
      $.each(songResults, function (index, value) {
        
        // get the title, artist, cover image and album for each song
        songsObj = {
          songTitle: value.title,
          songArtist: value.artist.name,
          coverImage: value.album.cover_big,
          songAlbum: value.album.title,
        };

        songResultsArray.push(songsObj);
      });

      var row = $('<div class="row w-100 justify-content-between"></div>');


      // loop through the stored song info and display in bootstrap cards
      for (let i = 0; i < 12 && i < songResultsArray.length; i++) {
        //create div to hold each card
        var songResultContainer = $("<div>");
        if (!localStorage.getItem("songData")) {
          songResultContainer.attr(
            "class",
            "resultContainer col-md-6 col-lg-3  flex-fill d-flex align-items-stretch"
          );
        } else {
          songResultContainer.attr(
            "class",
            "resultContainer col-xl-4 col-lg-4 col-md-6 flex-fill d-flex align-items-stretch"
          );
        }
        row.append(songResultContainer);

        //create bootstrap card
        var songResultCard = $("<div>");
        songResultCard.attr("class", "card result mt-4 w-100");
        // songResultCard.attr('style', 'width: 12rem;');
        songResultContainer.append(songResultCard);

        //add image to card
        var songResultImg = $("<img>");
        songResultImg.attr("class", "card-img-top");
        songResultImg.attr(
          "src",
          songResultsArray[i].coverImage
            ? songResultsArray[i].coverImage
            : "assets/images/default-cover-art.jpg"
        );
        songResultCard.append(songResultImg);

        // add card body div and add song data attributes to the card
        var songResultCardBody = $("<div>");
        songResultCardBody
          .attr("class", "d-flex card-body flex-column")
          .attr("data-songName", songResultsArray[i].songTitle)
          .attr("data-artistName", songResultsArray[i].songArtist)
          .attr("data-coverImg", songResultImg.attr("src"));
        songResultCard.append(songResultCardBody);

        //add song title heading
        var songResultTitle = $("<h2>");
        songResultTitle.attr("class", "card-title");
        songResultTitle.attr(
          "style",
          "font-size: calc(1rem + .5vw) !important; margin-bottom: 0 !important;"
        );
        songResultTitle.text(songResultsArray[i].songTitle);
        songResultCardBody.append(songResultTitle);

        // add line
        var songResultDivider = $("<hr>");
        songResultDivider.attr("class", "hr");
        songResultDivider.attr(
          "style",
          "margin: .5rem 0 !important; color: white;"
        );
        songResultCardBody.append(songResultDivider);

        //add artist name
        var songResultArtistName = $("<h3>");
        songResultArtistName.attr(
          "style",
          "font-size: calc(.8rem + .2vw) !important; margin-bottom: 0;"
        );
        songResultArtistName.text("Artist: " + songResultsArray[i].songArtist);
        songResultCardBody.append(songResultArtistName);

        // add line
        var songResultDivider = $("<hr>");
        songResultDivider.attr("class", "hr");
        songResultDivider.attr(
          "style",
          "margin: .5rem 0 !important; color: white;"
        );
        songResultCardBody.append(songResultDivider);

        //add album name
        var songResultAlbumName = $("<h3>");
        songResultAlbumName.attr(
          "style",
          "font-size: calc(.8rem + .2vw) !important; margin-bottom: 2rem;"
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
          "btn btn-primary button flex-fill lyricsButton"
        );
        // songResultLyricsBtn.attr("style", "margin-right: .5rem !important;");
        songResultLyricsBtn.text("View Lyrics");
        songResultButtonDiv.append(songResultLyricsBtn);

        var songResultFavBtn = $("<button>");
        songResultFavBtn.attr("class", "btn btn-primary button flex-fill favsButton");
        songResultFavBtn.text("Add to Favs");
        songResultButtonDiv.append(songResultFavBtn);

      }

      // if there is currently no load more button
      if (!$('#loadMoreButton').length) {
        // add button
        var loadMoreButton = $('<button id="loadMoreButton">Load More  <i class="fa-solid fa-arrow-down"></i></button>');
        var loadMoreButtonDiv = $('<div class="d-flex justify-content-center align-items-center>"</div>');
        $(loadMoreButtonDiv).append(loadMoreButton);
        $('#main').append(loadMoreButtonDiv);
        $('#loadMoreButton').attr('class', 'btn btn-primary button m-4');


        // when button clicked, redo the api
        $('#loadMoreButton').on('click', function () {
          $('html, body').animate({
            scrollTop: $(window).scrollTop() + $(window).height() * 0.5
          }, 'slow');
          // set artist to last input search
          artist = localStorage.getItem('search');
          showLyricData();
          //add 12 to currentIndex to show next set of data
          currentIndex += 12;
        })
      }

      $("#cardContainer").append(row);
      $('#search-input').val('');
    }
  });
}

// function to show the playlist screen
function showPlaylist() {


  const settings = {
    async: true,
    crossDomain: true,
    url: "https://deezerdevs-deezer.p.rapidapi.com/playlist/915487765&index=" + currentIndex + "&limit=12",
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "ca3e3b7c4dmshcf0d18644a9b128p15b157jsnca8487f0f2a9",
      "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
    },
  };

  $.ajax(settings).done(function (playlistResponse) {

    if (playlistResponse.error) {
      setTimeout(function () {
        showPlaylist();
      }, 200);
    }
    else {
      currentIndex += 12;
      // store song response information
      var playlistTracks = playlistResponse.tracks.data;
      var playlistTracksArray = [];

      // loop through the data
      $.each(playlistTracks, function (index, value) {

        // get the title, artist, cover image and album for each song
        playlistObj = {
          songTitle: value.title,
          songArtist: value.artist.name,
          coverImage: value.album.cover_big,
          songAlbum: value.album.title,
        };

        playlistTracksArray.push(playlistObj);
      });

      var playlistRow = $(
        '<div class="row w-100 justify-content-between"></div>'
      );

      playlistHeading.text("Hits UK Playlist");
      playlistHeading.show();

      const columns = 12;


      // loop through the stored song info and display in bootstrap cards
      for (let i = 0; i < 12 && i < playlistTracksArray.length; i++) {
        //create div to hold each card
        var playlistTracksContainer = $("<div>");

        //if there are not items in favourites
        if (!localStorage.getItem("songData")) {
          //make the bootstrap cols be 4 per row
          playlistTracksContainer.attr(
            "class",
            "resultContainer col-md-6 col-lg-3  flex-fill d-flex align-items-stretch"
          );
        } else {
          // if favourites bar up, make bootstrap cols be 3 per son
          playlistTracksContainer.attr(
            "class",
            "resultContainer col-xl-4 col-lg-4 col-md-6 flex-fill d-flex align-items-stretch"
          );
        }
        playlistRow.append(playlistTracksContainer);

        //create bootstrap card, add data attributes to card
        var playlistCard = $("<div>");
        playlistCard
          .attr("class", "card result mt-4 w-100")
          .attr("data-songName", playlistTracksArray[i].songTitle)
          .attr("data-artistName", playlistTracksArray[i].songArtist)
          .attr("data-coverImg", playlistTracksArray[i].coverImage);
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
          "font-size: calc(1rem + .5vw) !important; margin-bottom: 0 !important;"
        );
        playlistTitle.text(playlistTracksArray[i].songTitle);
        playlistCardBody.append(playlistTitle);

        // add line
        var playlistDivider = $("<hr>");
        playlistDivider.attr("class", "hr");
        playlistDivider.attr(
          "style",
          "margin: .5rem 0 !important; color: white;"
        );
        playlistCardBody.append(playlistDivider);

        // add artist
        var playlistArtistName = $("<h3>");
        playlistArtistName.attr(
          "style",
          "font-size: calc(.8rem + .2vw) !important; margin-bottom: 0 !important;"
        );
        playlistArtistName.text("By " + playlistTracksArray[i].songArtist);
        playlistCardBody.append(playlistArtistName);

        // add line
        var playlistDivider2 = $("<hr>");
        playlistDivider2.attr("class", "hr");
        playlistDivider2.attr(
          "style",
          "margin: .5rem 0 !important; color: white;"
        );
        playlistCardBody.append(playlistDivider2);

        //add album name
        var playlistAlbumName = $("<h3>");
        playlistAlbumName.attr(
          "style",
          "font-size: calc(.8rem + .2vw) !important; margin-bottom: 2rem;"
        );
        playlistAlbumName.text("Album: " + playlistTracksArray[i].songAlbum);
        playlistCardBody.append(playlistAlbumName);

        //add buttons div
        var playlistButtonDiv = $("<div>");
        playlistButtonDiv.attr("class", "d-flex flex-wrap gap-2 mt-auto");
        playlistCardBody.append(playlistButtonDiv);

        //add buttons to div
        var playlistLyricsBtn = $("<button>");
        playlistLyricsBtn.attr("class", "btn btn-primary button flex-fill lyricsButton");
        // songResultLyricsBtn.attr("style", "margin-right: .5rem !important;");
        playlistLyricsBtn.text("View Lyrics");
        playlistButtonDiv.append(playlistLyricsBtn);

        var playlistFavBtn = $("<button>");
        playlistFavBtn.attr("class", "btn btn-primary button flex-fill favsButton");
        playlistFavBtn.text("Add to Favs");
        playlistButtonDiv.append(playlistFavBtn);

        //if the number of columns generated by the data doesn't fit the assigned number of columns
        if (i === playlistTracksArray.length - 1) {
          let remainingColumns = columns - playlistTracksArray.length % columns;
          // set the empty columns depending on whether the favourites are shown
          for (let j = 0; j < remainingColumns; j++) {
            let emptyColumn = $('<div>');
            if (!localStorage.getItem('songData')) {
              emptyColumn
                .attr(
                  "class",
                  "resultContainer col-md-6 col-lg-3  flex-fill d-flex align-items-stretch"
                );
            } else {
              emptyColumn
                .attr(
                  "class",
                  "resultContainer col-xl-4 col-lg-4 col-md-6 flex-fill d-flex align-items-stretch"
                );
            };
            // add columns to the row
            playlistRow.append(emptyColumn);
          }
        }
      }

      // if there is no load more button, make button
      if (!$('#loadMoreButton2').length) {
        var loadMoreButton2 = $('<button id="loadMoreButton2">Load More  <i class="fa-solid fa-arrow-down"></i></button>');
        var loadMoreButtonDiv2 = $('<div class="d-flex justify-content-center align-items-center>"</div>');
        $(loadMoreButtonDiv2).append(loadMoreButton2);
        $('#main').append(loadMoreButtonDiv2);
        $('#loadMoreButton2').attr('class', 'btn btn-primary button m-4');

        // when load more clicked, re run the api and show additional data with new index
        $('#loadMoreButton2').on('click', function () {
          $('html, body').animate({
            scrollTop: $(window).scrollTop() + $(window).height() * 0.5
          }, 'slow');
          if (playlistTracksArray.length - currentIndex < 12) {
            $('#loadMoreButton2').hide();

          };
          currentIndex += 12;
          resultsHeading.hide();
          showPlaylist();

        })
      }

      $("#playlistContainer").append(playlistRow);
    }
  }).catch(function () {
    showPlaylist()
  });
}

// A function that reveals favourite song cards
function showFavourites() {
  // If nothing is saved to local storage, set the variable to an empty array
  var songs = JSON.parse(localStorage.getItem("songData")) || [];
  // Loop through local storage to create a card for each song
  for (var song of songs) {
    var card = $("<div>");
    card
      .attr("class", "favCards card mb-3")
      .attr("style", "max-width: 540px;")
      .attr("data-songName", song.songTitle)
      .attr("data-artistName", song.songArtist)
      .attr("data-coverImg", song.image);
    card.html(
      '<div class="row d-flex flex-row flex-md-wrap flex-lg-nowrap g-0">' +
      '<div class="flex-fill d-flex d-sm-block">' +
      '<img src="' +
      song.image +
      '" class=" favCardImg h-100 w-100"' +
      'alt="...">' +
      "</div>" +
      '<div class="flex-fill d-flex flex-column justify-content-center align-items-center p-3 favCardBody">' +
      '<div class="mb-1 pt-3 text-center">' +
      '<h5 class="card-title">' +
      song.songTitle +
      "</h5>" +
      "</div>" +
      '<div class="d-flex flex-wrap gap-2 pb-2 text-center">' +
      '<button class="btn btn-primary button button flex-fill lyricsButton">View Lyrics</button>' +
      '<button class="btn btn-danger button flex-fill deleteButton">Delete Song</button>' +
      "</div>" +
      "</div>" +
      "</div>"
    );
    $("#favourites").append(card);
    $("#clearFavourites").html(
      '<button id="clearFavsButton" class="btn rounded-sm btn-dark btn-block mt-3">Clear Favourites</button>'
    );
    // if there are no favourites, hide the clear favourites button
    if (songs.length === 0) {
      $("#clearFavourites").hide();
    } else {
      $("#clearFavourites").show();
    }
  }
}

// A function that removes songs from local data and clears favourites cards
function clearFavourites() {
  $("#favourites").empty();
  localStorage.clear();
  $("#clearFavourites").hide();

  // if there is no favourites, hide the favourites bar and adjust bootstrap classes for responsivity
  if (!localStorage.getItem("songData")) {
    $("aside").hide();
    $("#resultsDiv").removeClass("col-lg-8 col-md-9");
    $(".resultContainer")
      .removeClass("col-xl-4 col-lg-4 col-md-6")
      .addClass("col-md-6 col-lg-3 ");
  } else {
    $("aside").show();
  }
}

// when deezer ajax query fails, update the modal content to be an appropriate message to the error thrown
function invalidSearch(searchString, apiFail) {
  $("#lyricsModalTitle").text("Oops!");
  $("#retryButton").hide();

  if (searchString === "") {
    $("#lyricsModalContent").text(`You have to search for something!`);
  } else if (apiFail) {
    setTimeout(function () {
      showLyricData();
    }, 200);
    return

  } else {
    $("#lyricsModalContent").text(
      `We weren't able to find any results for "${searchString}"`
    );
  }
  $("#favouritesButton").hide();
  $(".modal-footer").show();
  $(".modal-body").show();
  $("#lyricsModal").modal("show");
}

// function to deal with duplicated favourites
function alreadyInFavesError() {
  $("#lyricsModalTitle").text("This song is already in your faves!");

  $(".modal-footer").hide();
  $(".modal-body").hide();
  $('#lyricsModal').modal('show'); // set command for show 
  setTimeout(function () {
    $('#lyricsModal').modal('hide');
  }, 2000);

}

// function to deal with modals
function showModal(e) {
  e.preventDefault();

  // get the songName, artistName and coverImg values from card containing lyric button
  var card = $(e.target).closest("[data-songName]");
  var songName = card.attr("data-songName");
  var artistName = card.attr("data-artistName");
  var coverImg = card.attr("data-coverImg");

  // Reset the modal content and add a spinner to show whilst content loads
  $("#lyricsModalTitle").empty();
  $("#favouritesButton").hide();
  $("#lyricsModalContent").html(
    '<div class="d-flex justify-content-center">' +
    '<div class="spinner-border"' +
    'role="status">' +
    "</div>" +
    "</div>"
  );
  $("#retryButton").hide();

  // get lyrics from api using stored song and artist name
  queryURL = "https://some-random-api.ml/lyrics?title=" + songName + artistName;

  $.ajax({
    url: queryURL,
    method: "GET",
  })
    .then(function (response) {
      // load ajax query information to modal title and conent div
      $("#lyricsModalTitle").text(`${songName} by ${artistName}  - Lyrics`);
      $("#lyricsModalContent").html(response.lyrics);

      $("#favouritesButton")
        .attr("data-songName", songName)
        .attr("data-artistName", artistName)
        .attr("data-coverImg", coverImg);
      $("#favouritesButton").show();
    })
    .fail(function () {
      // if ajax query fails, display an error message in modal
      $("#lyricsModalTitle").text("Oops!");
      $("#lyricsModalContent").text(
        "We weren't able to find lyrics for that song! :("
      );
      $("#favouritesButton").hide();
    });
  $(".modal-footer").show();
  $(".modal-body").show();
  $("#lyricsModal").modal("show");
}

// when the search button is clicked
$("#search-button").on("click", function (e) {
  e.preventDefault();
  //set the artist variable to the search input
  let artist = $('#search-input').val();
  // set 'search' as the search input value in localStorage
  localStorage.setItem('search', JSON.stringify(artist));

  showLyricData($(e.target));
  $('#loadMoreButton2').hide();
});

$("#retryButton").on("click", showLyricData);

// When 'clear favourites' button is clicked, clear favourites cards
$("#clearFavourites").on("click", clearFavourites);

// When 'delete song' button is clicked, remove that particular song from local storage
$(document).on("click", ".deleteButton", function () {
  $("#favourites").empty();
  var songData = JSON.parse(localStorage.getItem("songData"));
  var songObject = {
    image: $(this).closest("[data-coverImg]").attr("data-coverImg"),
    songTitle: $(this).closest("[data-songName]").attr("data-songName"),
    songArtist: $(this).closest("[data-artistName]").attr("data-artistName"),
  };
  var removeIndex = songData.findIndex(
    (song) => song.songTitle === songObject.songTitle
  );
  songData.splice(removeIndex, 1);
  localStorage.setItem("songData", JSON.stringify(songData));

  showFavourites();

  if (songData.length === 0) {
    clearFavourites();
  }
});

// when a lyrics button is clicked then showModal()
$(document).on("click", ".lyricsButton", showModal);

// When the 'Add to favourites' button is clicked, save song to local storage
$(document).on("click", ".favsButton", function (event) {

  $("#favourites").empty();
  var songs = JSON.parse(localStorage.getItem("songData")) || [];
  var songObject = {
    image: $(this).closest("[data-coverImg]").attr("data-coverImg"),
    songTitle: $(this).closest("[data-songName]").attr("data-songName"),
    songArtist: $(this).closest("[data-artistName]").attr("data-artistName"),
  };

  songs.push(songObject);
  // To stop duplication of the the songData objects, loop through the array and remove them
  //Use the reduce method to go through every item and see if we already have an object added to the accumulator with the same songObject as the current item.
  var uniqueSongs = songs.reduce((accumulator, current) => {
    if (
      !accumulator.find(
        (songObject) => songObject.songTitle === current.songTitle
      )
    ) {
      accumulator.push(current);
    }
    else {
      alreadyInFavesError()

    }
    return accumulator;
  }, []);

  localStorage.setItem("songData", JSON.stringify(uniqueSongs));

  $(".resultContainer")
    .removeClass("col-md-6 col-lg-3 ")
    .addClass("col-xl-4 col-lg-4 col-md-6");
  $("aside").show();
  $("#resultsDiv").addClass("col-lg-8 col-md-9");

  // Execute function that shows favourites cards
  showFavourites();
});

// if no favourites saved, hide the favourites bar and change bootstrap classes
if (!localStorage.getItem("songData")) {
  $("aside").hide();
  $("#resultsDiv").removeClass("col-lg-8 col-md-9");
} else {
  $("aside").show();
}

//when the page has loaded
$(document).ready(function () {
  $(window).scroll(function () {
    if ($(this).scrollTop() > 20) {
      $('#backToTop').fadeIn();
    } else {
      $('#backToTop').fadeOut();
    }
  });
  //when back to top button clicked, scroll to top of page
  $('#backToTop').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 'normal');
    return false;
  });

  // when back to playlist button clicked, hide and show correct containers
  $('#backButton').on('click', function () {
    $('#cardContainer').empty();
    $('#resultsHeading').hide();
    $('#loadMoreButton').hide();
    $('#loadMoreButton2').show();
    $('#backButton').hide();
    // set current index back to start
    currentIndex = -12;
    // show the playlist screen
    showPlaylist();
  });

});

//initially show the playlist screen and favourites if applicable
showFavourites();
showPlaylist();
