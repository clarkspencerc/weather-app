let searched = [];

$('#search-button').on("click", function() {
    var searchValue = $('#search-value').val();
    // clear input box
    $('#search-value').val("");
    console.log(searchValue);
    //searchWeather(searchValue);
    geocode(searchValue);
    saveSearches(searchValue);
    // loadSearched(); 
    // autofill(); 
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
    var queryURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=hourly&appid=501e095823f225748a2af769f77fc9de`;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var temp = ("<h2>" + "Current temp: " + response.current.temp + "F" + "</h2>");
        var humidity = ("<h2>" + "Current humidity: " + response.current.humidity + "%" + "</h2>");
        var wind = ("<h2>" + "Current wind: " + response.current.wind_speed + " mph" + "</h2>");
        var uvindex = ("<h2>" + "Current UV index: " + response.current.uvi + "</h2>");
    

        // if uvi is less than 3 , give button of success (green)
        // if uvi is less than 6 , give button of warning (yellow)
        // if uvi is less than 8 , give button of danger (red)
        
        // if (uvindex > 6) {
        //     card.addClass("red")
        // } else if (uvindex > 4) {
        //     card.addClass("yellow")
        // } else {
        //     card.addClass("green")
        // };
    var card = $("<div>").addClass("card").append(temp, humidity, wind, uvindex);
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
        var forcastedDay = ("<h1>" + "Date" + response.daily[i].dt + "day" + "</h1>");
        var currenttemp = ("<h2>" +"Forcasted temp: " + response.daily[i].temp.day + " F" + "</h2>");
        var wind = ("<h2>" + "Wind: " + response.daily[i].wind_speed + " mph" + "</h2>");
        var humidity = ("<h2>" + "Humidity: " + response.daily[i].humidity + "%" + "</h2>");
        var uvindex = ("<h2>" + " UV index: " + response.daily[i].uvi + "</h2>");

       

        // if(uvindex > 6) {
        //     card.addClass("red")
        // } else if (uvindex > 4){
        //     card.addClass("yellow")
        // } else {
        //     card.addClass("green")
        // };

        var card = $("<div>").addClass("card").append(forcastedDay, currenttemp, wind, humidity, uvindex); 
        $("#fiveforecast").append(card);
        }
        
    });
}

// create local storage function pass in searchvalue field 
let saveSearches = function (searchValue) {
    localStorage.setItem("searches", searched);
    if (searchValue !== "") {
        
        // only adds new searches - prevents duplicates in local storage
        if (!searched.includes(searchValue)) {

            searched.push(searchValue);
        }
        // saves to local storage
        localStorage.setItem("searches", JSON.stringify(searched));
    }
    // test 
    console.log(localStorage.getItem("searches"));
};

let loadSearched = function () {
    searched = localStorage.getItem("searches")
    searched = JSON.parse(searched);
   if(searched.length > 0) {
        for (var i = 0; i < searched.length; i++) {
            var searchedCity = ("<h2>" + searchedCity[i] + "</h2>");
        
            var btn = $("<button>").addClass("btn").append(btn);
            $(".history").append(card);

        }
    }
    return searched;
};

let autofill = function () {

    if (localStorage.getItem("searches")) {
        $("#search-value").autocomplete({
            source: loadSearched()
        }, {
            autoFocus: true,
            delay: 0
        });
    }


};