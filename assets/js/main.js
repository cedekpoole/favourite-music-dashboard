console.log("hey");

function showLyricData() {
    // Using jQuery, connect this to the value of the search input
    let artist = $('#search-input').val();

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

        var songResults = songResponse.data;
        var songResultsArray = [];

        
        // var resultsHeading = $('<h2> Songs by ' + artist.toUpperCase() + '</h2>');
        // resultsHeading.attr('class', 'px-2 mt-4');
        // $('#main').append(resultsHeading);

        $.each(songResults, function (index, value) {
            if (index == 9) {
                return false;
            }
            songsObj = {
                songTitle: value.title,
                songArtist: value.artist.name,
                coverImage: value.album.cover,
                songAlbum: value.album.title
            }
            console.log(songsObj);

            songResultsArray.push(songsObj);
        });

        for (let i = 0; i < songResultsArray.length; i++) {
            
        };




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
}
showLyricData()

$("#search-button").on("click", showLyricData);


