console.log("hey");

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

        // loop through the stored song info and display in bootstrap cards
        for (let i = 0; i < songResultsArray.length; i++) {
            if (currentIteration % 4 === 0) {
                row = $('<div class="row w-100 justify-content-between"></div>');
                $('#cardContainer').append(row);
            }
            //create div to hold each card
            var songResultContainer = $('<div>');
            songResultContainer.attr('class', 'col-lg-2 col-sm-6 justify-content-between');
            row.append(songResultContainer);

            //create bootstrap card
            var songResultCard = $('<div>');
            songResultCard.attr('class', 'card result mt-4');
            // songResultCard.attr('style', 'width: 18rem;');
            songResultContainer.append(songResultCard);

            //add image to card
            var songResultImg = $('<img>');
            songResultImg.attr('class', 'card-img-top');
            songResultImg.attr('src', songResultsArray[i].coverImage);
            songResultCard.append(songResultImg);

            // var songResultBody = 

            currentIteration++;

        };

        $('#cardContainer').append(row);




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
};

$("#search-button").on("click", showLyricData);


