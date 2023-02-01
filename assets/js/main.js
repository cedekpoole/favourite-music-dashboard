console.log("hey");

let artist = "eminem"

let settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://deezerdevs-deezer.p.rapidapi.com/search?q=" + artist,
	"method": "GET",
	"headers": {
		"X-RapidAPI-Key": "ca3e3b7c4dmshcf0d18644a9b128p15b157jsnca8487f0f2a9",
		"X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com"
	}
};

$.ajax(settings).done(function (response) {
	console.log(response);
});


