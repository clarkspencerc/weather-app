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
    var queryURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchValue}&appid=501e095823f225748a2af769f77fc9de`;
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
        var day = ("<h1>" + moment.unix(response.current.dt).format('MMM Do YYYY') + "</h1>");
        var temp = ("<h4>" + "Current temp: " + response.current.temp + "F" + "</h4>");
        var humidity = ("<h4>" + "Current humidity: " + response.current.humidity + "%" + "</h4>");
        var wind = ("<h4>" + "Current wind: " + response.current.wind_speed + " mph" + "</h4>");
        var uvindex = (`<button class="${classtype}">` + "Current UV index: " + response.current.uvi + "</button>");
        

    var card = $("<div>").addClass("card").append(day, temp, humidity, wind, uvindex);
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
        $("#fiveforecast").empty();
        for(var i = 1; i < response.daily.length -2; i++) {
        var forcastedDay = ("<h1>" + moment.unix(response.daily[i].dt).format("MMM Do YYYY") + "</h1>");
        var currenttemp = ("<h4>" +"Forcasted temp: " + response.daily[i].temp.day + " F" + "</h4>");
        var wind = ("<h4>" + "Wind: " + response.daily[i].wind_speed + " mph" + "</h4>");
        var humidity = ("<h4>" + "Humidity: " + response.daily[i].humidity + "%" + "</h4>");
        var uvindex = ("<h4>" +" UV index: " + response.daily[i].uvi + "</h4>");

           

        

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

            var searchedCity = ("<li><button class='btn-dark'>" + searched[i] + "</button></li>");
        
        var card = $("<div>").addClass("btn btn-dark").append(searchedCity);
        card.attr('id', `${searched[i]}`);
        $(".history").append(card);

            $('.history').on("click", function () {
                // var searchValue = $('#search-value').val();
                // searchValue.value = searched[i];
                // console.log(searchValue);
        // cityName = this.id; 
        // console.log(cityName);
        // var searchValue = $(this).children('li').text();
        // console.log("========");
        // console.log(searchValue);
        // console.log("========");
        // geocode(searchValue);
        
        // console.log(event.name);
        // console.log("++++++++++++"); 
        // console.log(searched[i].searchValue);
          $("#todayweather").empty();
        $("#fiveforecast").empty();
          geocode(searched[i]); 
        
        });

        }
        
    }

};

// $('.history').on("click", function(){
//     var t = $(this).attr('id');
//     console.log(t);
    
// });


if(searched.length > 0){
loadSearched(); 
}
