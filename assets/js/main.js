console.log("hey");

$("#invalid-input").hide();

function showLyricData(e) {

  e.preventDefault();
  // Using jQuery, connect this to the value of the search input
  let artist = $('#search-input').val();

  //clearing search input field
  $('#search-input').val('');

  // adding heading for chosen artist
  var resultsHeading = $('<h2> Songs by ' + artist + '</h2>');
  resultsHeading.attr('class', 'px-2 mt-4');
  resultsHeading.css('textTransform', 'capitalize');
  $('#main').prepend(resultsHeading);



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
    if (songResponse.error) {
      resultsHeading.hide();
      $("#invalid-input").show();
      // remove the pop up after a designated amount of time
      setTimeout(() => {
        $("#invalid-input").hide();
      }, 2000);
    }
    // store song response information
    var songResults = songResponse.data;
    var songResultsArray = [];

    // loop through the data for the first 9 responses
    $.each(songResults, function (index, value) {
      if (index == 12) {
        return false;
      }
      // get the title, artist, cover image and album for each song
      songsObj = {
        songTitle: value.title,
        songArtist: value.artist.name,
        coverImage: value.album.cover,
        songAlbum: value.album.title
      }
      console.log(songsObj);

      songResultsArray.push(songsObj);
    });

    currentIteration = 0;
    var row = $('<div class="row w-100 justify-content-between"></div>');

    // loop through the stored song info and display in bootstrap cards
    for (let i = 0; i < songResultsArray.length; i++) {
      if (currentIteration % 4 === 0) {
        row = $('<div class="row w-100 justify-content-between align-items-stretch"></div>');
        $('#cardContainer').append(row);
      }
      //create div to hold each card
      var songResultContainer = $('<div>');
      songResultContainer.attr('class', 'col-lg-2 col-sm-6 flex-fill');
      row.append(songResultContainer);

      //create bootstrap card
      var songResultCard = $('<div>');
      songResultCard.attr('class', 'card result mt-4 w-100');
      // songResultCard.attr('style', 'width: 12rem;');
      songResultContainer.append(songResultCard);

      //add image to card
      var songResultImg = $('<img>');
      songResultImg.attr('class', 'card-img-top');
      songResultImg.attr('src', songResultsArray[i].coverImage);
      songResultCard.append(songResultImg);

      // add card body div
      var songResultCardBody = $('<div>');
      songResultCardBody.attr('class', 'card-body');
      songResultCard.append(songResultCardBody);

      //add song title heading
      var songResultTitle = $('<h2>');
      songResultTitle.attr('class', 'card-title');
      songResultTitle.attr('style', 'font-size: calc(.5rem + .9vw) !important;')
      songResultTitle.text(songResultsArray[i].songTitle);
      songResultCardBody.append(songResultTitle);

      // add line
      var songResultDivider = $('<hr>');
      songResultDivider.attr('class', 'hr');
      songResultCardBody.append(songResultDivider);

      //add album name
      var songResultAlbumName = $('<h3>');
      songResultAlbumName.attr('style', 'font-size: calc(.5rem + .6vw) !important;');
      songResultAlbumName.text('Album: ' + songResultsArray[i].songAlbum);
      songResultCardBody.append(songResultAlbumName);

      //add buttons div
      var songResultButtonDiv = $('<div>');
      songResultButtonDiv.attr('class', 'd-flex flex-wrap');
      songResultCardBody.append(songResultButtonDiv);

      //add buttons to div
      var songResultLyricsBtn = $('<button>');
      songResultLyricsBtn.attr('class', 'btn btn-primary flex-fill');
      songResultLyricsBtn.attr('style', 'margin-right: .5rem !important;');
      songResultLyricsBtn.text('View Lyrics');
      songResultButtonDiv.append(songResultLyricsBtn);

      var songResultFavBtn = $('<button>');
      songResultFavBtn.attr('class', 'btn btn-primary flex-fill');
      songResultFavBtn.text('Add to Favs');
      songResultButtonDiv.append(songResultFavBtn);

      currentIteration++;

    };

    $('#cardContainer').append(row);



    // AJAX REQUEST FOR LYRICS
    // var queryURL =
    //     "https://some-random-api.ml/lyrics?title=" +
    //     songResponse.data[0].artist.name +
    //     " " +
    //     songResponse.data[0].title;
    // // Send ajax request for lyrics data
    // $.ajax({
    //     url: queryURL,
    //     method: "GET",
    // }).then(function (response) {
    //     console.log(response.lyrics);
    // });
  });

  // ***** NOT WORKING FOR NOW *********
  // .fail(() => {
  // 	// if the ajax request fails, create a pop up asking the user to pick
  // 	// a valid artist
  // 	var cardEl = $("<div>").attr("class", "card");
  // 	var cardBody = $("<div>")
  // 	  .attr("class", "card-body p-2 border border-danger")
  // 	  .text("Please put a valid artist!");
  // 	cardEl.append(cardBody);
  // 	$("#search-form").append(cardEl);
  // 	// remove the pop up after a designated amount of time
  // 	setTimeout(() => {
  // 	  cardEl.remove();
  // 	}, 1800);
  //   });
};

$("#search-button").on("click", showLyricData);

// $("#favourites").empty()
// var songs = JSON.parse(localStorage.getItem("songData")) || [];
//   var songObject = {
//     image: response.album.cover,
//     songTitle: response.name,
//   };
// songs.push(songObject);
// localStorage.setItem("songData", JSON.stringify(songs));

function showFavourites() {
  var songs = JSON.parse(localStorage.getItem("songData")) || [];
  for (var song of songs) {
    var card = $("<div>");
    card.attr("class", "card mb-3").attr("style", "max-width: 540px;");
    card.html(
      '<div class="row g-0">' +
      '<div class="col-md-4">' +
      '<img src="' + song.image + '" class="img-fluid rounded-start"' +
      'alt="...">' +
      '</div>' +
      '<div class="col-md-8 d-flex flex-column p-3">' +
      '<div class="mb-auto pt-3">' +
      '<h5 class="card-title">' + song.songTitle + '</h5>' +
      '</div>' +
      '<div class="pb-2">' +
      '<button class="btn btn-primary">View Lyrics</button>' +
      '</div>' +
      '</div>' +
      '</div>'
    )
    $("#favourites").append(card)

  }
}

function clearFavourites() {
  $("#favourites").empty();
  localStorage.clear()
}

$("#clearFavourites").on("click", clearFavourites);

$("#testButton").on("click", showModal);

function showModal(e) {
  e.preventDefault();

  $("#lyricsModalTitle").text("Sweet Caroline" + " - Lyrics")
  $("#lyricsModalContent").html(`Where it began,\nI can't begin to knowin'\nBut then I know it's growing strong\nWas in the spring\nAnd spring became the summer\nWho'd have believed you'd come along.\n\nHands, touchin' hands\nReachin' out, touchin' me touchin' you\nSweet Caroline\nGood times never seemed so good\nI've been inclined\nTo believe they never would\nBut now I, look at the night\nAnd it don't seem so lonely\nWe fill it up with only two.\n\nAnd when I hurt,\nHurtin' runs off my shoulders\nHow can I hurt when I'm with you\nWarm, touchin' warm\nReachin' out, touchin' me touchin' you\nSweet Caroline\nGood times never seemed so good\nI've been inclined,\nTo believe they never would\nOh, no, no\n\nSweet Caroline\nGood times never seemed so good\nSweet Caroline,\nI believe they never could\nSweet Caroline.........`);// LOCAL STORAGE STUFF (will go in showLyricData function later)
  $("#lyricsModal").modal("show");
}