

$('#search-button').on("click", function() {
    var searchValue = $('#search-value').val();
    // clear input box
    $('#search-value').val("");
    console.log(searchValue);
    //searchWeather(searchValue);
    geocode(searchValue);
});


// Function to search for weather
function geocode(searchValue) {
    var queryURL = `http://api.openweathermap.org/geo/1.0/direct?q=${searchValue}&appid=501e095823f225748a2af769f77fc9de`;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        searchWeather(response[0].lat, response[0].lon);
        forcastWeather(response[0].lat, response[0].lon);
    });
}

function searchWeather(lat, lon) {
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly&appid=501e095823f225748a2af769f77fc9de`;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        var temp = ("<h2>" + "Current temp: " + response.main.temp + "F" + "</h2>");

        // if uvi is less than 3 , give button of success (green)
        // if uvi is less than 6 , give button of warning (yellow)
        // if uvi is less than 8 , give button of danger (red)
        var card = $("<div>").addClass("card").append(temp);
        $("#todayweather").append(card);
    });
}

function forcastWeather(lat, lon) {
    var queryURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly&appid=501e095823f225748a2af769f77fc9de`;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        for(var i = 0; i < response.daily.length; i++) {
        var currenttemp = ("<h2>" + "Current temp: " + response.daily[i].temp + "F" + "</h2>");

        // if uvi is less than 3 , give button of success (green)
        // if uvi is less than 6 , give button of warning (yellow)
        // if uvi is less than 8 , give button of danger (red)
        var card = $("<div>").addClass("card").append(currenttemp);
        $("#fiveforecast").append(card);
        }
        
    });
}