let searched = [];

$('#search-button').on("click", function() {
    var searchValue = $('#search-value').val();
    // clear input box
    $('#search-value').val("");
    console.log(searchValue);
    //searchWeather(searchValue);
    geocode(searchValue);
    
    saveSearches(searchValue); 
    loadSearched();
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
        $("#todayweather").empty();
        var coloruv = response.current.uvi; 
        var classtype =""; 

        if(coloruv > 6) {
            classtype= "btn-danger"
        } else if (coloruv > 4){
            classtype = "btn-warning"
        } else {
            classtype = "btn-success"
        };

        var temp = ("<h2>" + "Current temp: " + response.current.temp + "F" + "</h2>");
        var humidity = ("<h2>" + "Current humidity: " + response.current.humidity + "%" + "</h2>");
        var wind = ("<h2>" + "Current wind: " + response.current.wind_speed + " mph" + "</h2>");
        var uvindex = (`<button class="${classtype}">` + "Current UV index: " + response.current.uvi + "</button>");
        

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
        for(var i = 1; i < response.daily.length -2; i++) {
        var forcastedDay = ("<h1>" + moment.unix(response.daily[i].dt).format("dddd") + "</h1>");
        var currenttemp = ("<h2>" +"Forcasted temp: " + response.daily[i].temp.day + " F" + "</h2>");
        var wind = ("<h2>" + "Wind: " + response.daily[i].wind_speed + " mph" + "</h2>");
        var humidity = ("<h2>" + "Humidity: " + response.daily[i].humidity + "%" + "</h2>");
        var uvindex = ("<h2>" +" UV index: " + response.daily[i].uvi + "</h2>");

           

        

        var card = $("<div>").addClass("card").append(forcastedDay, currenttemp, wind, humidity, uvindex); 
        $("#fiveforecast").append(card);
        }
        
    });
}

// create local storage function pass in searchvalue field 
let saveSearches = function (searchValue) {

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
    $(".history ").empty();
   if(searched.length > 0) {
        for (var i = 0; i < searched.length; i++) {

            var searchedCity = ("<li><button>" + searched[i] + "</button></li>");
            //$(".history").on("click", function () { geocode(searched[i])});
        
            var card = $("<div>").addClass("btn").append(searchedCity);
            $(".history").append(card);

        }
    }
    return searched;
};

if(searched.length > 0){
loadSearched(); 
}
